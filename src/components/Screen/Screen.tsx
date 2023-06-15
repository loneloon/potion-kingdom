import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Reel } from "../Reel/Reel";
import style from './Screen.less'
import animations from '../../assets/styles/animations.less'
import { SpinButton } from "../SpinButton/SpinButton";
import { FetchSlotsGame, SlotsGameDto } from "../../hooks/fetch";

export interface ScreenProps {
    height: number;
    width: number;
}

export function Screen({height , width }: ScreenProps): ReactElement {
    const [gameResultDto, setGameResultDto] = useState<SlotsGameDto | null>(null)

    if (gameResultDto) {
        hideAllReels()
    }

    const [screenLayout, matches, clusters] = gameResultDto ? parseSlotsGameDto(gameResultDto) : [{}]

    if (matches) {
        clusters.forEach((cluster, idx) => {
            setTimeout(() => {
            setTimeout(() => {
                lightUpCellCluster(cluster)
            }, idx*500);
        }, 2500);
        })
    }

    const handleGameRequest = useCallback(async () => {
        return await FetchSlotsGame();
      }, []);

    return (
    <div className={style.screenWrapper}>
        <div onLoad={reelAnimationSequence} className={style.screen}>
            {Array(width).fill(0).map((_, i) => <Reel key={`reel-${i}`} reelId={i} height={height} screenLayout={screenLayout}/>)}
        </div>
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

const lightUpCellCluster = (clusterCoordinatesStr: string) => {

const clusterCoordinates: string[] = clusterCoordinatesStr.split(":")

const cells = clusterCoordinates.map((coordinates, i) => document.getElementById(`cell-${coordinates[0]}${coordinates[1]}`))

setTimeout(() => {
    cells.forEach((cell) => {
        cell.classList.add(animations['fade-cell-image'])
        cell.classList.add(animations['flash-background-white'])
    })
}, 200);

setTimeout(() => {
    cells.forEach((cell) => {
        cell.classList.remove(animations['fade-cell-image'])
        cell.classList.remove(animations['flash-background-white'])
    })
}, 1600);
}

function parseSlotsGameDto(gameDto: SlotsGameDto): [{ [key: string]: string}, boolean, string[]] {
    return [gameDto.matrix, gameDto.matches, gameDto.clusters.map((cluster) => cluster.coordinates)]
}
