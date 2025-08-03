import { CompositeTilemap } from "@pixi/tilemap";
import { Container, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";
import { gameLoop } from "../../main";
import { activeMap, mapAtlas, mapOrigin, setMap, setMapOrigin, tileRef } from "./combatMaps";

export class combatMap extends Container {
    constructor (){
        super()

        setMap()
        this.buildMap()
    }


    buildMap() {
        activeMap.forEach((row, indexY) => {
            row.forEach((tile, indexX) => {
                if (tile === 0) return

                const tileTexture = tileRef[tile].src

                const delay = (indexX + indexY) * 0.08
                let elapsed = 0

                const tileDelayTicker = (ticker) => {
                    elapsed += ticker.deltaMS / 1000
                        if (elapsed >= delay) {
                            const makeMapTile = new Sprite(tileTexture)
                            const mx = mapOrigin.x + indexX * 32
                            const my = mapOrigin.y + indexY * 32
                            makeMapTile.x = mx
                            makeMapTile.y = my
                            this.addChild(makeMapTile)
                            //this.tileAnimateIn(makeMapTile, my)
                            gameLoop.remove(tileDelayTicker, this)
                        }
                }

                gameLoop.add(tileDelayTicker, this)
            })
        })
    }

    tileAnimateIn(tile, my) {
        let offsetY = 64
        let tileOpacity = 0
        const tileAnimateTicker = (ticker) => {
            const dt = ticker.deltaMS / 1000

            offsetY = Math.max( offsetY - 64 * dt / 0.32, 0 )
            tileOpacity = Math.min( tileOpacity + 1 * dt / 0.08, 1 )

            tile.y = my - offsetY
            tile.alpha = tileOpacity

            if (offsetY === 0|| tileOpacity === 1) gameLoop.remove(tileAnimateTicker, this)
        }
        gameLoop.add(tileAnimateTicker, this)
    }
}