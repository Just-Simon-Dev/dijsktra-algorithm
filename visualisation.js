let grid;

function initialization(){
  // here we are initializing the project variables that can be changed in the menu
}

function setup() {
  initialization();
  createCanvas(windowWidth, windowHeight);
  grid = new Grid(windowWidth, windowHeight);
  ellipseMode(RADIUS);
}

function mousePressed() {
    let cell = grid.getCell();
    cell.click();
}

function draw() {
  background(255);
  grid.show();
}