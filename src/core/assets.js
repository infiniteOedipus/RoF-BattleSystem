import { Assets } from "pixi.js";

export async function loadAssets() {
    await Assets.init({manifest: '/manifest.json'})
}