import { Container, Sprite, Spritesheet } from "pixi.js";
import { loadedAssets } from "../core/assets";

export class Card extends Container {
    constructor (BGTexture, FGTexture){
        super()

        const sheet = loadedAssets.cardSheet

        this.bg = Sprite.from(backgroundTexture);
		this.fg = Sprite.from(foregroundTexture);

		this.bg.anchor.set(0.5);
		this.fg.anchor.set(0.5);

		this.addChild(this.bg, this.fg);
    }
}

function getCardSprite(char, action) {

}