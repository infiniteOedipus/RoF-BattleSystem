

export const GAME_WIDTH = 650;
export const GAME_HEIGHT = 450;
export const BACKGROUND_COLOR = 0xccffff;

export const battleParticipants = ["zeaque", "markor", "phenix", "vessta"];

export const battleMenuValues = [
	{
		label: "Attack",
		submenu: false,
		getFlavorText: (char) => ({
			zeaque: "Zeaque readies his Buckshot",
			markor: "Markor charges his lazer",
			phenix: "Phenix burns a way forward"
		})[char]
	},
	{
		label: "Item",
		submenu: true,
		getFlavorText: (char) => ({
			zeaque: "Zeaque reorginizes his inventory",
			markor: "Markor might have something",
			phenix: "Phenix has something burning a hole in his pocket"
		})[char],
		getOptions: () => {
			// Example: return inventory.filter(item => item.owner === char);
			return ["Bandage", "Molotov"];
		}
	},
	{
		label: "Defend",
		submenu: false,
		getFlavorText: (char) => ({
			zeaque: "Zeaque is ready to parry",
			markor: "Markor forms a mental barrier",
			phenix: "Phenix shields with fire"
		})[char]
	},
	{
		label: "Blood",
		submenu: true,
		getFlavorText: (char) => ({
			zeaque: "Teal",
			markor: "Gold",
			phenix: "Rust"
		})[char],
		getOptions: () => {
			
		}
	}
];

export const keyBindings = {
	left: ["ArrowLeft", "a", "A"],
	right: ["ArrowRight", "d", "D"],
	up: ["ArrowUp", "w", "W"],
	down: ["ArrowDown", "s", "S"],
	confirm: ["z", " ", "Z"],
	cancel: ["x", "Shift", "X"],
	debug: ["p", "P"]
};