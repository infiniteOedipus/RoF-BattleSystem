import { Container, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";
import { input } from "../core/input";
import { checkTileCollsion, CoordToTile } from "./combatMaps";

export class playerActor extends Container {
    constructor () {
        super()

        this.maxSpeed = 300
        this.acceleration = 2100
        this.decceleration = 3000
        this.speed = 0
        this.pX  = 0
        this.pY  = 0
        this.pVX = 0
        this.pVY = 0
        this.normalDX = 0
        this.normalDY = 0
        this.pDX = 0
        this.pDY = 0

        this.charSprite = new Sprite(loadedTextures.combatActors[`sheet_combat_zeaque`])
        this.charSprite.anchor.set(0.5, 0.5)
        this.addChild(this.charSprite)
    }

    update(dt) {
        this.inputController()
        this.updateVelocity(dt)
        this.updatePosition(dt)
    }

    inputController() {
        this.pDX = 0
        this.pDY = 0

        if (input.right()) this.pDX += 1
        if (input.left())  this.pDX -= 1
        if (input.up())    this.pDY -= 1
        if (input.down())  this.pDY += 1
    } 

    updateVelocity(dt) {
        //normalize direction
        const normal = Math.hypot(this.pDX, this.pDY)
        if (normal > 0) {
        this.normalDX = this.pDX / normal
        this.normalDY = this.pDY / normal
        }

        if (this.pDX || this.pDY) this.speed = Math.min (this.speed + this.acceleration * dt, this.maxSpeed)
        if (!(this.pDX || this.pDY)) this.speed = Math.max (this.speed - this.decceleration * dt, 0)

        if (input.cancel()) {
            if (this.pDX || this.pDY) this.speed = this.maxSpeed
            if (!(this.pDX || this.pDY)) this.speed =  0
        }

        this.pVX = this.speed * this.normalDX
        this.pVY = this.speed * this.normalDY
    }

    updateCollision(dt) {
        const testX = this.pX + this.pVX * dt
        const testY = this.pY + this.pVY * dt

        const updateV = checkTileCollsion(testX, testY, this.pVX, this.pVY)
        this.pVX += updateV.x
        this.pVY += updateV.y
    }

    updatePosition(dt) {

        this.updateCollision(dt)

        this.pX = this.pX + this.pVX * dt
        this.pY = this.pY + this.pVY * dt

        this.x = Math.floor(this.pX)
        this.y = Math.floor(this.pY)
    
        console.log(CoordToTile(this.x, this.y))
    }
}
