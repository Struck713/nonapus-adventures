class MenuManager {

    constructor () { this.active = true; }

    load() {
        this.menus = [ new MainMenu(), new EndMenu(), new BossMenu() ];
        this.current = this.menus[0];
    }

    render() { this.current.render(); }

    mouseClicked(x, y) {
        this.current.items.forEach(item => {
            if (!item.inBounds(x, y)) return;
            item.click();
        })
    }

    mouseMoved(x, y) {
        this.current.items.forEach(item => {
            if (!item.inBounds(x, y)) item.hovered = false;
            else item.hovered = true;
        })
    }

    set = (name) => { this.current = this.get(name); this.end(); }
    get = (name) => this.menus.find(menu => menu.name == name);

    start = () => this.active = false;
    end = () => this.active = true;
}

class Menu {
    constructor(name, items) { this.name = name; this.items = items; }
    render()                 { this.items.forEach(item => item.render()) }
}

// main menu
class MainMenu extends Menu {
    constructor() {
        super("Main", [ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => {
                // let room = roomManager.room;
                // room.destroy();
                // room.build();

                menuManager.start()
            }),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) + 60, 150, 50, "How To Play",
            () => alert("Here's our Wiki: https://github.com/Struck713/8-1-Man-Carry/wiki")),
            new MenuText((GameManager.CANVAS_X / 2)-46, (GameManager.CANVAS_Y / 2) - 140, "Nonapus Adventures!", fontConfa, 92),
            new MenuText(43, GameManager.CANVAS_Y - 17, "© 8+1 Man Carry", fontFranx, 15)
        ]);
    }
}

class EndMenu extends Menu {
    constructor() {
        let coinText = new MenuText((GameManager.CANVAS_X/2)-20, (GameManager.CANVAS_Y/2)-30, "Loading..", fontFranx, 30);
        super("End", [ 
            new MenuText((GameManager.CANVAS_X / 2)-53, (GameManager.CANVAS_Y / 2) - 140, "You Died :(", fontFranx, 100),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2)+50, 150, 50, "Return to Main Menu", () => {
                //roomManager.reset();
                //gameManager.reset();
                
                //menuManager.set("Main");
                location.reload();
            }),
            coinText
        ]);
        this.coinText = coinText;
    }

    render() {
        super.render();
        this.coinText.text = `You earned ${gameManager.getByTag(Character.TAG).coins} coins!`;
    }

}

class BossMenu extends Menu {
    constructor() {
        super("Boss", [ 
            new MenuText((GameManager.CANVAS_X / 2)-53, (GameManager.CANVAS_Y / 2) - 140, "Fight Boss?", fontFranx, 100),
            new MenuButton((GameManager.CANVAS_X / 2)-100, (GameManager.CANVAS_Y / 2)+50, 150, 50, "No", () => {
                menuManager.start();
                let characterReference = gameManager.getByTag(Character.TAG);
                characterReference.position = createVector(GameManager.CANVAS_X/2, GameManager.CANVAS_Y/2);
                characterReference.movementMatrix = [ false, false, false, false ];
            }),
            new MenuButton((GameManager.CANVAS_X / 2)+100, (GameManager.CANVAS_Y / 2)+50, 150, 50, "Yes", () => {
                menuManager.start();
                Altar.startBossFight = true;
            }),
        ]);
    }

    render() {
        super.render();
    }

}