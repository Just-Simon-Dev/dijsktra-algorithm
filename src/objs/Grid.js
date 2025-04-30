class Grid {
    constructor(width, height, length = 20) {
        this.width = width;
        this.height = height;
        this.length = length;
        this.grid = []
        this.verticalNumberOfBlocks = Math.floor(width / length);
        this.horizontalNumberOfBlocks = Math.floor(height / length);

        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            const row = [];
            for(let x = 0; x < this.verticalNumberOfBlocks; x++) {
                row.push(new Block(x * length, y * length, (x + 1) * length, (y + 1) * length));
            }
            this.grid.push(row);
        }
    }

    isStartPointInitialized() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                if (this.grid[y][x].isStart) {
                    return true;
                }
            }
        }
        return false;
    }

    isEndPointInitialized() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                if (this.grid[y][x].isEnd) {
                    return true;
                }
            }
        }
        return false;
    }

    getCellByXY(x, y) {
        if (x < 0 || x >= this.verticalNumberOfBlocks || y < 0 || y >= this.horizontalNumberOfBlocks) return;

        return this.grid[y][x];
    }

    getCell() {
        let x = Math.floor(mouseX / this.length);
        let y = Math.floor(mouseY / this.length);

        return this.getCellByXY(x, y)
    }

    show() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                this.grid[y][x].show();
            }
        }
    }
}