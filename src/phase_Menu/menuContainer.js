import { Container, Ticker } from "pixi.js"
import { battleParticipants, menuActions } from "../config"
import { MenuStateManager } from "./menuStateManager"
import { menuText } from "./menuText"
import { cardManager } from "./cardManager"
import { gameLoop } from "../../main"

export class menuContainer2 extends Container {
    constructor(){
        super()
        this.state = {
            locked: true,
            isLocked: () => this.state.locked,
            setLocked: (val) => { this.state.locked = val } 
        }

        this.cardContainer = new Container()
        this.addChild(this.cardContainer)
        this.textContainer = new Container()
        this.addChild(this.textContainer)
        
        this.cardManager = new cardManager(this.cardContainer, this.state.isLocked, this.state.setLocked)
        this.textRenderer = new menuText(this.textContainer)
        this.menuState = new MenuStateManager(battleParticipants, menuActions, this.cardManager, this.state.isLocked, this.state.setLocked)

        this.menuState.createCardsForStep()
        gameLoop.add(this.update, this)
    }
    
    update(ticker){
        const dt = ticker.deltaMS / 1000

        if (!this.locked) this.menuState.handleInput()
        this.cardManager.updateTargets(this.menuState.selectionIndex, dt)
        this.textRenderer.update(this.menuState.getTitle(), this.menuState.getFlavor())
    }
}