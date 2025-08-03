import { Ticker } from 'pixi.js';
import { createApp } from './src/core/app.js';
import { loadAssets } from './src/core/assets.js';
import { changeGameState, MenuState, AttackState } from './src/states/stateManager.js'
import { GAME_HEIGHT, GAME_WIDTH } from './src/config.js';
import { input } from './src/core/input.js';
import { poopFart } from './src/phase_Attack/combatMaps.js';

export const gameLoop = new Ticker();

(async() => {
    const app = await createApp();
    await loadAssets();

    document.body.appendChild(app.canvas)

    gameLoop.start()

    window.addEventListener("keydown", (e) => {
    if (e.key === "o") {
        goFullscreen();
    }
    });
    
    poopFart()
    changeGameState(AttackState);
})();


function goFullscreen() {
    const canvas = document.querySelector('canvas')
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen()
    }
    
}
