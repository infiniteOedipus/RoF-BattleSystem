import 'pixi.js/math-extras';
import { Point, Polygon } from "pixi.js"
import { GAME_HEIGHT, GAME_WIDTH } from "../config"
import { loadedTextures } from "../core/assets"
import { segmentIntersection } from "@pixi/math-extras"


const tileWidth = 32



export let activeMap = null
export let mapOrigin = new Point (0,0)

export const mapAtlas = {
    map0: [
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2],
        [2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    ],
    map1: [
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
}
export let tileRef = {}
export function poopFart() {
    tileRef = {
        0: {
            collide: new Polygon([
                0, 0, 
                0, tileWidth, 
                tileWidth, tileWidth, 
                tileWidth, 0
            ]), 
            type: "air"
        },
        1: {
            src: loadedTextures.mapTiles[`tile_floor_tall`],
        },
        2: {
            src: loadedTextures.mapTiles[`tile_wall_tall`],
            collide: new Polygon([
                0, 0, 
                0, tileWidth, 
                tileWidth, tileWidth, 
                tileWidth, 0
            ]),
            type: "solid"
        },
    }
} 

export function setMapOrigin() {
    if (!activeMap) {
        console.warn("No Map set")
        return
    }

    const mapHeight = activeMap.length * tileWidth
    const mapWidth = activeMap[0].length * tileWidth

    mapOrigin.set(
        (- mapWidth / 2),
        (- mapHeight / 2)
    )

}

export function setMap() {
    activeMap = mapAtlas.map0
    setMapOrigin()
}

function findTile(position){
    const convertedPos = position.subtract(mapOrigin)
    return new Point(
        Math.floor( convertedPos.x / tileWidth),
        Math.floor( convertedPos.y / tileWidth)
    )
}

export function checkTileCollsion(position, updateVector, float = false){
    //find the tile player is moving to
    const endPosition = position.add(updateVector)

    const tile = findTile(endPosition)
    const tileID = activeMap[tile.y]?.[tile.x]
    const tileData = tileRef[tileID]

    //console.log("tile", tile)

    //check if player is colliding with the tile hitbox
    if (!tileData?.collide) return false

    const tileCoordinate = tile.multiplyScalar(tileWidth).add(mapOrigin)
    const collisionBox = tileData.collide.clone()
    collisionBox.points.forEach((value, index) => {
        collisionBox.points[index] = (value + (index % 2 === 0 ? tileCoordinate.x : tileCoordinate.y))
    })

    if (tileData.type === "air" && float) return false

    if (collisionBox.contains(endPosition.x, endPosition.y)) return true

    return false
}

export function resolveCollision(position, updateVector, recheck) {
    const endPosition = position.clone().add(updateVector)

    const possibleTiles = []

    possibleTiles.push( { index: findTile( position.clone() ) } )
    possibleTiles.push( { index: findTile( position.clone().add( new Point( updateVector.x, 0 ) ) ) } )
    possibleTiles.push( { index: findTile( position.clone().add( new Point( 0, updateVector.y ) ) ) } )
    possibleTiles.push( { index: findTile( endPosition ) } )

    const intersections = []

    possibleTiles.forEach((tile) => {
        tile.id = activeMap[tile.index.y]?.[tile.index.x]
        tile.data = tileRef?.[tile.id]
        tile.coordinate = tile.index.clone().multiplyScalar(tileWidth).add(mapOrigin)
        
        const translatedPoints = tile.data?.collide?.points.map((value, index) =>
            value + (index % 2 === 0 ? tile.coordinate.x : tile.coordinate.y)
        )

        if (translatedPoints) {
            tile.polygon = new Polygon(translatedPoints)

            tile.segments = []
            for (let i = 0; i < translatedPoints.length; i += 2) {
                const a = new Point(translatedPoints[i], translatedPoints[i + 1])
                const b = new Point(translatedPoints[(i + 2) % translatedPoints.length], translatedPoints[(i + 3) % translatedPoints.length])
                tile.segments.push([a, b])
            }

            for (const [a, b] of tile.segments) {
                const result = segmentIntersection(position, endPosition, a, b)
                if (result && result.x && result.y) {
                    console.log(result)
                    intersections.push({ point: result, segment: [a, b] })
                }
            }
        }
    })

    if (intersections.length === 0) {
        return new Point(0, 0) 
    }

    let collide = null
    intersections.forEach((checkPoint) => {
        const magnitude = position.subtract(checkPoint.point).magnitude()
        if (!collide || collide?.magnitude > magnitude) {
            collide = {
                save: checkPoint,
                magnitude: magnitude
            }
        }
    })

    const travelBeforeCollision = collide.save.point.clone().subtract(position)
    const remainingVector = updateVector.clone().subtract(travelBeforeCollision)

    const segmentDir = collide.save.segment[1].clone().subtract(collide.save.segment[0]).normalize()
    const projected = remainingVector.project(segmentDir)

    const nudgeDir = new Point(-segmentDir.y, segmentDir.x)
    const nudgeVector = nudgeDir.clone().multiplyScalar(1)
    
    const finalMovement = travelBeforeCollision.add(projected).add(nudgeVector)

    if (checkTileCollsion(position, finalMovement)) return travelBeforeCollision.add(nudgeVector) //super temp fix but I will deal with that later

    return finalMovement
}

