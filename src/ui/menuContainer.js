import { Container } from "pixi.js";
import { input } from "../core/input";
import { battleParticipants, menuActions } from "../config";
import { gameLoop } from "../../main";
import { Card } from "./Card";
import { DropShadowFilter } from "pixi-filters";

export class menuContainer extends Container {
    constructor (){
        super();
        this.sortableChildren = true

        this.menuState = {
            //Menu Positioning
            step: 0, // 0 = character, 1 = action, 2 = sub-action
            selectionIndex: 0,
            cachedSelections: [],
            finishedChoicePath: [],
            liveSelections: [],

            //Menu Controls
            locked: false,
            cards: []
        };

        this.filters = [
            new DropShadowFilter({
                offsetX : 0,
                offsetY : 0,
                blur : 6,
            })
        ]

        this.runCardCreation();
        gameLoop.add(this.update, this)
    };

    update(ticker) { //Menu Control Function
        const dt = ticker.deltaMS / 1000
        this.menuInputControl();
        this.updateCardTargets(dt);
    }

    menuInputControl() {
        const state = this.menuState

        if (state.locked) return
        const indexMax = this.findIndexMax();

        if (input.right(true)) {
            state.selectionIndex = (state.selectionIndex + 1) % indexMax
        }

        if (input.left(true)) {
            state.selectionIndex = (state.selectionIndex + (indexMax - 1)) % indexMax
        }

        if (input.confirm(true)) {
            state.liveSelections[state.step] = state.selectionIndex //log the current selection into Live Selections
            state.cachedSelections[state.liveSelections[0]] = state.liveSelections //log the Live Selection into Cached selections based on index of first selection (Matches with Character)

            state.step++ //advance Step

            if ((state.step === 2 && !menuActions[state.liveSelections[1]].hasSubmenu) || state.step === 3) { //checks if this was the last step (hasSubmenu adds 1 more to the step total)
                state.step = 0 //refreshes step back to initial state
                state.finishedChoicePath[state.liveSelections[0]] = true //caches if a characters selection path has been completed, for the sake of visuals and checking if all selections have been completed
                this.menuState.liveSelections = []
            }
        
            state.selectionIndex = state.cachedSelections[state.liveSelections[0]]?.[state.step] ?? 0 //reopening a finished menu will guide you on a path of the previous choices.
            this.runCardRemoval()
            this.menuState.cards = []
            this.menuState.locked = true
            this.runCardCreation()


        }

        if (input.cancel(true)) {
            if (state.step === 0) return
            state.liveSelections[state.step] = null
            state.finishedChoicePath[state.liveSelections[0]] = false
            state.step--
        }
    };

    findIndexMax() {
        const state = this.menuState

        if (state.step === 0) {
            return battleParticipants.length
        }
        if (state.step === 1) {
            return menuActions.length
        }
        if (state.step === 2) {
            return menuActions[state.liveSelections[1]].hasSubmenu.filter((option) => option.owner === battleParticipants[state.liveSelections[0]]).length
        }
    }

    runCardCreation() {
        const state = this.menuState

        if (state.step === 0) {
            battleParticipants.forEach((char, i) => {
                
                const delay = i * 0.15 + (0.1 / (2 * i + 1))
                let elapsed = 0
                const cardDelayTicker = (ticker) => {
                    elapsed += ticker.deltaMS / 1000
                    if (elapsed >= delay) {
                        const makeCard = new Card (char, "char", state.finishedChoicePath[i])
                        state.cards.push(makeCard)
                        this.addChild(makeCard)
                        gameLoop.remove(cardDelayTicker, this)

                        if (i === battleParticipants.length - 1) state.locked = false
                    }
                }
                gameLoop.add(cardDelayTicker, this)
            })
        } 

        if (state.step === 1) {
            menuActions.forEach((action, i) => {
                
                const delay = i * 0.15 + (0.1 / (2 * i + 1))
                let elapsed = 0
                const cardDelayTicker = (ticker) => {
                    elapsed += ticker.deltaMS / 1000
                    if (elapsed >= delay) {
                        const makeCard = new Card (battleParticipants[state.liveSelections[0]], action.label, true)
                        state.cards.push(makeCard)
                        this.addChild(makeCard)
                        gameLoop.remove(cardDelayTicker, this)

                        if (i === menuActions.length - 1) state.locked = false
                    }
                }
                gameLoop.add(cardDelayTicker, this)
            })
        } 
    }

    updateCardTargets(dt) {
        const selectWeight = 0.2 //adds this much to the scale factor
        const weights = [];
        const cardQuantity = this.menuState.cards.length
        this.menuState.cards.forEach((card, i) => {
            const isSelected = i === this.menuState.selectionIndex
            const weight = isSelected ? ( 1 + selectWeight ) : 1
            weights.push(weight)
            card.scale.x += ( weight - card.scale.x ) * 30 * dt
            card.scale.y += ( weight - card.scale.y ) * 30 * dt

            card.zIndex = isSelected ? 2 : 1;

        })

        const totalWeight = cardQuantity + selectWeight
        let cumTarget = 0
        this.menuState.cards.forEach((card, i ) => {
            const weightScalar = weights[i] * (cardQuantity) / totalWeight
            const halfStep = weightScalar / (2 * (cardQuantity + 1))
            if (i === 0) cumTarget += 1 / (2 * (cardQuantity+ 1))
            cumTarget += halfStep
            const t = cumTarget
            //console.log(cumTarget)
            cumTarget += halfStep
            card.setTarget(t)
            //console.log(cumTarget)
        })
    }

    runCardRemoval() {
        this.menuState.cards.forEach((card) => {
            card.destroyCard()
        })
    }
}

