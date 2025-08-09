import { Container, Point, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";
import { input } from "../core/input";
import { checkTileCollsion, resolveCollision } from "./combatMaps";
import { zeaqueAttack } from "./playerAttacks";

export class playerActor extends Container {
    constructor (spawnObject) {
        super()

        this.spawnObject = spawnObject

        this.maxSpeed = 300
        this.acceleration = 2100
        this.decceleration = 3000
        this.speed = 0
        
        this.positionF = new Point(0,0)
        this.velocity = new Point(0,0)
        this.inputDir = new Point(0,0)
        this.normalDir = new Point(1,0)
        this.movementPressed = false

        this.attackCooldown = 0.03
        this.attackCooldownValue = 0

        this.charSprite = new Sprite(loadedTextures.combatActors[`sheet_combat_zeaque`])
        this.charSprite.anchor.set(0.5, 0.5)
        this.addChild(this.charSprite)
    }

    update(dt) {
        this.updateCooldowns(dt)
        this.inputController(dt)
        this.updateVelocity(dt)
        this.updatePosition(dt)
    }

    inputController( dt ) {
        let xDir = 0
        let yDir = 0
        if (input.right()) xDir += 1
        if (input.left())  xDir -= 1
        if (input.up())    yDir -= 1
        if (input.down())  yDir += 1

        this.inputDir.set(xDir,yDir)
        this.movementPressed = this.inputDir.magnitude() ? true : false
        if (this.movementPressed) this.normalDir = this.inputDir.normalize()

        if (input.confirm()) this.runPlayerAttack( dt )
    }

    updateVelocity( dt ) {
        if ( this.movementPressed ) this.speed = Math.min ( this.speed + this.acceleration * dt, this.maxSpeed )
        if ( !this.movementPressed ) this.speed = Math.max ( this.speed - this.decceleration * dt, 0 )

        this.velocity = this.normalDir.multiplyScalar( this.speed ) //
        //console.log('velocity in update velocity', this.velocity)
    }

    updatePosition( dt ) {
        const updateVector = this.findUpdateVector( dt )

        const newPosition = this.positionF.add( updateVector )
        if (newPosition.x && newPosition.y) newPosition.copyTo( this.positionF )

        this.x = Math.floor( this.positionF.x )
        this.y = Math.floor( this.positionF.y )

    }

    findUpdateVector( dt ) {
        let updateVector = this.velocity.multiplyScalar( dt )
        if ( !( updateVector.x || updateVector.y ) ) updateVector.set( 0,0 )
        if ( !checkTileCollsion( this.position, updateVector ) ) {
            //console.log('no Collision')
            return updateVector
        }

        //console.log('Collision')
        return resolveCollision( this.position, updateVector )

    }

    runPlayerAttack( dt ) {
        if ( !( this.attackCooldownValue >= this.attackCooldown ) ) return
        this.attackCooldownValue = 0
        zeaqueAttack( this.positionF, this.normalDir, this.spawnObject )
    }

    updateCooldowns( dt ) {
        this.attackCooldownValue += dt
    }

    
}
