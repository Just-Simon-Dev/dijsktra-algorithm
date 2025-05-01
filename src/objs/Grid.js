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

    async calculateShortestPath() {
        let startPoint = this.getStart();
        let endPoint = this.getEnd();
        let start = this.grid[startPoint.y][startPoint.x];
        let end = this.grid[endPoint.y][endPoint.x];
        
        // Reset wszystkich odległości
        for (let y = 0; y < this.horizontalNumberOfBlocks; y++) {
            for (let x = 0; x < this.verticalNumberOfBlocks; x++) {
                this.grid[y][x].distance = Infinity;
                this.grid[y][x].previous = null;
            }
        }

        let queue = [];
        let visited = new Set();

        start.distance = 0;
        queue.push(start);

        while (queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
            
            queue.sort((a, b) => a.distance - b.distance);
            let current = queue.shift();

            if (current === end) {
                break;
            }

            if (visited.has(current)) {
                continue;
            }

            visited.add(current);
            if (current !== start && current !== end) {
                current.changeType(BlockType.VISITED);
            }

            let neighbors = this.getNeighbors(current.getCoordinates());

            for (let neighbor of neighbors) {
                if (!visited.has(neighbor) && !neighbor.isWall) {
                    let tentativeDistance = current.distance + neighbor.weight;
                    if (tentativeDistance < neighbor.distance) {
                        neighbor.distance = tentativeDistance;
                        neighbor.previous = current;
                        queue.push(neighbor);
                    }
                }
            }
        }

        if (end.previous) {
            let current = end.previous;
            while (current && current !== start) {
                await new Promise(resolve => setTimeout(resolve, 50));
                current.changeType(BlockType.PATH);
                current = current.previous;
            }
        }
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