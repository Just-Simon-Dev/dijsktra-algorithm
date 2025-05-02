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
        // Pobierz punkty startowy i końcowy
        const startPoint = this.getStart();
        const endPoint = this.getEnd();
        const start = this.grid[startPoint.y][startPoint.x];
        const end = this.grid[endPoint.y][endPoint.x];

        // Inicjalizacja odległości i poprzedników
        for (let row of this.grid) {
            for (let cell of row) {
                cell.distance = Infinity;
                cell.previous = null;
            }
        }

        // Zbiór odwiedzonych węzłów i funkcja generująca klucz
        const visited = new Set();
        const getNodeKey = ({x, y}) => `${x},${y}`;

        // Inicjalizacja dla punktu startowego
        start.distance = 0;
        const heap = new MinHeap();
        heap.push(start);

        // Główna pętla algorytmu
        while (!heap.isEmpty()) {
            // Dodaj małe opóźnienie dla wizualizacji
            await new Promise(resolve => setTimeout(resolve, 10));

            const current = heap.pop();
            const currentKey = getNodeKey(current.getCoordinates());
            
            // Pomiń już odwiedzone węzły
            if (visited.has(currentKey)) continue;
            visited.add(currentKey);

            // Zakończ jeśli znaleźliśmy cel
            if (current === end) break;

            // Oznacz odwiedzone węzły (z wyjątkiem startu i końca)
            if (current !== start && current !== end) {
                current.changeType(BlockType.VISITED);
            }

            // Sprawdź wszystkich sąsiadów
            const neighbors = this.getNeighbors(current.getCoordinates());
            for (const neighbor of neighbors) {
                const neighborKey = getNodeKey(neighbor.getCoordinates());
            
                // Pomiń odwiedzone węzły i ściany
                if (visited.has(neighborKey) || neighbor.isWall) continue;

                // Oblicz nową potencjalną odległość
                const newDistance = current.distance + neighbor.weight;
            
                // Aktualizuj odległość jeśli znaleziono krótszą ścieżkę
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previous = current;
                    heap.push(neighbor);
                }
            }
        }

        // Wizualizacja znalezionej ścieżki
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