class MenuManager {

    constructor () {
        this.active = true;
        this.menus = [
            new Menu([ 
                new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => (this.active = false)),
                new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "NONAPUS GAME", 100) 
            ])
        ];
        this.current = this.menus[0];
    }

    render() {
        this.current.render();
    }

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

}

class Menu {

    constructor(items) {
        this.items = items;
    }

    render() {
        this.items.forEach(item => item.render());
    }

}