import { Assets } from "pixi.js";

export const loadedTextures = {}

export async function loadAssets() {
    await Assets.init({manifest: '/manifest.json'});

    try {
        loadedTextures.cards = await Assets.loadBundle("cards");
    } catch (e) {
        console.error("Failed to load cards bundle:", e);
    }
}