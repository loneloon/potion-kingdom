import React, { ReactElement, useCallback, useState, useRef } from "react";
import { Reel } from "../Reel/Reel";
import style from "./Screen.less";
import animations from "../../assets/styles/animations.less";
import { SpinButton, playSound } from "../SpinButton/SpinButton";
import {
  FetchSlotsGame,
  SlotsGameDto,
  SymbolClusterDto,
} from "../../hooks/fetch";
import clickSound from "../../assets/audio/click.wav";
import reelSound from "../../assets/audio/reel-drop.mp3";
import winSound from "../../assets/audio/win.mp3";

export interface ScreenProps {
  gameProviderApiUrl: string;
  height: number;
  width: number;
  starterBalance: number;
  defaultSpinCost: number;
  defaultCurrency: string;
}

export function Screen({
  gameProviderApiUrl,
  height,
  width,
  starterBalance,
  defaultSpinCost,
  defaultCurrency,
}: ScreenProps): ReactElement {
  const handleAudio = useCallback(async (id: string) => {
    await playSound(id);
  }, []);

  const handleReelAnimationSequence = useCallback(
    async (audioMuted: boolean) => {
      const reels = Array(7)
        .fill(0)
        .map((_, i) => document.getElementById(`reel-${i}`));

      reels.forEach((reel, idx) => {
        setTimeout(() => {
          if (!audioMuted) {
            handleAudio(`reelSound-${idx}`);
          }
          reel.style.visibility = "visible";
          reel.classList.add(animations["slide-in-blurred-top"]);
        }, (idx + 1) * 300);
      });

      setTimeout(() => {
        reels.forEach((reel) => {
          reel.classList.remove(animations["slide-in-blurred-top"]);
        });
      }, 3000);
    },
    []
  );

  const handleReelAnimationSequenceWAudio = async () => {
    handleReelAnimationSequence(false);
  };
  const handleReelAnimationSequenceNoAudio = async () => {
    handleReelAnimationSequence(true);
  };

  const handleHideAllReels = useCallback(async () => {
    const reels = Array(7)
      .fill(0)
      .map((_, i) => document.getElementById(`reel-${i}`));

    reels.forEach((reel, idx) => {
      reel.style.visibility = "hidden";
    });
  }, []);

  const handleLightUpCluster = useCallback(
    async (cluster: SymbolClusterDto, winAmount: number) => {
      const clusterCoordinates: string[] = cluster.coordinates.split(":");

      const cells = clusterCoordinates.map((coordinates, i) =>
        document.getElementById(`cell-${coordinates[0]}${coordinates[1]}`)
      );

      const textElement = document.getElementById("wintext");
      textElement.style.visibility = "visible";
      textElement.innerText = winAmount.toFixed(2);
      textElement.classList.add(animations["heartbeat"]);

      setTimeout(() => {
        cells.forEach((cell) => {
          cell.classList.add(animations["fade-cell-image"]);
          cell.classList.add(animations["flash-background-white"]);
        });
      }, 200);

      setTimeout(() => {
        textElement.classList.remove(animations["heartbeat"]);
        textElement.innerText = "";
        textElement.style.visibility = "hidden";

        cells.forEach((cell) => {
          cell.classList.remove(animations["fade-cell-image"]);
          cell.classList.remove(animations["flash-background-white"]);
        });
      }, 1600);
    },
    []
  );

  const handleGameRequest = useCallback(async () => {
    handleReelAnimationSequenceWAudio();
    return await FetchSlotsGame(gameProviderApiUrl);
  }, []);

  // ============================================================================

  const [gameResultDto, setGameResultDto] = useState<SlotsGameDto | null>(null);
  const userBalance = useRef(starterBalance);
  const previousWin = useRef(0);

  const spinButton = document.getElementById("spinButton") as HTMLButtonElement;

  let fastWinAmount: number = 0;
  let slowWinAmount: number = 0;

  if (gameResultDto) {
    handleHideAllReels();
    userBalance.current =
      userBalance.current - defaultSpinCost + previousWin.current;
    spinButton.disabled = true;
    spinButton.innerText = "🔒";
  }

  const [screenLayout, matches, clusters] = gameResultDto
    ? parseSlotsGameDto(gameResultDto)
    : [{}];

  if (matches) {
    clusters.forEach((cluster, idx) => {
      fastWinAmount += defaultSpinCost * cluster.payout_modifier;
      setTimeout(() => {
        setTimeout(() => {
          handleAudio("winSound");
          slowWinAmount += defaultSpinCost * cluster.payout_modifier;
          handleLightUpCluster(cluster, slowWinAmount);
        }, (idx + 1) * 700);
      }, 2500);
    });

    setTimeout(() => {
      const userBalanceDisplay = document.getElementById("userBalance");
      userBalanceDisplay.innerText = (
        userBalance.current + fastWinAmount
      ).toFixed(2);

      spinButton.disabled = false;
      spinButton.innerText = "SPIN";
    }, 4000);
  } else {
    setTimeout(() => {
      spinButton.disabled = false;
      spinButton.innerText = "SPIN";
    }, 4500);
  }

  previousWin.current = fastWinAmount;

  return (
    <div className={style.screenWrapper}>
      <div className={style.screenOverlay}>
        <div className={style.winText} id={"wintext"}></div>
      </div>
      <div
        onLoad={async () => await handleReelAnimationSequenceNoAudio()}
        className={style.screen}
      >
        {Array(width)
          .fill(0)
          .map((_, i) => (
            <Reel
              key={`reel-${i}`}
              reelId={i}
              height={height}
              screenLayout={screenLayout}
            />
          ))}
      </div>
      <div className={style.controlPanel}>
        <audio src={clickSound} id={"clickSound"} hidden />
        <audio src={reelSound} id={"reelSound-0"} hidden />
        <audio src={reelSound} id={"reelSound-1"} hidden />
        <audio src={reelSound} id={"reelSound-2"} hidden />
        <audio src={reelSound} id={"reelSound-3"} hidden />
        <audio src={reelSound} id={"reelSound-4"} hidden />
        <audio src={reelSound} id={"reelSound-5"} hidden />
        <audio src={reelSound} id={"reelSound-6"} hidden />
        <audio src={winSound} id={"winSound"} hidden />

        <div className={style.userBalanceBox}>
          <div className={style.userBalance} id={"userBalance"}>
            {userBalance.current.toFixed(2)}
          </div>
          <div className={style.userBalanceCurrency}>{defaultCurrency}</div>
        </div>
        <SpinButton
          startGameFn={handleGameRequest}
          setGameResultDto={setGameResultDto}
        />
      </div>
    </div>
  );
}

function parseSlotsGameDto(
  gameDto: SlotsGameDto
): [{ [key: string]: string }, boolean, SymbolClusterDto[]] {
  return [gameDto.matrix, gameDto.matches, gameDto.clusters];
}
