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
    },
    {
      name: "combatActors",
      assets: [
        { "alias": "sheet_combat_zeaque",      "src": "/sprites/sheet_combat_zeaque.png" },
        { "alias": "fuckyou",      "src": "/sprites/fuckyou.png" },
      ]
    },
    {
      name: "mapTiles",
      assets: [
        { "alias": "tile_floor",      "src": "/sprites/tile_floor.png" },
        { "alias": "tile_wall",      "src": "/sprites/tile_wall.png" },
        { "alias": "tile_floor_tall",      "src": "/sprites/tile_floor_tall.png" },
        { "alias": "tile_wall_tall",      "src": "/sprites/tile_wall_tall.png" },
      ]
    }
  ]
}

export const loadedTextures = {}

export async function loadAssets() {
  await Assets.init({ manifest });

  await Promise.all(
    manifest.bundles.map(async (bundle) => {
      try {
        loadedTextures[bundle.name] = await Assets.loadBundle(bundle.name)
      } catch (e) {
        console.error ( `failed to load ${bundle.name} bundle:`, e)
      }
    })
  )

  console.log(loadedTextures)
}