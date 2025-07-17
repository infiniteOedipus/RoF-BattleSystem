import { Application } from "pixi.js";
import { BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from "../config";

export const app = new Application();

export async function createApp() {

    await app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: BACKGROUND_COLOR,
        antialias: false
    });

    return app;
}