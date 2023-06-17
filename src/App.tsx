import * as React from 'react';
import { ReactElement} from 'react';
import { Screen } from './components/Screen/Screen';

const screenHeight = 7
const screenWidth = 7

const starterBalance = 10000
const defaultCurrency ="USD"

function App(): ReactElement {
    return (
        <Screen height={screenHeight} width={screenWidth} starterBalance={starterBalance} defaultCurrency={defaultCurrency}/>
    );
}

export default App;
