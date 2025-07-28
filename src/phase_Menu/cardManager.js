import { AdjustmentFilter } from "pixi-filters"
import { gameLoop } from "../../main"
import { Card } from "./card"

export class cardManager {
    constructor(container, isLocked, setLocked){
        this.container = container
        this.cards = []

        this.isLocked = isLocked
        this.setLocked = setLocked
    }

    createCards(dataList, getCardData, onComplete) {
        dataList.forEach((data, i) => {
            const delay = i * 0.15 + (0.1 / (2 * i + 1))
            let elapsed = 0

            const cardDelayTicker = (ticker) => {
                elapsed += ticker.deltaMS / 1000
                if (elapsed < delay) return

                const { char, action, highlight, isInvalid} = getCardData(data, i)
                const makeCard = new Card (char, action, highlight, isInvalid)

                if (isInvalid) {
                    /*makeCard.filters.push(
                        new AdjustmentFilter({
                            saturation: 0
                        })
                    )*/
                   console.log('invalid card present')
                } 

                this.cards.push(makeCard)
                this.container.addChild(makeCard)

                gameLoop.remove(cardDelayTicker, this)
                if (i === dataList.length - 1) {
                    onComplete()
                    console.log("Locked:", this.isLocked())
                }
            }

            gameLoop.add(cardDelayTicker, this)
        })
    }
    
    clear(){
        this.cards.forEach((card) => {
            card.destroyCard()
        })
        this.cards = []
    }

    updateTargets(selectionIndex, dt){
        if(!this.cards || this.cards.length === 0) return

        const selectWeight = 0.2 //adds this much to the scale factor
        const weights = [];
        const cardQuantity = this.cards.length
        this.cards.forEach((card, i) => {
            const isSelected = i === selectionIndex
            const weight = (isSelected && !this.isLocked()) ? ( 1 + selectWeight ) : 1
            weights.push(weight)
            card.scale.x += ( weight - card.scale.x ) * 30 * dt
            card.scale.y += ( weight - card.scale.y ) * 30 * dt

            card.zIndex = isSelected ? 2 : 1;

        })

        const totalWeight = cardQuantity + selectWeight
        let cumTarget = 0
        this.cards.forEach((card, i ) => {
            const weightScalar = weights[i] * (cardQuantity) / totalWeight
            const halfStep = weightScalar / (2 * (cardQuantity + 1))
            if (i === 0) cumTarget += 1 / (2 * (cardQuantity+ 1))
            cumTarget += halfStep
            const t = cumTarget
            cumTarget += halfStep
            card.setTarget(t)
        })
    }
}