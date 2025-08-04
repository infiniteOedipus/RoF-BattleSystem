

export const GAME_WIDTH = 650;
export const GAME_HEIGHT = 450;
export const BACKGROUND_COLOR = 0xccffcc;

export const keyBindings = {
	left: ["ArrowLeft", "a", "A"],
	right: ["ArrowRight", "d", "D"],
	up: ["ArrowUp", "w", "W"],
	down: ["ArrowDown", "s", "S"],
	confirm: ["z", " ", "Z"],
	cancel: ["x", "Shift", "X"],
	debug: ["p", "P"]
};

export const battleParticipants = ["Zeaque", "Markor", "Phenix", "Vessta"];

export const items = [
    { 
        label: "Baja Blast", 
        consumable: true, 
        owner: "Zeaque"
    },
    { 
        label: "Baja Blast", 
        consumable: true, 
        owner: "Zeaque"
    },
    { 
        label: "Baja Blast", 
        consumable: true, 
        owner: "Zeaque"
    },
    { 
        label: "Phone", 
        consumable: false, 
        owner: "Zeaque" 
    }
];

export const menuActions = [
    { 
        label: "attack", 
        hasSubmenu: false, 
        flavor: {
            Zeaque: "Zeaque aims his buckshot",
            Markor: "Markor charges his psionics",
            Phenix: "Phenix burns his way forward",
            Vessta: "Vessta gets Horny"
        }
    },
    {
        label: "defend", 
        hasSubmenu: false, 
        flavor: {
            Zeaque: "Zeaque readies to parry",
            Markor: "Markor creates an arcane barrier",
            Phenix: "Phenix burns his way forward",
            Vessta: "Vessta tanks the hits"
        }
    },
    { 
        label: "blood", 
        hasSubmenu: false ,
        flavor: {
            Zeaque: "Teal",
            Markor: "Gold",
            Phenix: "Rust",
            Vessta: "Fuschia"
        }
    },
    { 
        label: "item", 
        hasSubmenu: items ,
        flavor: {
            Zeaque: "Zeaque orginizes his inventory",
            Markor: "Markor may have something",
            Phenix: "Phenix searches though the ashes",
            Vessta: "Vessta has found something"
        },
    }
];

export const characterIndexMap = {
	PH    : 0,
  	Zeaque: 1,
  	Vessta: 2,
  	Phenix: 3,
  	Markor: 4
};