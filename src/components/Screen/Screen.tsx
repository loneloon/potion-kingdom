import React, { ReactElement, useCallback, useState, useRef } from "react";
import { Reel } from "../Reel/Reel";
import style from './Screen.less'
import animations from '../../assets/styles/animations.less'
import { SpinButton } from "../SpinButton/SpinButton";
import { FetchSlotsGame, SlotsGameDto, SymbolClusterDto } from "../../hooks/fetch";
import monkaW from '../../assets/img/monkaW.png'

export interface ScreenProps {
    height: number;
    width: number;
    starterBalance: number;
}

const defaultSpinCost = 100

export function Screen({height , width, starterBalance }: ScreenProps): ReactElement {
    const [gameResultDto, setGameResultDto] = useState<SlotsGameDto | null>(null)
    const userBalance = useRef(starterBalance)
    const previousWin = useRef(0)

    const spinButton = document.getElementById('spinButton') as HTMLButtonElement
    
    let fastWinAmount: number = 0
    let slowWinAmount: number = 0

    if (gameResultDto) {
        hideAllReels()
        userBalance.current = userBalance.current - defaultSpinCost + previousWin.current
        spinButton.disabled = true
        spinButton.innerText = "🔒"
    }

    const [screenLayout, matches, clusters] = gameResultDto ? parseSlotsGameDto(gameResultDto) : [{}]

    if (matches) {
        clusters.forEach((cluster, idx) => {
            fastWinAmount += defaultSpinCost * cluster.payout_modifier
            setTimeout(() => {
            setTimeout(() => {
                slowWinAmount += defaultSpinCost * cluster.payout_modifier
                lightUpCellCluster(cluster, slowWinAmount)
            }, idx*500);
        }, 2500);
        })

        setTimeout(() => {
            const userBalanceDisplay = document.getElementById('userBalance')
            userBalanceDisplay.innerText = (userBalance.current + fastWinAmount).toFixed(2)
            
            spinButton.disabled = false
            spinButton.innerText = "SPIN"
        }, 4000)
    } else {
        setTimeout(() => {
            spinButton.disabled = false
            spinButton.innerText = "SPIN"
        }, 4000)
    }

    previousWin.current = fastWinAmount

    const handleGameRequest = useCallback(async () => {
        return await FetchSlotsGame();
      }, []);

    return (
        
    <div className={style.screenWrapper}>
        <div className={style.screenOverlay}>
            <div className={style.winText} id={'wintext'}></div>
            </div>
        <div onLoad={reelAnimationSequence} className={style.screen}>
            {Array(width).fill(0).map((_, i) => <Reel key={`reel-${i}`} reelId={i} height={height} screenLayout={screenLayout}/>)}
        </div>
        <div style={{display: "flex",justifyContent: "center", alignItems: "center"}}><img style={{width: "2rem", height: "2rem", marginRight: "10px"}} src={monkaW}/><div className={style.userBalance} id={'userBalance'}>{userBalance.current.toFixed(2)}</div></div>
        <SpinButton startGameFn={handleGameRequest} setGameResultDto={setGameResultDto}/>
    </div>

    )
}

const reelAnimationSequence = () => {
    const reels = Array(7).fill(0).map((_, i) => document.getElementById(`reel-${i}`))
    
    reels.forEach((reel, idx) => {
        setTimeout(() => {
            reel.style.visibility = "visible"
            reel.classList.add(animations['slide-in-blurred-top'])
        }, (idx+1) * 200);
    })

    setTimeout(() => {
        reels.forEach((reel) => {
            reel.classList.remove(animations['slide-in-blurred-top'])
        })
    }, 3000);
}

const hideAllReels = () => {
    const reels = Array(7).fill(0).map((_, i) => document.getElementById(`reel-${i}`))
    
    reels.forEach((reel, idx) => {
        reel.style.visibility = "hidden"
    })
}

const lightUpCellCluster = (cluster: SymbolClusterDto, winAmount: number) => {

const clusterCoordinates: string[] = cluster.coordinates.split(":")

const cells = clusterCoordinates.map((coordinates, i) => document.getElementById(`cell-${coordinates[0]}${coordinates[1]}`))

const textElement = document.getElementById('wintext')
textElement.style.visibility ="visible"
textElement.innerText = winAmount.toFixed(2)
textElement.classList.add(animations['heartbeat'])

setTimeout(() => {
    cells.forEach((cell) => {
        cell.classList.add(animations['fade-cell-image'])
        cell.classList.add(animations['flash-background-white'])
    })
}, 200);

setTimeout(() => {
    textElement.classList.remove(animations['heartbeat'])
    textElement.innerText = ""
    textElement.style.visibility="hidden"

    cells.forEach((cell) => {
        cell.classList.remove(animations['fade-cell-image'])
        cell.classList.remove(animations['flash-background-white'])
    })
}, 1600);
}

function parseSlotsGameDto(gameDto: SlotsGameDto): [{ [key: string]: string}, boolean, SymbolClusterDto[]] {
    return [gameDto.matrix, gameDto.matches, gameDto.clusters]
}
