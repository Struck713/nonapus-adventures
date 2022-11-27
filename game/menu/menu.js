class MenuManager {

    constructor () {
        this.active = true;
        this.menus = [
            new LoadingMenu(),
            new MainMenu()
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

    start() {
        this.active = false;
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