import { Container } from "pixi.js";
import { input } from "../core/input";

export class combatContainer extends Container{
    constructor (){
        super()


    }

    update (ticker) {
        const dt = ticker.deltaMS / 1000
        this.InputController(dt);
    }

    inputController(dt) {
        if (input(right));
        if (input(left));
        if (input(up));
        if (input(down));
    }
}