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

    reset() {
        this.isWall = false;
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
            this.color = 100;
        } else if(type === BlockType.EMPTY) {
            this.isStart = false;
            this.isEnd = false;
            this.isWall = false;
            this.weight = 1;
            this.color = 255;
        } else if(type === BlockType.PATH) {
            this.color = 0;
        } else if(type === BlockType.VISITED) {
            this.color = 150;
        }
    }

    show() {
        if(this.isStart) {
            fill(0, 255, 0);
            rect(this.x1, this.y1, this.getWidth(), this.getHeight());
            return;
        } else if(this.isEnd) {
            fill(255, 0, 0);
            rect(this.x1, this.y1, this.getWidth(), this.getHeight());
            return;
        } else if (this.weight > 1 && !this.isStart && !this.isEnd && !this.isWall) {
            fill(this.color);
            textAlign(CENTER, CENTER);
            textSize(12);
            text(this.weight, this.x1 + this.getWidth()/2, this.y1 + this.getHeight()/2);
            return;
        }

        fill(this.color);
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