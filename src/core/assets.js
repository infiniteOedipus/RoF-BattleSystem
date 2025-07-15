import { Assets } from "pixi.js";

export const loadedAssets = {}

export async function loadAssets() {
    await Assets.init({manifest: '/manifest.json'});

    loadedAssets.ui = await Assets.loadBundle('ui')
}