import { input } from "../core/input"

export class MenuStateManager {
    constructor(participants, actions, cardManager, isLocked, setLocked, cleanup) {
        this.participants = participants
        this.actions = actions
        this.step = 0                   // 0: Character, 1: action, 2: Submenu
        this.selectionIndex = 0         // What item is currently selected. Controller.
        this.cachedSelections = []      // Saved Selection Paths
        this.liveSelections = []        // Current Selection Path. Previous Steps get called for reference
        this.finishedChoicePath = []    // Array of Bools for each character if they have a finished selection
        this.finished = false           // Once all characters have finished selections, becomes true and enables end of menu state.

        this.cardManager = cardManager
        this.isLocked = isLocked
        this.setLocked = setLocked
        this.cleanup = cleanup
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

        if (input.debug(true) && this.finished) {
            console.log('attempting cleanup')
            this.cleanup()
        }
    }

    advance() {
        if (this.checkLegalSelection()){
            //play null animation
            return
        }

        this.liveSelections[this.step] = this.selectionIndex                                                //log the current selection into Live Selections
        this.cachedSelections[this.liveSelections[0]] = this.liveSelections                                 //log the Live Selection into Cached selections based on index of first selection (Matches with Character)
        
        this.step++                                                                                         //advance Step
        
        if (this.isSelectionComplete()) {                                                                   //checks if this was the last step (hasSubmenu adds 1 more to the step total)
            this.step = 0                                                                                   //refreshes step back to initial state
            this.finishedChoicePath[this.liveSelections[0]] = true                                          //caches if a characters selection path has been completed, for the sake of visuals and checking if all selections have been completed
            this.liveSelections = []                                                                        //refreshes live selection path to be blank
            this.checkFinishedSelections()
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
                    highlight: this.finishedChoicePath[i],
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
                    highlight: true,
                    isInvalid: this.checkSubmenuInvalid(this.actions[i], character)
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

    checkSubmenuInvalid(action, char) {
        if (!action.hasSubmenu) return false                                         //No Submenu = Valid
        if (action.hasSubmenu.some(option => option.owner === char)) return false    //Submenu that contains valid options = valid
        return true                                                                  //Yes Submenu, no valid options = invalid
    }

    checkCharacterInvalid(char) {
        return false
        //No HP system set up but if HP <= 0 return true
    }

    checkLegalSelection () {
        if (this.step === 0) {
            const char = this.participants[this.selectionIndex]
            return this.checkCharacterInvalid(char)
        }

        if (this.step === 1) {
            const char = this.participants[this.liveSelections[0]]
            const action = this.actions[this.selectionIndex]
            return this.checkSubmenuInvalid(action, char)
        }

        return false
    }

    checkFinishedSelections() {
        let completeEntries = 0
        this.participants.forEach((char, i) => {
            if ( this.finishedChoicePath[i] || this.checkCharacterInvalid() ) completeEntries++
        });
        if (completeEntries === this.participants.length) {
            this.finished = true
            console.log('finished, press p to end', this.finished)
            return
        }
        this.finished = false
        console.log('not finished')
    }
}