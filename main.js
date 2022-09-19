
const gameManager = new GameManager();
const gameController = new GameController();
const spriteManager = new SpriteManager();

let character;

function preload() {
  spriteManager.load("nona.png"); // will look in assets folder for nona.png and nona.png.json
  spriteManager.preloadAll();
}

function setup() {
  spriteManager.loadAll(); // load sprites

  let character = new Character(10, 10, spriteManager.get("Nona"));
  gameManager.queue(character); // add our character to the render queue
  gameManager.queue(new Character(200, 200, spriteManager.get("Nona"))); // add a second character to the render queue

  gameController.subscribe(character.keyPressed); // subscribe to gameController event bus

  createCanvas(640, 480); // Canvas size adheres to 4:3 aspect ratio
  background(255);
}

// test comment

function draw(){
  gameManager.render();
}

function keyPressed() {
  gameController.keyPressed(key);
}
