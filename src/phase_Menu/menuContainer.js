import { Container, Ticker } from "pixi.js"
import { battleParticipants, menuActions } from "../config"
import { MenuStateManager } from "./menuStateManager"
import { menuText } from "./menuText"
import { cardManager } from "./cardManager"
import { gameLoop } from "../../main"
import { app } from "../core/app"
import { AttackState, changeGameState } from "../states/stateManager"

export let actionChoices = {}

export class menuContainer2 extends Container {
    constructor(){
        super()
        actionChoices = []

        this.state = {
            locked: true,
            isLocked: () => this.state.locked,
            setLocked: (val) => { this.state.locked = val },
            exitMenuState: () => this.exitMenuState()
        }

        this.cardContainer = new Container()
        this.addChild(this.cardContainer)
        this.textContainer = new Container()
        this.addChild(this.textContainer)
        
        this.cardManager = new cardManager(this.cardContainer, this.state.isLocked, this.state.setLocked)
        this.textRenderer = new menuText(this.textContainer)
        this.menuState = new MenuStateManager(battleParticipants, menuActions, this.cardManager, this.state.isLocked, this.state.setLocked, this.state.exitMenuState)

        this.menuState.createCardsForStep()
        gameLoop.add(this.update, this)

    }
    
    update(ticker){
        const dt = ticker.deltaMS / 1000
        if (!this.state.locked) this.menuState.handleInput()
        this.cardManager.updateTargets(this.menuState.selectionIndex, dt)
        this.textRenderer.update(this.menuState.getTitle(), this.menuState.getFlavor())
    }

    exitMenuState() {
        gameLoop.remove(this.update, this)

        Object.assign(actionChoices, this.menuState.convertActionChoices())
        console.log(actionChoices)
        this.cardManager.clear()
        this.textRenderer.end()
        this.destroy({ children: true})
        app.stage.removeChild(this)

        changeGameState(AttackState)
    }
}