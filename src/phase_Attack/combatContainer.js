import { Container, Sprite } from "pixi.js";
import { input } from "../core/input";
import { playerActor } from "./playerActor";
import { gameLoop } from "../../main";
import { combatMap } from "./mapContainer";
import { loadedTextures } from "../core/assets";
import { app } from "../core/app";
import { combatInteractivesContainer } from "./combatInteractivesContainer";

//Init

// Create Map
// Process Action Choices
// Place Player Actor on safe tile
// Item Submenu Options are run
// Controls Unlock
// Enemy / Bullet Spawn Patterns are Started



//Collision

// 

export class combatContainer extends Container {
    constructor() {
        super()

        this.combatInteractives = new combatInteractivesContainer()

        this.addChild(this.combatInteractives)
        gameLoop.add(this.update, this)
    }

    update (ticker) {
        const dt = ticker.deltaMS / 1000
        this.combatInteractives.update(dt)
    }
}

/*export class combatContainer extends Container{
    constructor (){
        super()
        
        this.playerActor = {
            speed : 300,
            pX  : 325,
            pY  : 225,
            pVX : 0,
            pVY : 0,
            pDX : 0,
            pDY : 0,
        }

        this.oniActor = {
            aX : 0,
            aY : 0,
            aVX : 1,
            aVY : 1,
        }

        this.player = new playerActor()
        this.testMap = new combatMap()

        this.addChild(this.testMap)
        this.addChild(this.player)

        this.oniSprite = new Sprite(loadedTextures.combatActors[`fuckyou`])
        this.oniSprite.anchor.set(0.5, 1)
        this.addChild(this.oniSprite)

        gameLoop.add(this.update, this)
    }

    update (ticker) {
        const dt = ticker.deltaMS / 1000
        this.inputController(dt);
        this.updateMovement(dt);
        this.updateOni(dt)
    }

    inputController(dt) {
        const player = this.playerActor
        player.pDX = 0
        player.pDY = 0

        if (input.right()) {
            player.pDX += 1
        };
        if (input.left()){
            player.pDX -= 1
        };
        if (input.up()){
            player.pDY -= 1
        };
        if (input.down()){
            player.pDY += 1
        };
    }

    updateMovement(dt) {
        const pData = this.playerActor
        //normalize direction
        const normal = Math.hypot(pData.pDX, pData.pDY)
        const normalDX = normal > 0 ? pData.pDX / normal : 0
        const normalDY = normal > 0 ? pData.pDY / normal : 0

        pData.pVX = normalDX * pData.speed
        pData.pVY = normalDY * pData.speed

        pData.pX += pData.pVX * dt
        pData.pY += pData.pVY * dt

        this.player.x = Math.floor(pData.pX)
        this.player.y = Math.floor(pData.pY)

        console.log(pData.pX, pData.pY)
    }

    updateOni(dt) {
        const pData = this.playerActor
        const aData = this.oniActor

        //const distance = Math.hypot(pData.pX - aData.aX, pData.pY - aData.aY)

        //const normalDX = distance > 0 ? (pData.pX - aData.aX) / distance : 0
        //const normalDY = distance > 0 ? (pData.pY - aData.aY) / distance : 0

        aData.aVX += (pData.pX - (aData.aVX / 2 + aData.aX) ) * 3
        aData.aVY += (pData.pY - (aData.aVY / 2 + aData.aY) ) * 3

        aData.aX += aData.aVX * dt
        aData.aY += aData.aVY * dt

        this.oniSprite.x = Math.floor(aData.aX)
        this.oniSprite.y = Math.floor(aData.aY)
    }
}*/