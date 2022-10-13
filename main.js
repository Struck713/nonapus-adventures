
const gameManager = new GameManager();
const gameController = new GameController();
const levelManager = new LevelManager();
const spriteManager = new SpriteManager();

let character;

function preload() {
  spriteManager.preload([ "nona.png", "shark.png", "urchin.png", "clam.png", "pufferfish.png"]);
  levelManager.preload([ 0 ]);
}

function setup() {
  spriteManager.load(); // load sprites
  levelManager.load(); //load levels

  gameManager.queue(new Enemy(400, 400, spriteManager.get("Shark")));
  gameManager.queue(new Enemy(100, 100, spriteManager.get("Urchin")));
  gameManager.queue(new Enemy(300, 300, spriteManager.get("Clam")));
  gameManager.queue(new Pufferfish(500, 500, spriteManager.get("Pufferfish")));
  
  let character = new Character(250, 200, spriteManager.get("Nona"));
  gameManager.queue(character); // add our character to the render queue
  gameController.subscribe(character); // subscribe to gameController event bus

  let canvas = createCanvas(GameManager.CANVAS_X, GameManager.CANVAS_Y);
  canvas.style('cursor', 'url(\'assets/crosshair.png\'), none')
  canvas.background(100, 140, 160);
  canvas.position((screen.width - GameManager.CANVAS_X) / 2, 15); //centering the game canvas
}

function draw(){
  levelManager.render();
  gameManager.render();
}

function keyPressed() {
  gameController.keyPressed(key, true);
}

function keyReleased() {
  gameController.keyPressed(key, false);
}

function mouseMoved(){
  gameController.mouseMovement(mouseX, mouseY)
}

function checkBoundaries(position) {
  console.log(position);
}


