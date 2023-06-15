import React, { ReactElement } from "react";
import style from "./Cell.less"
import tenFace from "../../assets/faces/symbol-ten.png"
import jackFace from "../../assets/faces/symbol-jack.png"
import queenFace from "../../assets/faces/symbol-queen.png"
import kingFace from "../../assets/faces/symbol-king.png"
import aceFace from "../../assets/faces/symbol-ace.png"

export interface CellProps {
    reelId: number;
    cellId: number;
    symbolIdx: string;
    symbol: string | null;
}

export function Cell({reelId, cellId, symbolIdx, symbol}: CellProps): ReactElement {
    let randomSymbolIdx = Math.floor(Math.random() * 5) + 1
    
    return (
        <div className={style.cell} id={`cell-${reelId}${cellId}`}>
            <img src={symbol ? resolveCellFaceByIdx(parseInt(symbol)) : resolveCellFaceByIdx(randomSymbolIdx)}/>
        </div>
    )
}

function resolveCellFaceByIdx(symbolIdx: number): string{
    switch (symbolIdx) {
        case 1:
            return tenFace
        case 2:
            return jackFace
        case 3:
            return queenFace
        case 4:
            return kingFace
        case 5:
            return aceFace
        default: 
            throw new Error("Unknown symbol index!")
    }
}
