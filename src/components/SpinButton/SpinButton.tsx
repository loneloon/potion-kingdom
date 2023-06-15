import React, { ReactElement } from "react";
import style from './SpinButton.less'


export interface SpinButtonProps {
    startGameFn: any,
    setGameResultDto: any
}

export function SpinButton({startGameFn, setGameResultDto}: SpinButtonProps): ReactElement {

    return (
        <button onClick={async () => setGameResultDto(await startGameFn())} className={style.spinButton}>SPIN</button>
    )
}

