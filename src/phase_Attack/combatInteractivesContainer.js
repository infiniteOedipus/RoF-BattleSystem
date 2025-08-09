import { Container } from "pixi.js";
import { app } from "../core/app";
import { playerActor } from "./playerActor";
import { combatMap } from "./mapContainer";

export class combatInteractivesContainer extends Container {
    constructor() {
        super()

        this.x = 325 //app.screen.width / 2
        this.y = 225 //app.screen.height / 2

        this.updates = []
        this.spawnObject = (object) => {
            this.addChild(object)
            this.updates.push(object)
        }

        this.playerActor = new playerActor(this.spawnObject)
        this.combatMap = new combatMap(this.spawnObject)

        //this.addChild(this.combatMap)
        //this.addChild(this.playerActor)

        this.spawnObject(this.combatMap)
        this.spawnObject(this.playerActor)

    }

    update(dt) {
        this.updates = this.updates.filter(obj => !obj.destroyed)

        this.updates.forEach((object) => {
            if (object.update) object.update(dt)
        })
    }
}