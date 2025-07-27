
class MenuStateManager {
    constructor(participants, actions) {
        this.participants = participants
        this.actions = actions
        this.step = 0
        this.selectionIndex = 0
        this.cachedSelections = []
        this.liveSelections = []
        this.finishedChoicePath = []
    }

    advance() {
        this.liveSelections[this.step] = this.selectionIndex                                                //log the current selection into Live Selections
        this.cachedSelections[this.liveSelections[0]] = this.liveSelections                                 //log the Live Selection into Cached selections based on index of first selection (Matches with Character)
        
        this.step++                                                                                         //advance Step
        
        if (this.isSelectionComplete()) {                                                                   //checks if this was the last step (hasSubmenu adds 1 more to the step total)
            this.step = 0                                                                                   //refreshes step back to initial state
            this.finishedChoicePath[this.liveSelections[0]] = true                                          //caches if a characters selection path has been completed, for the sake of visuals and checking if all selections have been completed
            this.menuState.liveSelections = []                                                              //refreshes live selection path to be blank
        }
        console.log(this.cachedSelections)
        this.selectionIndex = this.cachedSelections[this.liveSelections[0]]?.[this.step] ?? 0               //reopening a finished menu will guide you on a path of the previous choices.
    }

    revert() {
        if (this.step === 0) return
        this.liveSelections[this.step] = null
        this.finishedChoicePath[this.liveSelections[0]] = false
        this.step--
    }

    getIndexMax() {
        if (this.step === 0) {
            return battleParticipants.length
        }
        if (this.step === 1) {
            return menuActions.length
        }
        if (this.step === 2) {
            return menuActions[this.liveSelections[1]].hasSubmenu.filter((option) => option.owner === battleParticipants[this.liveSelections[0]]).length
        }
    }

    isSelectionComplete() {
        return ((this.step === 2 && !menuActions[this.liveSelections[1]].hasSubmenu) || this.step === 3)
    }

    getCurrentOptions() {
        
    }
}