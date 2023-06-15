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
        <div onLoad={animationSequence} className={style.screen}>
            {Array(width).fill(0).map((_, i) => <Reel key={`reel-${i}`} reelId={i} height={height}/>)}
        </div>
    )
}

const animationSequence = () => {
    const reels = Array(7).fill(0).map((_, i) => document.getElementById(`reel-${i}`))
    reels.forEach((reel, idx) => {
        setTimeout(() => {
            reel.classList.add(animations['slide-in-blurred-top'])
        }, idx * 300);
    })

    setTimeout(() => {
        reels.forEach((reel) => {
            reel.classList.remove(animations['slide-in-blurred-top'])
        })
    }, 3000);
}
