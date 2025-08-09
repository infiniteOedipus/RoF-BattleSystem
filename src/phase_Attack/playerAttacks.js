import { Container, Point, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";
import { checkTileCollsion } from "./combatMaps";

export function zeaqueAttack( startPos, dir, spawnObject ) {
    spawnObject( new zeaqueBullet( startPos, dir, 0 ) )
    spawnObject( new zeaqueBullet( startPos, dir, -10 ) )
    spawnObject( new zeaqueBullet( startPos, dir, 10 ) )
}

class zeaqueBullet extends Container {
    constructor (startPos, dir, angle) {
        super() 
        this.fart = new Sprite(loadedTextures.bullets[`sheet_bullet_attack_zeaque`])
        this.x = startPos.x
        this.y = startPos.y
        this.direction = dir.rotate(angle, "deg")

        this.speed = 500

        this.lifetime = 0

        this.addChild(this.fart)
        this.fart.anchor.set(0.5, 0.5)
    }

    update(dt){
        this.lifetime += dt

        this.position = new Point(this.x, this.y)
        //console.log(this.position, this.direction.multiplyScalar(this.speed))
        //console.log(checkTileCollsion( this.position, this.direction.multiplyScalar(this.speed) , "check"))
        if (this.lifetime >= 1 || checkTileCollsion( this.position, this.direction.multiplyScalar(this.speed * dt), true ) ) {
            this.parent.removeChild(this)
            this.destroy({ children: true })
            return
        }

        this.x += this.direction.x * this.speed * dt
        this.y += this.direction.y * this.speed * dt
    }
}
