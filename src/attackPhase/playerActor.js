import { Container, Sprite } from "pixi.js";
import { loadedTextures } from "../core/assets";

export class playerActor extends Container {
    constructor () {
        super()

        this.charSprite = new Sprite(loadedTextures.combatActors[`sheet_combat_zeaque`])

        this.addChild(this.charSprite)
    }
}
