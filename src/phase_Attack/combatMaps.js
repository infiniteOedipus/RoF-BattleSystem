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
            ])
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

/*function WorldToMap(x,y) {
    console.log("MapOrigin", mapOrigin)
    const point = new Point(x,y)
    return point.subtract(mapOrigin)
}

export function CoordToTile(x,y) {
    console.log("x, y, in Coord To Tile: ", x, y)
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
}*/

/*export function checkTileCollsion(x, y, vx, vy) {
    console.log("x, y, vx, vy: ", x, y, vx, vy)
    if (!activeMap) {
        console.warn("No Map set")
        return false
    }

    const [ tileX, tileY ] = CoordToTile( x, y )
    const [ offX, offY ] = CoordToTileOffset( x, y )
    console.log("what the fuck is happening")
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
}*/

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

/*export function resolveWallCollision(x2, y2, vx, vy, polygon) {
    console.log("where does this read")
    const intersections = []

    const points = polygon.points
    const segments = []
    for (let i = 0; i < points.length; i += 2) { //Convert line segments into pairs of points
        const a = new Point ( points[i], points[i + 1] )
        const b = new Point ( points[ ( i + 2) % points.length ], points[ ( i + 3 ) % points.length] )
        segments.push([a, b])
    }
    console.log("segments:", segments)
    const start = new Point (x2 - vx, y2 - vy) //really dumb backwards logic but x2/y2 is already converted to relative tile coords, but x1 and y1 are not, and it is easier to do it this way
    const end = new Point (x2, y2)

    for (const [a, b] of segments) { //checks each possible intersection and adds them to intersection array.
        console.log('testing intersection of points', start, end, a, b)
        const result = segmentIntersection(start, end, a, b)
        console.log('result:', result)
        if (result.x && result.y) intersections.push({ point: result, segment: [a, b]})
    }
    console.log ("intersections:", intersections)
    let collide = null
    if (intersections.length > 1) { //This
        console.log("Multiple Collisions Detected") 
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
        console.log("Single Collisions Detected") 
        collide = intersections[0] 
    }
    console.log(collide)
    const remainingVelocity = end.subtract(start).subtract(collide.point.subtract(start))
    const velocity = new Point (vx, vy)
    //const remain = velocity.normalize
    const segmentVector = new Point (collide.segment[1].x - collide.segment[0].x, collide.segment[1].y - collide.segment[0].y,)
    const projVel = remainingVelocity.project(segmentVector)

    const adjustedVelocity = collide.point.subtract(start).add(projVel)
    console.log('Hopefully this worked', adjustedVelocity)
    return adjustedVelocity
}*/

function findTile(position){
    const convertedPos = position.subtract(mapOrigin)
    return new Point(
        Math.floor( convertedPos.x / tileWidth),
        Math.floor( convertedPos.y / tileWidth)
    )
}

export function checkTileCollsion(position, updateVector){
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
    //console.log(collisionBox.points)
    //console.log(endPosition)
    //console.log(collisionBox.contains(endPosition.x, endPosition.y))
    if (collisionBox.contains(endPosition.x, endPosition.y)) return true

    return false
}

/*export function resolveCollision(position, updateVector){
    const endPosition = position.add(updateVector)

    const tile = findTile(endPosition)
    const tileID = activeMap[tile.y][tile.x]
    const tileData = tileRef[tileID]

    const tileCoordinate = tile.multiplyScalar(tileWidth).add(mapOrigin)
    const collisionBox = tileData.collide.clone()
    collisionBox.points.forEach((value, index) => {
        collisionBox.points[index] = (value + (index % 2 === 0 ? tileCoordinate.x : tileCoordinate.y))
    })

    //Convert Polygon into Line Segments
    const points = collisionBox.points
    const segments = []
    for (let i = 0; i < points.length; i += 2) { 
        const a = new Point ( points[i], points[i + 1] )
        const b = new Point ( points[ ( i + 2) % points.length ], points[ ( i + 3 ) % points.length] )
        segments.push([a, b])
    }
    //Test each segment for a collision
    const intersections = []
    for (const [a, b] of segments) { //checks each possible intersection and adds them to intersection array.
        console.log('testing intersection of points', position, endPosition, a, b)
        const result = segmentIntersection(position, endPosition, a, b)
        console.log('result:', result)
        if (result.x && result.y) intersections.push({ point: result, segment: [a, b]})
    }

    //find distance to closest intersection
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

    const collideVector = collide.save.point
    const remainderVector = updateVector.subtract(collideVector)

    const segmentVector = collide.save.segment[1].subtract(collide.save.segment[0])
    const bounceVector = remainderVector.project(segmentVector)

    return collideVector.add(bounceVector)
}*/
/*
export function resolveCollision(position, updateVector) {
    const endPosition = position.clone().add(updateVector)

    const possibleTiles = []

    possibleTiles.push(findTile( position.clone() ))
    possibleTiles.push(findTile( position.clone().add( new Point( updateVector.x, 0 ) ) ) )
    possibleTiles.push(findTile( position.clone().add( new Point( 0, updateVector.y ) ) ) )
    possibleTiles.push(findTile( endPosition ))

    const tile = findTile(endPosition)
    const tileID = activeMap[tile.y][tile.x]
    const tileData = tileRef[tileID]
    if (!tileData?.collide) return new Point(0, 0)

    const tileCoordinate = tile.clone().multiplyScalar(tileWidth).add(mapOrigin)

    const translatedPoints = tileData.collide.points.map((value, index) =>
        value + (index % 2 === 0 ? tileCoordinate.x : tileCoordinate.y)
    )

    const polygon = new Polygon(translatedPoints)

    const segments = []
    for (let i = 0; i < translatedPoints.length; i += 2) {
        const a = new Point(translatedPoints[i], translatedPoints[i + 1])
        const b = new Point(translatedPoints[(i + 2) % translatedPoints.length], translatedPoints[(i + 3) % translatedPoints.length])
        segments.push([a, b])
    }

    const intersections = []
    for (const [a, b] of segments) {
        const result = segmentIntersection(position, endPosition, a, b)
        if (result && result.x && result.y) {
            console.log(result)
            intersections.push({ point: result, segment: [a, b] })
        }
    }

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
    
    const finalMovement = travelBeforeCollision.add(projected)
    return finalMovement
}*/

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

