class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        const top = this.heap[0];
        const bottom = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = bottom;
            this.sinkDown(0);
        }
        return top;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(n) {
        const element = this.heap[n];
        while (n > 0) {
            const parentN = Math.floor((n - 1) / 2);
            const parent = this.heap[parentN];
            if (element.distance >= parent.distance) break;
            this.heap[n] = parent;
            this.heap[parentN] = element;
            n = parentN;
        }
    }

    sinkDown(n) {
        const length = this.heap.length;
        const element = this.heap[n];

        while (true) {
            let leftN = 2 * n + 1;
            let rightN = 2 * n + 2;
            let swap = null;

            if (leftN < length) {
                let left = this.heap[leftN];
                if (left.distance < element.distance) swap = leftN;
            }

            if (rightN < length) {
                let right = this.heap[rightN];
                if (
                    (swap === null && right.distance < element.distance) ||
                    (swap !== null && right.distance < this.heap[swap].distance)
                ) {
                    swap = rightN;
                }
            }

            if (swap === null) break;
            this.heap[n] = this.heap[swap];
            this.heap[swap] = element;
            n = swap;
        }
    }
}
