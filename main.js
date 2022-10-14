
const gameManager = new GameManager();
const levelManager = new LevelManager();
const spriteManager = new SpriteManager();

function preload() {
  spriteManager.preload([ "nona.png", "shark.png", "urchin.png", "clam.png", "pufferfish.png", "oil_att.png" ]);
  levelManager.preload([ 0 ]);
}

let character;
function setup() {
  spriteManager.load(); // load sprites
  levelManager.load(); //load levels

  // test some enemies
  gameManager.queue(new Enemy(Math.floor(Math.random()*GameManager.CANVAS_X), Math.floor(Math.random()*GameManager.CANVAS_Y),spriteManager.get("Shark")));
  gameManager.queue(new Enemy(Math.floor(Math.random()*GameManager.CANVAS_X), Math.floor(Math.random()*GameManager.CANVAS_Y),spriteManager.get("Urchin")));
  gameManager.queue(new Enemy(Math.floor(Math.random()*GameManager.CANVAS_X), Math.floor(Math.random()*GameManager.CANVAS_Y),spriteManager.get("Clam")));
  gameManager.queue(new Pufferfish(Math.floor(Math.random()*GameManager.CANVAS_X), Math.floor(Math.random()*GameManager.CANVAS_Y),));
  
  character = new Character(250, 200);
  gameManager.queue(character); // add our character to the render queue

  let canvas = createCanvas(GameManager.CANVAS_X, GameManager.CANVAS_Y);
  canvas.style('cursor', 'url(\'assets/crosshair.png\'), none');
  canvas.background(100, 140, 160);
  canvas.position((screen.width - GameManager.CANVAS_X) / 2, 15); //centering the game canvas

  canvas.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); } // disable right click
}

function draw(){
  levelManager.render();
  gameManager.render();
}

/**
 * Key Events
 */
function keyPressed() {
  character.keyPressed(key, true);
}

function keyReleased() {
  character.keyPressed(key, false);
}

/**
 * Mouse Events
 */
function mouseMoved() {
  character.mouseMovement(mouseX, mouseY);
}

function mousePressed(event) {
  character.mouseClicked(event.button);
}


