class MenuManager {

    constructor () {
        this.active = true;
        this.menus = [
            new MainMenu()
        ];
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
    start() { this.active = false; }
}

class Menu {
    constructor(items) { this.items = items; }
    render() { this.items.forEach(item => item.render()) }
}

// main menu
class MainMenu extends Menu {

    constructor() {
        super([ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => menuManager.start()),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) + 60, 150, 50, "How To Play",
            () => alert("If you can't figure out how to play our game we don't want you playing it. Slay.")),
            new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "OATMILK SIMULATOR.", 100),
            new MenuText(55, GameManager.CANVAS_Y - 15, "© 8+1 Man Carry", 15)
        ]);
    }
    
}