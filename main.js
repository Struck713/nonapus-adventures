
const menuManager = new MenuManager();
const gameManager = new GameManager();
const tileManager = new TileManager();
const roomManager = new RoomManager();
const hudManager = new HUDManager();
const spriteManager = new SpriteManager();

let titleFont;
let otherFont;

function preload() {
  spriteManager.preload([ 
    "nona.png", 

    "shark.png", "urchin.png", "clam.png", "pufferfish.png",
    "crab.png", "speedBoost.png", "healthPotion.png", "anglerFish.png", 
    "electricEel.png",

    "coin.png", "chest.png",

    "laserShark.png", 

    "inkProjectile.png", "boltProjectile.png", "laserProjectile.png"
  ]);
  hudManager.preload();
  tileManager.preload();

  //loadSound('assets/sound/background.mp3', e => e.play());
  fontConfa = loadFont('assets/fonts/Confarreatio.otf'); // load font
  fontFranx = loadFont('assets/fonts/franxurter.ttf');
}

let character;
function setup() {

  textFont(fontFranx); // set font

  spriteManager.load(); // load sprites
  tileManager.load();

  roomManager.load(); //load rooms

  // test some enemies
  // gameManager.queue(new Shark(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  // gameManager.queue(new Urchin(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  // gameManager.queue(new Clam(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  // gameManager.queue(new Pufferfish(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  
  character = new Character(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);
  gameManager.queue(character); // add our character to the render queue

  let canvas = createCanvas(GameManager.CANVAS_X, GameManager.CANVAS_Y);
  canvas.style('cursor', 'url(\'assets/hud/crosshair.png\'), none');
  canvas.background(100, 140, 160);
  canvas.position((screen.width - GameManager.CANVAS_X) / 2, 15); //centering the game canvas

  canvas.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); } // disable right click
}

function draw(){

  if (menuManager.active) {
    menuManager.render();
    return;
  }

  roomManager.render();
  gameManager.render();
  hudManager.render();
}

// Key Events
function keyPressed() {
  if (menuManager.active) return;
  character.keyPressed(key, true);
}

function keyReleased() {
  if (menuManager.active) return;
  character.keyPressed(key, false);
}

// Mouse Events
function mouseMoved() {
  if (menuManager.active) menuManager.mouseMoved(mouseX, mouseY);
  else character.mouseMoved(mouseX, mouseY);
}

function mousePressed(event) {
  if (menuManager.active) menuManager.mouseClicked(mouseX, mouseY);
  else character.mouseClicked(event.button);
}


