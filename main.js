
const gameManager = new GameManager();
const gameController = new GameController();
const spriteManager = new SpriteManager();

let character;

function preload() {
  spriteManager.load("nona.png"); // will look in assets folder for nona.png and nona.png.json
  spriteManager.load([ "shark.png", "urchant.png", "clam.png" ]);

  spriteManager.preloadAll();
}

function setup() {
  spriteManager.loadAll(); // load sprites

  gameManager.queue(new Enemy(400, 400, spriteManager.get("Shark")));
  gameManager.queue(new Enemy(100, 100, spriteManager.get("Urchant")));
  gameManager.queue(new Enemy(300, 300, spriteManager.get("Clam")));

  let character = new Character(250, 200, spriteManager.get("Nona"));
  gameManager.queue(character); // add our character to the render queue
  gameController.subscribe(character); // subscribe to gameController event bus

  // let gameCanvas = createCanvas(640, 480);
  // gameCanvas.background(100,140,160);
  //gameCanvas.center();

  let gameCanvas = createCanvas(960, 720);
  gameCanvas.background(100,140,160);
  gameCanvas.position((screen.width - 960)/2, 15); //centering the game canvas
}

function draw(){
  background(100, 140, 160); // clear canvas and then render

  gameManager.render();
}

function keyPressed() {
  gameController.keyPressed(key, true);
}

function keyReleased() {
  gameController.keyPressed(key, false);
}
