class Grid {
    constructor(width, height, length = 20) {
        this.length = length;
        this.verticalNumberOfBlocks = Math.floor(width / this.length);
        this.horizontalNumberOfBlocks = Math.floor(height / this.length);
        this.width = this.verticalNumberOfBlocks * this.length;
        this.height = this.horizontalNumberOfBlocks * this.length;
        this.grid = []

        const offsetX = (window.innerWidth - this.width) / 2;

        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            const row = [];
            for(let x = 0; x < this.verticalNumberOfBlocks; x++) {
                const startX = offsetX + x * length;
                const endX = offsetX + (x + 1) * length;
                const startY = y * length;
                const endY = (y + 1) * length;
                row.push(new Block(startX, startY, endX, endY));
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

    getStart() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                if (this.grid[y][x].isStart) {
                    return {x, y};
                }
            }
        }
    }

    getEnd() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                if (this.grid[y][x].isEnd) {
                    return {x, y};
                }
            }
        }
    }

    getNeighbors(coordinates) {
        let neighbors = [];
        let x = coordinates.x;
        let y = coordinates.y;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                if (Math.abs(i) !== Math.abs(j)) {
                    let neighborX = x + i;
                    let neighborY = y + j;
                    if (this.getCellByXY(neighborX, neighborY)) {
                        neighbors.push(this.getCellByXY(neighborX, neighborY));
                    }
                }
            }
        }
        return neighbors;
    }

    resetCells() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                this.grid[y][x].reset();
            }
        }
    }

    resetCellsExceptWall() {
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                if (!this.grid[y][x].isWall) {
                    this.grid[y][x].reset(true);
                }
            }
        }
    }

    async calculateShortestPath() {
        const startPoint = this.getStart();
        const endPoint = this.getEnd();
        const start = this.grid[startPoint.y][startPoint.x];
        const end = this.grid[endPoint.y][endPoint.x];

        this.resetCellsExceptWall();
        this.initializeDistances();

        const visited = new Set();
        start.distance = 0;

        const heap = new MinHeap();
        heap.push(start);

        while (!heap.isEmpty()) {
            await new Promise(resolve => setTimeout(resolve, 10));

            const current = heap.pop();
            const currentKey = this.generateNodeKey(current.getCoordinates());

            if (visited.has(currentKey)) {
                continue;
            }

            visited.add(currentKey);

            if (current === end) {
                break;
            }

            if (current !== start && current !== end) {
                current.changeType(BlockType.VISITED);
            }

            await this.processNeighbors(current, end, heap, visited);
        }

        await this.visualizePath(start, end);
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
        const offsetX = (window.innerWidth - this.width) / 2;
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                this.grid[y][x].show(offsetX);
            }
        }
    }

    generateNodeKey(coordinates) {
        return `${coordinates.x},${coordinates.y}`;
    }

    initializeDistances() {
        for (let row of this.grid) {
            for (let cell of row) {
                cell.distance = Infinity;
                cell.previous = null;
            }
        }
    }

    async processNeighbors(current, end, heap, visited) {
        const neighbors = this.getNeighbors(current.getCoordinates());

        for (const neighbor of neighbors) {
            const neighborKey = this.generateNodeKey(neighbor.getCoordinates());

            if (visited.has(neighborKey) || neighbor.isWall) {
                continue;
            }

            const newDistance = current.distance + neighbor.weight;

            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.previous = current;
                heap.push(neighbor);
            }
        }
    }

    async visualizePath(start, end) {
        if (end.previous) {
            let current = end.previous;
            while (current && current !== start) {
                await new Promise(resolve => setTimeout(resolve, 50));
                current.changeType(BlockType.PATH);
                current = current.previous;
            }
        }
    }

}