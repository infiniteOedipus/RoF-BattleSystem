import { createApp } from './src/core/app.js';
import { loadAssets } from './src/core/assets.js';
import { changeGameState } from './src/logic/stateManager.js'
import { MenuState } from './src/states/menuState.js';

(async() => {
    const app = await createApp();
    await loadAssets();

    document.body.appendChild(app.canvas)
    
    //changeGameState(MenuState);
})();

