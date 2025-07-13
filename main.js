import { createApp } from './src/core/app.js';
import { changeGameState } from './src/logic/stateManager.js'
import { MenuState } from './src/states/menuState.js';

(async() => {
    const app = await createApp();

    changeGameState(MenuState);
})();

