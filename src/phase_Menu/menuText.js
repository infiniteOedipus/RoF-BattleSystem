import { Container, Text } from "pixi.js"

export class menuText {
    constructor(Container){
        this.cardTitleText = new Text({
            text: ``,
            style: {
                fontFamily: "Courier New",
                fontSize: 22,
                fontWeight: "bold",
            },
            anchor: 0.5,
            x: 325,
            y: 240
        })

        this.cardFlavorText = new Text({
            text: ``,
            style: {
                fontFamily: "Courier New",
                fontSize: 14,
                fontWeight: "bold",
            },
            anchor: 0.5,
            x: 325,
            y: 260
        })
        
        Container.addChild(this.cardTitleText)
        Container.addChild(this.cardFlavorText)
    }

    update(title, flavor){     
        if (this.cardTitleText.text  != title)  this.cardTitleText.text  = title
        if (this.cardFlavorText.text != flavor) this.cardFlavorText.text = flavor
    }
}