import { combatContainer } from "../attackPhase/combatContainer";
import { app } from "../core/app";
import { menuContainer } from "../ui/menuContainer";

let currentGameState = null;

export function changeGameState(newState) {
    if (currentGameState?.end) currentGameState.end();
    currentGameState = newState;
    currentGameState.init();
}

export function updateGameState(dt) {
    currentGameState?.update?.(dt);
}

export function getGameState() {
    return currentGameState;
}

//Menu State

export const MenuState = {
    init() {
        const menu = new menuContainer();
        app.stage.addChild(menu)
    },

    update(dt) {

    },

    end() {
        
    }
}

//Attack State

export const AttackState = {
    init() {
        const combat = new combatContainer();
        app.stage.addChild(combat)
    },

    update(dt) {

    },

    end() {
        
    }
}