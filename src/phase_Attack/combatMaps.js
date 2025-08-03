import { Point, Polygon } from "pixi.js"
import { GAME_HEIGHT, GAME_WIDTH } from "../config"
import { loadedTextures } from "../core/assets"
import { segmentIntersection } from "@pixi/math-extras"

const tileWidth = 32

export let activeMap = null
export let mapOrigin = new Point (0,0)

export const mapAtlas = {
    map0: [
        [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
        [0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    ]
}
export let tileRef = {}
export function poopFart() {
    tileRef = {
        0: {
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
            ])
        },
    }
} 

function WorldToMap(x,y) {
    console.log("MapOrigin", mapOrigin)
    const point = new Point(x,y)
    return point.subtract(mapOrigin)
}

export function CoordToTile(x,y) {
    const point = WorldToMap(x,y)
    console.log("tempX:", point.x, "tempY:", point.y)
    return [ 
        Math.floor(point.x / tileWidth),
        Math.floor(point.y / tileWidth)
    ]
}

export function CoordToTileOffset(x,y) {
    const point = WorldToMap(x,y)
    return [
        ((point.x % tileWidth) + tileWidth ) % tileWidth,
        ((point.y % tileWidth) + tileWidth ) % tileWidth
    ]
}

export function checkTileCollsion(x, y, vx, vy) {

    if (!activeMap) {
        console.warn("No Map set")
        return false
    }

    const [ tileX, tileY ] = CoordToTile( x, y )
    const [ offX, offY ] = CoordToTileOffset(x,y)

    //bounds check
    console.log("TileX:", tileX, "TileY:", tileY)
    if (
        tileY < 0 || tileY >= activeMap.length ||
        tileX < 0 || tileX >= activeMap[tileY].length
    ) return false

    const tileID = activeMap[tileY][tileX]
    const tile = tileRef[tileID]

    if (!tile?.collide) return false
    
    if (!tile.collide.contains(offX, offY)) return false

    if (tile.collide.contains(offX, offY)) return resolveWallCollision(offX, offY, vx, vy, tile.collide)
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

export function resolveWallCollision(x2, y2, vx, vy, polygon) {
    const intersections = []

    const points = polygon.points
    const segments = []
    for (let i = 0; i < points.length; i += 2) { //Convert line segments into pairs of points
        const a = new Point ( points[i], points[i + 1] )
        const b = new Point ( points[ ( i + 3) % points.length ], points[ ( i +4 ) % points.length] )
        segments.push([a, b])
    }

    const start = new Point (x2 - vx, y2 - vy) //really dumb backwards logic but x2/y2 is already converted to relative tile coords, but x1 and y1 are not, and it is easier to do it this way
    const end = new Point (x2, y2)

    for (const [a, b] of segments) { //checks each possible intersection and adds them to intersection array.
        const result = segmentIntersection(start, end, a, b)
        if (result === true) intersections.push({ point: result, segment: [a, b]})
    }

    let collide = null
    if (intersections.length > 1) { //This 
        let collideCheck = null
        intersections.forEach((checkPoint) => {
            const magnitude = checkPoint.result.subtract(start).magnitude()
            if (!collideCheck || collideCheck?.magnitude > magnitude) {
                collideCheck = {
                    save: checkPoint,
                    magnitude: magnitude
                }
            }
        })
        collide = collideCheck.save
    } else {
        collide = intersections[0] 
    }

    const remainingVelocity = end.subtract(start).subtract(collide.point.subtract(start))
    const velocity = new Point (vx, vy)
    //const remain = velocity.normalize
    segmentVector = new Point ( collide[1][0] - collide[0][0], collide[1][1] - collide[0][1])
    const projVel = remainingVelocity.project(segmentVector)

    adjustedVelocity = collide.point.subtract(start).add(projVel)

    return adjustedVelocity
}

