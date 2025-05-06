function preload() {
    startImg = loadImage('assets/worm-hand-drawn-animal-svgrepo-com.svg');
    endImg = loadImage('assets/flower1-svgrepo-com.svg');
}

let startImg;
let endImg;

let BlockType = {
    'EMPTY': 0,
    'WALL': 1,
    'START': 2,
    'END': 3,
    'PATH': 4,
    'VISITED': 5,
}

class Block {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = BlockType.EMPTY;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.color = 255;
        this.weight = 1;
        this.distance = Infinity;
    }

    reset(excludeWalls = false, excludePath = false) {
        if (!excludeWalls) this.isWall = false;
        if (!excludePath) this.type = BlockType.EMPTY;
        this.color = 255;
        this.weight = 1;
        this.distance = Infinity;
    }

    getWidth() {
        return this.x2 - this.x1;
    }

    getHeight() {
        return this.y2 - this.y1;
    }

    getCoordinates() {
        return {
            x: Math.floor(this.x1 / this.getWidth()),
            y: Math.floor(this.y1 / this.getHeight())
        };
    }

    getType() {
        return this.type;
    }

    changeType(type) {
        this.type = type;
        if(type === BlockType.START) {
            this.isStart = true;
        } else if(type === BlockType.END) {
            this.isEnd = true;
        } else if(type === BlockType.WALL) {
            this.isWall = true;
            this.color = color(178, 34, 34);
        } else if(type === BlockType.EMPTY) {
            this.isStart = false;
            this.isEnd = false;
            this.isWall = false;
            this.weight = 1;
            this.color = 255;
        } else if(type === BlockType.PATH) {
            this.color = color(40, 167, 69);
        } else if(type === BlockType.VISITED) {
            this.color = 150;
        }
    }

    show() {
        if(this.isStart) {
            if (startImg) {
                image(startImg, this.x1, this.y1, this.getWidth(), this.getHeight());
            } else {
                fill(0, 255, 0);
                rect(this.x1, this.y1, this.getWidth(), this.getHeight());
            }
            return;
        } else if(this.isEnd) {
            if (endImg) {
                image(endImg, this.x1, this.y1, this.getWidth(), this.getHeight());
            } else {
                fill(255, 0, 0);
                rect(this.x1, this.y1, this.getWidth(), this.getHeight());
            }
            return;
        } else if (this.weight > 1 && !this.isStart && !this.isEnd && !this.isWall) {
            stroke(200);
            strokeWeight(1);
            fill(this.color);
            textAlign(CENTER, CENTER);
            textSize(12);
            text(this.weight, this.x1 + this.getWidth()/2, this.y1 + this.getHeight()/2);
            return;
        }

        stroke(200);
        strokeWeight(1);

        if (this.isWall) {
            fill(178, 34, 34);
        } else if (this.type === BlockType.PATH) {
            fill(40, 167, 69);
        } else {
            fill(this.color);
        }

        rect(this.x1, this.y1, this.getWidth(), this.getHeight());
    }

    click(conf) {
        if (conf.isStartMode) {
            if (!this.isStart && grid.isStartPointInitialized()) {
                for (let y = 0; y < grid.horizontalNumberOfBlocks; y++) {
                    for (let x = 0; x < grid.verticalNumberOfBlocks; x++) {
                        if (grid.grid[y][x].isStart) {
                            grid.grid[y][x].changeType(BlockType.EMPTY);
                        }
                    }
                }
            }
            this.changeType(BlockType.START);
        } else if (conf.isEndMode) {
            if (!this.isEnd && grid.isEndPointInitialized()) {
                for (let y = 0; y < grid.horizontalNumberOfBlocks; y++) {
                    for (let x = 0; x < grid.verticalNumberOfBlocks; x++) {
                        if (grid.grid[y][x].isEnd) {
                            grid.grid[y][x].changeType(BlockType.EMPTY);
                        }
                    }
                }
            }
            this.changeType(BlockType.END);
        } else if (conf.isWallMode) {
            this.changeType(BlockType.WALL);
        } else if (conf.isWeightMode) {
            this.showWeightPopup();
        } else if (conf.isEraseMode) {
            this.changeType(BlockType.EMPTY);
        }
    }

    showWeightPopup() {
        if (this.isStart || this.isEnd || this.isWall) return;

        const weight = prompt('Podaj wagę (2-9):', this.weight);
        if (weight !== null) {
            const weightNum = parseInt(weight);
            if (!isNaN(weightNum) && weightNum > 1 && weightNum <= 9) {
                this.weight = weightNum;
                this.color = 200;
            } else {
                alert('Proszę podać liczbę od 2 do 9');
            }
        }
    }
}