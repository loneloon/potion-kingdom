import * as React from 'react';
import { ReactElement} from 'react';
import { Screen } from './components/Screen/Screen';

const screenHeight = 7
const screenWidth = 7

function App(): ReactElement {
    return (
        <Screen height={screenHeight} width={screenWidth}/>
    );
}

export default App;
