class MenuManager {

    constructor () {
        this.active = true;
        this.menus = [ new MainMenu(), new EndMenu() ];
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

    start =() => this.active = false;
    end = () => this.active = true;
}

class Menu {
    constructor(name, items) { this.name = name; this.items = items; }
    render() { this.items.forEach(item => item.render()) }
}

// main menu
class MainMenu extends Menu {

    constructor() {
        super("Main", 
        [ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => menuManager.start()),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) + 60, 150, 50, "How To Play",
            () => alert("If you can't figure out how to play our game we don't want you playing it. Slay.")),
            new MenuText((GameManager.CANVAS_X / 2)-53, (GameManager.CANVAS_Y / 2) - 140, "Nonapus Adventures!", 100),
            new MenuText(43, GameManager.CANVAS_Y - 17, "© 8+1 Man Carry", 15)
        ]);
    }
    
}

class EndMenu extends Menu {

    constructor() {
        super("End",
        [ 
            new MenuText((GameManager.CANVAS_X / 2)-53, (GameManager.CANVAS_Y / 2) - 140, "You Died.", 100),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Return to Main Menu", () => menuManager.set("Main")),
            new MenuText(43, GameManager.CANVAS_Y, `Your score was ${100} coins.`, 15)
        ]);
    }
    
}