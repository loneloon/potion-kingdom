import React, { ReactElement } from "react";
import { Cell } from "../Cell/Cell";
import style from "./Reel.less"


export interface ReelProps {
    height: number;
    reelId: number;
    screenLayout: { [key: string]: string} | null
}

export function Reel({height, reelId, screenLayout}: ReelProps): ReactElement {

    return (
        <div className={style.reel} id={`reel-${reelId}`}>
            {Array(height).fill(0).map((_, i) => <Cell key={`cell-${i}`} reelId={reelId} cellId={i} symbolIdx={`${i}${reelId}`} symbol={screenLayout[`${reelId}${i}`] ?? null}/>)}
        </div>
    )
}
