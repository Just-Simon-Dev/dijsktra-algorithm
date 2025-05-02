let grid;
let isDragging = false;

function setup() {
    createCanvas(windowWidth, windowHeight - 308.6);
    grid = new Grid(windowWidth, windowHeight - 308.6);
    ellipseMode(RADIUS);
    setupModeButtons();
}

function setupModeButtons() {
    // pobierz wszystkie elementy menu
    let elements = document.querySelectorAll('.menu .element');

    // dodaj nasłuchiwanie kliknięć dla każdego przycisku
    elements[0].addEventListener('click', () => setMode('isStartMode'));
    elements[1].addEventListener('click', () => setMode('isEndMode'));
    elements[2].addEventListener('click', () => setMode('isWallMode'));
    elements[3].addEventListener('click', () => setMode('isEraseMode'));
    elements[4].addEventListener('click', () => setMode('isWeightMode'));
    elements[5].addEventListener('click', () => grid.resetCells());
}

function setMode(selectedMode) {
    // resetuj wszystkie tryby
    config.isStartMode = false;
    config.isEndMode = false;
    config.isWallMode = false;
    config.isWeightMode = false;
    config.isEraseMode = false;

    // ustaw wybrany tryb
    config[selectedMode] = true;


    // zaktualizuj wizualnie aktywny przycisk
    let elements = document.querySelectorAll('.menu .element');
    elements.forEach((element, index) => {
        if ((index === 0 && selectedMode === 'isStartMode') ||
            (index === 1 && selectedMode === 'isEndMode') ||
            (index === 2 && selectedMode === 'isWallMode') ||
            (index === 3 && selectedMode === 'isEraseMode') ||
            (index === 4 && selectedMode === 'isWeightMode')) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

async function startDijkstra() {
    if (grid.isStartPointInitialized() && grid.isEndPointInitialized()) {
        await grid.calculateShortestPath();
    } else {
        alert("Proszę ustawić punkt startowy i końcowy.");
    }
}

function mousePressed() {
    isDragging = true;
    let cell = grid.getCell();
    if (cell) {
        cell.click(config);
    }
}

function mouseDragged() {
    if (isDragging) {
        let cell = grid.getCell();
         if (cell) {
            cell.click(config);
        }
    }
}

function mouseReleased() {
    isDragging = false;
}

function draw() {
    background(255);
    grid.show();
}