import { CompositeTilemap } from "@pixi/tilemap";
import { Container, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";
import { gameLoop } from "../../main";

export class combatMap extends Container {
    constructor (){
        super()

        //this.tilemap = new CompositeTilemap();
        //this.addChild(this.tilemap)
        this.position.set(100, 32)
        this.buildMapTall()
    }

    buildMap() {
        const tile_floor = loadedTextures.mapTiles[`tile_floor`]
        const tile_wall = loadedTextures.mapTiles[`tile_wall`]

        const tileIndexMap = {
            1: tile_floor,
            2: tile_wall
        };

        const mapAtlas = [
            [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
            [0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0],
            [2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 2],
            [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 2],
            [2, 1, 1, 2, 0, 0, 0, 2, 1, 1, 2],
            [2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
            [2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 2],
            [0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0],
            [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        ]

        mapAtlas.forEach((row, indexY) => {
            row.forEach((tile, indexX) => {
                if (tile === 0) return
                this.tilemap.tile(tileIndexMap[tile], indexX * 32, indexY * 32)
            })
        })
    }

    buildMapTall() {
        const tile_floor = loadedTextures.mapTiles[`tile_floor_tall`]
        const tile_wall = loadedTextures.mapTiles[`tile_wall_tall`]

        const tileIndexMap = {
            1: tile_floor,
            2: tile_wall
        };

        const mapAtlas = [
            [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
            [0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0],
            [2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 2],
            [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 2],
            [2, 1, 1, 2, 0, 0, 0, 2, 1, 1, 2],
            [2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
            [2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 2],
            [0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0],
            [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        ]

        mapAtlas.forEach((row, indexY) => {
            row.forEach((tile, indexX) => {
                if (tile === 0) return
                const delay = (indexX + indexY) * 0.08
                let elapsed = 0
                const tileDelayTicker = (ticker) => {
                    elapsed += ticker.deltaMS / 1000
                        if (elapsed >= delay) {
                            const makeMapTile = new Sprite(tileIndexMap[tile])
                            const mx = indexX * 32
                            const my = indexY * 32
                            makeMapTile.x = mx
                            this.addChild(makeMapTile)
                            this.tileAnimateIn(makeMapTile, my)
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