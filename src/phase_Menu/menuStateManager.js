import { input } from "../core/input"

export class MenuStateManager {
    constructor(participants, actions, cardManager, isLocked, setLocked) {
        this.participants = participants
        this.actions = actions
        this.step = 0
        this.selectionIndex = 0
        this.cachedSelections = []
        this.liveSelections = []
        this.finishedChoicePath = []

        this.cardManager = cardManager
        this.isLocked = isLocked
        this.setLocked = setLocked
        //this.locked = locked
    }

    handleInput() {
        const indexMax = this.getIndexMax();

        if (input.right(true)) {
            this.selectionIndex = (this.selectionIndex + 1) % indexMax 
        }

        if (input.left(true)) {
            this.selectionIndex = (this.selectionIndex + (indexMax - 1)) % indexMax
        }

        if (input.confirm(true)) {
            this.advance()
        }

        if (input.cancel(true)) {
            this.revert()
        }
    }

    advance() {
        this.liveSelections[this.step] = this.selectionIndex                                                //log the current selection into Live Selections
        this.cachedSelections[this.liveSelections[0]] = this.liveSelections                                 //log the Live Selection into Cached selections based on index of first selection (Matches with Character)
        
        this.step++                                                                                         //advance Step
        
        if (this.isSelectionComplete()) {                                                                   //checks if this was the last step (hasSubmenu adds 1 more to the step total)
            this.step = 0                                                                                   //refreshes step back to initial state
            this.finishedChoicePath[this.liveSelections[0]] = true                                          //caches if a characters selection path has been completed, for the sake of visuals and checking if all selections have been completed
            this.liveSelections = []                                                              //refreshes live selection path to be blank
        }
        console.log(this.cachedSelections)
        this.selectionIndex = this.cachedSelections[this.liveSelections[0]]?.[this.step] ?? 0               //reopening a finished menu will guide you on a path of the previous choices.

        this.cardManager.clear()
        this.setLocked(true)
        this.createCardsForStep()
    }

    revert() {
        if (this.step === 0) return
        this.liveSelections[this.step] = null
        this.finishedChoicePath[this.liveSelections[0]] = false
        this.step--

        this.cardManager.clear()
        this.setLocked(true)
        this.createCardsForStep()
    }

    getIndexMax() {
        if (this.step === 0) {
            return this.participants.length
        }
        if (this.step === 1) {
            return this.actions.length
        }
        if (this.step === 2) {
            return getSubmenuOptions().length
        }
    }

    isSelectionComplete() {
        return ((this.step === 2 && !this.actions[this.liveSelections[1]].hasSubmenu) || this.step === 3)
    }

    getSubmenuOptions(action, char) {
        return action.hasSubmenu.filter((option) => option.owner === char)
    }

    getTitle() {
        if (this.isLocked()) return ''
        if (this.step === 0) return this.participants[this.selectionIndex]
        if (this.step === 1) return this.actions[this.selectionIndex].label
        if (this.step === 2) return this.getSubmenuOptions()[this.selectionIndex].label
    }

    getFlavor() {
        const char = this.participants[this.liveSelections[0]]
        if (this.isLocked()) return ''
        if (this.step === 0) return ''
        if (this.step === 1) return this.actions[this.selectionIndex].flavor[char]
        if (this.step === 2) return this.getSubmenuOptions()[this.selectionIndex].flavor
    }

    //setLocked(bool) {
    //    this.locked = bool
    //}

    //isLocked() {
    //    return this.locked
    //}

    createCardsForStep() {
        if (this.step === 0) {
            this.cardManager.createCards(
                this.participants, 
                (char, i) => ({
                    char: char,
                    action:"char",
                    highlight: this.finishedChoicePath[i]
                }),
                () => this.setLocked(false)
            )
        }

        if (this.step === 1) {
            const character = this.participants[this.liveSelections[0]]
            this.cardManager.createCards(
                this.actions, 
                (_, i) => ({
                    char: character,
                    action: this.actions[i].label,
                    highlight: true
                }),
                () => this.setLocked(false)
            )
        }

        if (this.step === 3) {
            const character = this.participants[this.liveSelections[0]]
            const action = this.actions[this.liveSelections[1]]
            const options = this.getSubmenuOptions(action, character)
            this.cardManager.createCards(
                options, 
                (option, i) => ({ //trying to figure this out
                    char: character,
                    action: option.label,
                    highlight: true
                }),
                () => this.setLocked(false)
            )
        }
    }
}