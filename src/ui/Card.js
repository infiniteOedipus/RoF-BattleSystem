import { Container, Sprite } from "pixi.js";

export class Card extends Container {
    constructor (BGTexture, FGTexture){
        super()

        this.bg = Sprite.from(backgroundTexture);
		this.fg = Sprite.from(foregroundTexture);

		this.bg.anchor.set(0.5);
		this.fg.anchor.set(0.5);

		this.addChild(this.bg, this.fg);
    }
}