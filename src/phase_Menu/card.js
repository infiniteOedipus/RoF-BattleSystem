
import { loadedTextures } from "../core/assets";
import { characterIndexMap } from "../config";
import { gameLoop } from "../../main";
import { AdjustmentFilter, DropShadowFilter } from "pixi-filters";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";

export class Card extends Container {
    constructor (char, action, isCompleted, isInvalid){
        super()
        
        const charIdx = characterIndexMap[char] ?? 0;
        this.t = 0.5
        this.p = 0.5
        this.rate = 0.2

        this.bg = new Sprite(this.getCardBG(charIdx, isCompleted));
        this.fg = new Sprite(this.getCardTexture(charIdx, action));

        this.bg.anchor.set(0.5);
        this.fg.anchor.set(0.5);

        this.filters = [
            new DropShadowFilter({
                offsetX : 0,
                offsetY : 0,
                blur : 3,
            }),

            new AdjustmentFilter({
                saturation: (isInvalid ? 0 : 1)
            })
        ]

        this.pivot.set(this.width * 0.5, this.height * 0.5);
        this.addChild(this.bg, this.fg);
        gameLoop.add(this.update, this);
        
    }

    getCardTexture(charIdx, action) {
        const sheet = loadedTextures.cards[`sheet_card_${action}`];
        const frameWidth = sheet.width / Object.keys(characterIndexMap).length;

        return new Texture({source: sheet.source, frame: new Rectangle(
            charIdx * frameWidth,
            0,
            frameWidth,
            sheet.height
        )});
    }

    getCardBG(charIdx, isCompleted) {
        const sheet = loadedTextures.cards[`sheet_card_bg`];
        const frameWidth = sheet.width / Object.keys(characterIndexMap).length;

        let charIndexCheck = charIdx
        if (!isCompleted) charIndexCheck = 0

        return new Texture({source: sheet.source, frame: new Rectangle(
            charIndexCheck * frameWidth,
            0,
            frameWidth,
            sheet.height
        )});
    }

    update(ticker) {
        const dt = ticker.deltaMS / 1000
        this.updateP(dt)
        this.moveToPath()
        //console.log(this.scale.x, this.scale.y)
    }

    setTarget(targetlol){
        this.t = targetlol
    }

    destroyCard(){
        gameLoop.remove(this.update, this);
        this.destroy({ children: true });
    }

    updateP(dt) {
        this.p += (this.t - this.p) * this.rate
    }

    moveToPath() {
        const relP = this.p - 0.5 //centers p around 0
        const angle = relP * Math.PI * 0.40
        this.x = Math.sin(angle) * 450 + 325
        this.y = 850 - Math.cos(angle) * 450
        this.rotation = angle
    }
}

