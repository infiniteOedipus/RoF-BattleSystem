

export const GAME_WIDTH = 650;
export const GAME_HEIGHT = 450;
export const BACKGROUND_COLOR = 0xccffff;

export const keyBindings = {
	left: ["ArrowLeft", "a", "A"],
	right: ["ArrowRight", "d", "D"],
	up: ["ArrowUp", "w", "W"],
	down: ["ArrowDown", "s", "S"],
	confirm: ["z", " ", "Z"],
	cancel: ["x", "Shift", "X"],
	debug: ["p", "P"]
};

export const battleParticipants = ["zeaque", "markor", "phenix", "vessta"];

export const items = [
    { 
        name: "Baja Blast", 
        consumable: true, 
        owner: "zeaque"
    },
    { 
        name: "Baja Blast", 
        consumable: true, 
        owner: "zeaque"
    },
    { 
        name: "Baja Blast", 
        consumable: true, 
        owner: "zeaque"
    },
    { 
        name: "Phone", 
        consumable: false, 
        owner: "zeaque" 
    }
];

export const menuActions = [
    { 
        label: "attack", 
        hasSubmenu: false, 
        flavor: {
            zeaque: "Zeaque aims his buckshot",
            markor: "Markor charges his psionics",
            phenix: "Phenix burns his way forward",
            vessta: "Vessta gets Horny"
        }
    },
    {
        label: "defend", 
        hasSubmenu: false, 
        flavor: {
            zeaque: "Zeaque readies to parry",
            markor: "Markor creates an arcane barrier",
            phenix: "Phenix burns his way forward",
            vessta: "Vessta tanks the hits"
        }
    },
    { 
        label: "blood", 
        hasSubmenu: false ,
        flavor: {
            zeaque: "Teal",
            markor: "Gold",
            phenix: "Rust",
            vessta: "Fuschia"
        }
    },
    { 
        label: "item", 
        hasSubmenu: items ,
        flavor: {
            zeaque: "Zeaque orginizes his inventory",
            markor: "Markor may have something",
            phenix: "Phenix searches though the ashes",
            vessta: "Vessta has found something"
        },
    }
];

export const characterIndexMap = {
	PH    : 0,
  	zeaque: 1,
  	vessta: 2,
  	phenix: 3,
  	markor: 4
};