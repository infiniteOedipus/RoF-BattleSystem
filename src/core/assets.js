import { Assets } from "pixi.js";

const manifest = {
  bundles: [
    {
      name: "cards",
      assets: [
        { "alias": "sheet_card_bg",      "src": "/sprites/sheet_card_bg.png" },
        { "alias": "sheet_card_char",    "src": "/sprites/sheet_card_char.png" },
        { "alias": "sheet_card_attack",  "src": "/sprites/sheet_card_attack.png" },
        { "alias": "sheet_card_defend",  "src": "/sprites/sheet_card_defend.png" },
        { "alias": "sheet_card_item",    "src": "/sprites/sheet_card_item.png" },
        { "alias": "sheet_card_blood",   "src": "/sprites/sheet_card_blood.png" }
      ]
    }
  ]
}

export const loadedTextures = {}

export async function loadAssets() {
    await Assets.init({ manifest });

    try {
        loadedTextures.cards = await Assets.loadBundle("cards");
    } catch (e) {
        console.error("Failed to load cards bundle:", e);
    }

    console.log(loadedTextures)
}