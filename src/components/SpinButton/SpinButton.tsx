import React, { ReactElement } from "react";
import style from './SpinButton.less'


export interface SpinButtonProps {
    startGameFn: any,
    setGameResultDto: any
}

export function SpinButton({startGameFn, setGameResultDto}: SpinButtonProps): ReactElement {

    return (
        <button onClick={async () => {
            playSound('clickSound')
            setGameResultDto(await startGameFn())
        }} className={style.spinButton} id={'spinButton'}>SPIN</button>
    )
}

export const playSound = (id: string) => {
    const soundElement = document.getElementById(id) as HTMLAudioElement
        soundElement.load()
        soundElement.play()
}
