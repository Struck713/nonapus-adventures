// main menu
class MainMenu extends Menu {

    constructor() {
        super([ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => menuManager.start()),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) + 60, 150, 50, "How To Play", () => {}),
            new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "OATMILK SIMULATOR.", 100) 
        ]);
    }
    
}