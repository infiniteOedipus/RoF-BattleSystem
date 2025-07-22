import { Ticker } from 'pixi.js';
import { createApp } from './src/core/app.js';
import { loadAssets } from './src/core/assets.js';
import { changeGameState } from './src/logic/stateManager.js'
import { MenuState } from './src/states/menuState.js';

export const gameLoop = new Ticker();

(async() => {
    const app = await createApp();
    await loadAssets();

    document.body.appendChild(app.canvas)

    gameLoop.start()
    
    changeGameState(MenuState);
})();

