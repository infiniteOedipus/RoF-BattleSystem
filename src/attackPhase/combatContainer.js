import { Container } from "pixi.js";
import { input } from "../core/input";
import { playerActor } from "./playerActor";
import { gameLoop } from "../../main";

export class combatContainer extends Container{
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

        this.player = new playerActor()
        this.addChild(this.player)

        gameLoop.add(this.update, this)
    }

    update (ticker) {
        const dt = ticker.deltaMS / 1000
        this.inputController(dt);
        this.updateMovement(dt)
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
}