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

    getCellByXY(x, y) {
        if (x < 0 || x >= this.verticalNumberOfBlocks || y < 0 || y >= this.horizontalNumberOfBlocks) {
            throw new Error("Index out of bounds");
        }

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