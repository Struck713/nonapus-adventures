// main menu
class MainMenu extends Menu {

    constructor() {
        super([ 
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2), 150, 50, "Play", () => menuManager.start()),
            new MenuButton((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) + 60, 150, 50, "How To Play", () => alert("If you can't figure out how to play our game we don't want you playing it. Slay.")),
            new MenuText((GameManager.CANVAS_X / 2), (GameManager.CANVAS_Y / 2) - 100, "OATMILK SIMULATOR.", 100),
            new MenuText(55, GameManager.CANVAS_Y - 15, "© 8+1 Man Carry", 15)
        ]);
    }
    
}