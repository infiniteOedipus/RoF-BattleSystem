import { Container } from "pixi.js";
import { input } from "../core/input";
import { battleParticipants, menuActions } from "../config";

export class menuContainer extends Container {
    constructor (){
        super();

        this.menuState = {
            //Menu Positioning
            step: 0, // 0 = character, 1 = action, 2 = sub-action
            selectionIndex: 0,
            cachedSelections: [],
            finishedChoicePath: [],
            liveSelections: [],

            //Menu Controls
            locked: false,

        };
    };

    update(dt) { //Menu Control Function
        this.menuInputControl();
    }

    menuInputControl() {
        const state = this.menuState

        if (state.locked) return
        const indexMax = findIndexMax(this);

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
            }
        
            state.selectionIndex = state.cachedSelections[state.liveSelections[0]]?.[state.step] ?? 0 //reopening a finished menu will guide you on a path of the previous choices.
        }

        if (input.cancel(true)) {
            if (step == 0) return
            state.liveSelections[state.step] = null
            state.finishedChoicePath[state.liveSelections[0]] = false
            state.step--
        }
    };

    findIndexMax() {
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
}

