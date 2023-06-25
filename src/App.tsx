import * as React from "react";
import { ReactElement } from "react";
import { Screen } from "./components/Screen/Screen";

const config = (() => {
  const gameProviderApiUrl = process.env.GAME_PROVIDER_API_URL;

  if (!gameProviderApiUrl) {
    throw new Error(
      "Game provider API url is missing! Please configure .env file for this demo!"
    );
  }

  const screenHeight = parseInt(process.env.SCREEN_HEIGHT_IN_CELLS);
  const screenWidth = parseInt(process.env.SCREEN_WIDTH_IN_CELLS);

  if (!screenHeight || !screenWidth) {
    throw new Error(
      "Screen dimensions are missing! Please configure .env file for this demo!"
    );
  }

  if (screenHeight <= 0 || screenHeight <= 0) {
    throw new Error(
      JSON.stringify({
        message:
          "Invalid screen dimensions. Both screen height and width should be larger than zero!",
        actualDimensions: {
          screenHeight,
          screenWidth,
        },
      })
    );
  }

  const starterBalance = parseInt(process.env.STARTER_BALANCE);

  if (!starterBalance) {
    throw new Error(
      "Starter balance value is missing! Please configure .env file for this demo!"
    );
  }

  const defaultSpinCost = parseInt(process.env.DEFAULT_SPIN_COST);

  if (!defaultSpinCost) {
    throw new Error(
      "Default spin cost value is missing! Please configure .env file for this demo!"
    );
  }

  if (starterBalance < defaultSpinCost) {
    throw new Error(
      JSON.stringify({
        message:
          "Invalid balance/spin cost configuration. Starter balance should be equal or larger than a single spin!",
        actualConfig: {
          starterBalance,
          defaultSpinCost,
        },
      })
    );
  }

  const defaultCurrency = process.env.DEFAULT_CURRENCY;
  if (!defaultCurrency) {
    throw new Error(
      "Default currency value is missing! Please configure .env file for this demo!"
    );
  }

  return {
    gameProviderApiUrl,
    screen: {
      height: screenHeight,
      width: screenWidth,
    },
    starterBalance,
    defaultSpinCost,
    defaultCurrency,
  };
})();

function App(): ReactElement {
  return (
    <Screen
      gameProviderApiUrl={config.gameProviderApiUrl}
      height={config.screen.height}
      width={config.screen.width}
      starterBalance={config.starterBalance}
      defaultSpinCost={config.defaultSpinCost}
      defaultCurrency={config.defaultCurrency}
    />
  );
}

export default App;
