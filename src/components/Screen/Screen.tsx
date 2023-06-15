import React, { ReactElement } from "react";
import { Reel } from "../Reel/Reel";
import style from './Screen.less'
import animations from '../../assets/styles/animations.less'

export interface ScreenProps {
    height: number;
    width: number;
}

export function Screen({height , width }: ScreenProps): ReactElement {

    return (
        <div onLoad={reelAnimationSequence} className={style.screen}>
            {Array(width).fill(0).map((_, i) => <Reel key={`reel-${i}`} reelId={i} height={height}/>)}
        </div>
    )
}

const reelAnimationSequence = () => {
    const reels = Array(7).fill(0).map((_, i) => document.getElementById(`reel-${i}`))
    
    reels.forEach((reel, idx) => {
        setTimeout(() => {
            reel.style.visibility = "visible"
            reel.classList.add(animations['slide-in-blurred-top'])
        }, idx * 200);
    })

    setTimeout(() => {
        reels.forEach((reel) => {
            reel.classList.remove(animations['slide-in-blurred-top'])
        })
    }, 3000);
}

const lightUpCellCluster = () => {

const cells = Array(7).fill(0).map((_, i) => document.getElementById(`cell-${i}${i}`))

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
