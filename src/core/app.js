import { Application } from "pixi.js";
import { BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from "../config";

export async function createApp() {

    const app = new Application();

    await app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: BACKGROUND_COLOR
    });

    return app;
}