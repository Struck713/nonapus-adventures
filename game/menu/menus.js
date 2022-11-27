// main menu
class MainMenu extends Menu {

    constructor() {
        super([ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => menuManager.start()),
            new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "NONAPUS GAME", 100) 
        ]);
    }
    
}

class LoadingMenu extends Menu {

    constructor() {
        super([ 
            new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "Loading..", 100),
        ]);
    }
    
}