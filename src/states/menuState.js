
import { battleParticipants } from "../config";
import { app } from "../core/app"
import { Card } from "../ui/Card";
import { menuContainer } from "../ui/menuContainer"

export const MenuState = {
    init() {
        const menu = new menuContainer();

        /*battleParticipants.forEach((char, index) => {
            const testCard = new Card(char, "char", false)
            testCard.x = 50 + index * 150
            testCard.y = 150 + index * 50

            menu.addChild(testCard)
        })*/

        app.stage.addChild(menu)
    },

    update(dt) {

    },

    end() {
        
    }
}