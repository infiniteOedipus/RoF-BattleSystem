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