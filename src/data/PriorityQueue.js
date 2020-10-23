export default class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(elem, priority) {
        let qNode = new QueueNode(elem, priority);

        if (this.isEmpty()) {
            this.items.push(qNode);
            return;
        }

        if (this.items[this.items.length - 1].priority <= qNode.priority) {
            this.items.push(qNode);
            return;
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qNode.priority) {
                this.items.splice(i, 0, qNode);
                break;
            }
        }
    }

    rear() {
        if (this.isEmpty()) {
            return "Empty Queue";
        }
        return this.items[this.items.length - 1];
    }

    front() {
        if (this.isEmpty()) {
            return "Empty Queue";
        }

        return this.items[0];
    }

    // returns the zeroth element in my list (shortest weight)
    dequeue() {
        if (this.isEmpty()) {
            return 'Empty Queue';
        }
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    print() {
        return this.items.map(i => i.elem.y + ' ' + i.elem.x);
    }
}

class QueueNode {
    constructor(elem, priority) {
        this.elem = elem;
        this.priority = priority;
    }
}