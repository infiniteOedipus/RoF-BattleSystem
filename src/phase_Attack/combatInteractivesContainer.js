import { Container } from "pixi.js";
import { app } from "../core/app";
import { playerActor } from "./playerActor";
import { combatMap } from "./mapContainer";

export class combatInteractivesContainer extends Container {
    constructor() {
        super()

        this.x = 325 //app.screen.width / 2
        this.y = 225 //app.screen.height / 2

        this.playerActor = new playerActor()
        this.combatMap = new combatMap()

        this.addChild(this.combatMap)
        this.addChild(this.playerActor)
    }

    update(dt) {
        this.playerActor.update(dt)
    }
}