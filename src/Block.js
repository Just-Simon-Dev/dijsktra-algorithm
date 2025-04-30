class Block {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = BlockType.EMPTY;
    }

    getWidth() {
        return this.x2 - this.x1;
    }

    getHeight() {
        return this.y2 - this.y1;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    show() {
        fill(255);

        rect(this.x1, this.y1, this.getWidth(), this.getHeight());
    }
    
    click() {
        console.log(`clicked object x1 ${this.x1}, x2 ${this.x2}, y1 ${this.y1}, y2 ${this.y2}`);
    }
}

let BlockType = {
    'EMPTY': 0,
    'WALL': 1,
    'START': 2,
    'END': 3,
    'PATH': 4,
    'VISITED': 5,
}