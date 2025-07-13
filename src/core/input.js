import { keyBindings } from "../config";

//Button Inputs
const keys = {};
const keyHeld = {};

window.addEventListener("keydown", e => {
        keys[e.key] = true;
});

window.addEventListener("keyup", e => {
        keys[e.key] = false;
});

/*export const input = {
	left    : () => keys["ArrowLeft"] || keys["a"] || keys["A"],
	right   : () => keys["ArrowRight"] || keys["d"] || keys["D"],
	up      : () => keys["ArrowUp"] || keys["w"] || keys["W"],
	down    : () => keys["ArrowDown"] || keys["s"] || keys["S"],
	confirm : () => keys["z"] || keys[" "] || keys["Z"],
	cancel  : () => keys["x"] || keys["Shift"] || keys["X"],
	debug   : () => keys["p"] || keys["P"]
};*/

export const input = {}

// Old Function
for (const [action, bindingKeys] of Object.entries(keyBindings)) {
	input[action] = () => bindingKeys.some(key => keys[key])
}


//input.{type}() put in a true value to set inputs to be single frame inputs, false for continous inputs.
for (const [action, bindingKeys] of Object.entries(keyBindings)) {
	input[action] = function(check) {
		if (!bindingKeys.some(key => keys[key])) {
			input[action].held = false;
			return false
		};

		if (input[action].held && (check ?? false)) return false;

		input[action].held = true;
		return true
	};
	input[action].held = false;
}