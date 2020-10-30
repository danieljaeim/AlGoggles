import React from 'react';
import Arena from './Arena';
import Header from './Header';

import { calcDistance } from '../data/Algorithms';

import PriorityQueue from '../data/PriorityQueue';
import Stack from '../data/Stack';
import Queue from '../data/Queue';

// import algorithms from '../data/Algorithms';

const width = 60; //make this 2x height
const height = 30;
const START_TILE = { x: Math.floor(width / 4), y: Math.floor(height / 2) };
const END_TILE = { x: Math.floor(width * 3 / 4), y: Math.floor(height / 2) };

class App extends React.Component {

    state = {
        arenaArr: null,
        mouseDown: false,
        startTile: undefined,
        endTile: undefined,
        movingStart: false,
        movingEnd: false,
        currentMaze: 'DFSMAZE',
        currentAlgorithm: 'DFSMAZE', // add an early termination version and a populate weights version
        startedAlgorithm: false,
        foundEnd: false,
        endStartDistance: Infinity,
        neededSteps: 0
    };

    componentDidMount = () => {
        let dataArr = new Array(height).fill(0).map(_ => new Array(width).fill(0));

        let startTile;
        let endTile;

        for (let i = 0; i < dataArr.length; i++) {
            for (let j = 0; j < dataArr[i].length; j++) {

                let curTile = new Tile("REG", j, i);

                if (i === START_TILE.y && j === START_TILE.x) {
                    curTile.type = "START";
                    startTile = curTile;
                }

                if (i === END_TILE.y && j === END_TILE.x) {
                    curTile.type = "END";
                    endTile = curTile;
                }

                dataArr[i][j] = curTile;
            }
        }

        dataArr.forEach((arr, y) => arr.forEach((tile, x) => {
            if (y > 0) tile.adjacent.push(dataArr[y - 1][x]);
            if (x < width - 1) tile.adjacent.push(dataArr[y][x + 1]);
            if (y < height - 1) tile.adjacent.push(dataArr[y + 1][x]);
            if (x > 0) tile.adjacent.push(dataArr[y][x - 1]);
        }))

        this.setState({
            arenaArr: dataArr,
            startTile,
            endTile
        });
    }

    updateAlgorithm = (algorithm) => {
        this.setState({ currentAlgorithm: algorithm })
    }

    handleMouseUp = () => {
        this.setState({ mouseDown: false })
    }

    //optimize this so it iterates through all in chunks
    updateArenaTile = (x, y) => {
        let { arenaArr, mouseDown, movingStart, movingEnd, startTile, endTile } = this.state;
        if (!mouseDown || movingStart || movingEnd) return;
        if ((x === startTile.x && y === startTile.y) || (x === endTile.x && y === endTile.y)) return;

        arenaArr[y][x].lit = false;
        arenaArr[y][x].visited = false;
        arenaArr[y][x].type = arenaArr[y][x].type === "WALL" ? "REG" : "WALL";
        this.setState({ arenaArr: arenaArr });
    }

    updateSpecial = (x, y, type) => {
        if (type === "REG") {
            if (this.state.movingStart === true) {
                let { arenaArr, startTile, endTile } = this.state;
                arenaArr[startTile.y][startTile.x].type = "REG";
                arenaArr[y][x].type = "START";
                this.setState({ startTile: arenaArr[y][x], movingStart: false, endStartDistance: calcDistance(x, endTile.x, y, endTile.y) });
                return;
            }
            if (this.state.movingEnd === true) {
                let { arenaArr, startTile, endTile } = this.state;
                arenaArr[endTile.y][endTile.x].type = "REG";
                arenaArr[y][x].type = "END";
                this.setState({ endTile: arenaArr[y][x], movingEnd: false, endStartDistance: calcDistance(x, startTile.x, y, startTile.y) });
                return;
            }
        }

        if (type === "START") {
            this.setState({ movingStart: true });
        }

        if (type === "END") {
            this.setState({ movingEnd: true });
        }
    }

    resetAlgorithm = (maze) => {
        let { arenaArr } = this.state;

        arenaArr.forEach(arr => arr.forEach(tile => {
            tile.lit = false;
            tile.avisited = false;
            tile.type = maze && tile.type == "WALL" ? "REG" : tile.type 
        }));

        this.setState({ startedAlgorithm: false })
    }

    beginAlgorithm = () => {

        let { currentAlgorithm, startTile } = this.state;

        this.setState({ startedAlgorithm: true });

        switch (currentAlgorithm) {
            case "DIJKSTRAS":
                this.beginDijkstra();
                break;
            case "ASTAR":
                this.beginAStar();
                break;
            case "DFS":
                this.beginDFS(startTile);
                break;
            case "BFS":
                this.beginBFS(startTile);
                break;
            case "ELLER":
                this.beginEller();
                break;
            case "DFSMAZE":
                this.beginDFSMaze();
                break;
            default:
                return;
        }
    }

    generateNewRow = (first) => {
        return new Array(Math.floor(width / 2) - 1).fill(0).map((val, i) => {
            return { wallUp: true, wallRight: i === Math.floor(width / 2) - 2, wallDown: false, wallLeft: i == 0, set: first ? i : null }
        });
    }

    generateNewRowInts = (first) => {
        return new Array(Math.floor(width / 2) - 1).fill(0).map((val, i) => {
            return first ? i : null;
        });
    }

    randomMergeRow = (row, mergeProb) => {
        for (let i = 0; i < row.length - i; i++) {
            let rand = Math.random() < mergeProb;
            if (rand) {
                row[i] = row[i + 1];
            }
        }

        return row;
    }

    spawnNewRow = (topRow) => {
        let retRow = new Array(topRow.length).fill(null);

        let curNum = topRow[0];
        let group = [0]; //stores indices of same numbers

        for (let i = 0; i < topRow.length - 1; i++) {
            let top = topRow[i];
            if (curNum != top) {
                //take my group, pick some points and shove it into retRow at indices
                if (group.length === 1) {
                    retRow[i] = top;
                    curNum = topRow[i + 1];
                    group = [i + 1];
                    continue;
                }

                let atLeastOne = group[Math.random() * group.length];
                retRow[atLeastOne] = top;

                let chance = Math.max(0.3, (group.length / 10));
                for (let j = 0; j < group.length; j++) {
                    let rand = Math.random() < chance;
                    if (rand) {
                        retRow[group[j]] = top;
                    }
                }
            }
            group.push(top);


        }
    }

    beginEller = () => {
        let { arenaArr, startTile, endTile } = this.state;
        let matrix = [];

        let max = Math.floor(width / 2) - 1; // make a max-row

        let curRow = this.generateNewRowInts(true);
        curRow = this.randomMergeRow(curRow, 0.5);

        console.log(curRow);

        for (let i = 0; i < curRow.length - 1; i++) {
            let cur = curRow[i];
            let next = curRow[i + 1];
            let rand = Math.random() < 0.5;

            if (rand && cur.set !== next.set) {
                next.set = cur.set;
            }
        }
        matrix.push(curRow);
        while (matrix.length < 20) {
            curRow = this.generateNewRow();
            let lastRow = matrix[matrix.length - 1];
            let firstInSet = true;
            let curSet = lastRow[0].set;
            for (let i = 1; i < lastRow.length; i++) {
                let prev = lastRow[i];
                let cur = curRow[i];
                if (firstInSet) {

                }
                let rand = Math.random() < 0.5;

            }
        }
    }

    // =====================+

    // MAZE GENERATION ALGORITHMS 
    /*
        1. DFS
        2. Eller's
    */
    // =====================+

    beginDFSMaze = () => {
        let { arenaArr, startTile, endTile } = this.state;

        let path = [];

        arenaArr.forEach(arr => arr.forEach(tile => {
            if (tile.type == "REG") {
                tile.type = "WALL";
            }
        }));

        let st = new Stack();
        startTile.avisited = true;
        st.push(startTile);
        let curStep = 0;

        while (!st.isEmpty()) {
            let s = st.pop();
            path.push(s.y + " " + s.x);

            if (s.x == endTile.x && s.y == endTile.y) {
                break;
            }

            s.distance = curStep;
            curStep += 5;
            // s.avisited = true;

            let randStart = Math.floor(Math.random() * s.adjacent.length);
            let neighbor;
            let far;

            for (let i = randStart; i < randStart + s.adjacent.length - 1; i++) {
                neighbor = s.adjacent[i % s.adjacent.length];
                far = neighbor.adjacent[i % neighbor.adjacent.length];
                if (far.avisited || neighbor.avisited || neighbor.type !== "WALL" || far.type == "REG") continue;
                st.push(s);
                neighbor.type = "REG";
                // neighbor.avisited = true;
                // far.avisited = true;
                if (far.type == "WALL") {
                    far.type = "REG";
                }
                st.push(far)
                break;
            }
        }

        // this.triggerVisualizePath(path);
    }


    beginEller = () => {
        let { arenaArr, startTile, endTile } = this.state;
        let matrix = [];

        let max = Math.floor(width / 2) - 1; // make a max-row

        let curRow = this.generateNewRowInts(true);
        curRow = this.randomMergeRow(curRow, 0.5);

        console.log(curRow);

        for (let i = 0; i < curRow.length - 1; i++) {
            let cur = curRow[i];
            let next = curRow[i + 1];
            let rand = Math.random() < 0.5;

            if (rand && cur.set !== next.set) {
                next.set = cur.set;
            }
        }
        matrix.push(curRow);
        while (matrix.length < 20) {
            curRow = this.generateNewRow();
            let lastRow = matrix[matrix.length - 1];
            let firstInSet = true;
            let curSet = lastRow[0].set;
            for (let i = 1; i < lastRow.length; i++) {
                let prev = lastRow[i];
                let cur = curRow[i];
                if (firstInSet) {

                }
                let rand = Math.random() < 0.5;
            }
        }
    }


    // =====================+

    // PATHFINDING ALGORITHMS 
    /*
        1. dijkstras, 
        2. DFS, BFS
        3. a* 
    */
    // =====================+

    beginBFS = () => {
        let { startTile, endTile } = this.state;

        let path = [];

        let queue = new Queue();
        queue.enqueue(startTile);
        let curStep = 0;

        while (!queue.isEmpty()) {
            let q = queue.dequeue();

            if (q.x == endTile.x && q.y == endTile.y) {
                break;
            }

            if (q.avisited) continue;

            q.distance = curStep;
            curStep += 5;
            q.avisited = true;

            q.adjacent.forEach(neighbor => {
                if (neighbor.avisited || neighbor.type == "WALL") return;
                queue.enqueue(neighbor);
                path.push(q.y + " " + q.x);
            })
        }

        this.triggerVisualizePath(path);
    }

    beginDFS = () => {
        let { startTile, endTile } = this.state;

        let path = [];

        let st = new Stack();
        st.push(startTile);
        let curStep = 0;

        while (!st.isEmpty()) {
            let s = st.pop();
            path.push(s.y + " " + s.x);

            if (s.x == endTile.x && s.y == endTile.y) {
                break;
            }

            if (s.avisited) continue;

            s.distance = curStep;
            curStep += 5;
            s.avisited = true;

            s.adjacent.forEach(neighbor => {
                if (neighbor.avisited || neighbor.type == "WALL") return;
                st.push(neighbor);
            })
        }

        console.log(path);

        this.triggerVisualizePath(path);
    }

    beginDijkstra = () => {
        let { arenaArr, startTile, endTile } = this.state;

        let distances = {};
        let trace = {};
        let pq = new PriorityQueue();

        arenaArr.forEach(arr => arr.forEach(tile => {
            if (tile !== startTile) {
                let tileKey = tile.y + ' ' + tile.x;
                tile.lit = false;
                distances[tileKey] = Infinity;
            }
        }));

        startTile.avisited = true;
        startTile.distance = 0;
        distances[startTile.y + ' ' + startTile.x] = 0;

        pq.enqueue(startTile, 0);

        // let foundEnd = false; adding this foundEnd condition makes the graph look a lot less interesting :P
        let foundEnd = false;

        let curStep = 0;
        while (!pq.isEmpty()) {
            let curNode = pq.dequeue().elem;

            if (curNode.y === endTile.y && curNode.x === endTile.x) {
                this.setState({ neededSteps: curStep });
                break;
            }

            let curDistance = distances[curNode.y + ' ' + curNode.x];
            curNode.adjacent.forEach(neighbor => {
                if (neighbor.type == "WALL") return;
                if (!neighbor.avisited) {
                    neighbor.avisited = true;
                    let alt = curDistance + 1;
                    if (alt < distances[neighbor.y + ' ' + neighbor.x]) {
                        distances[neighbor.y + ' ' + neighbor.x] = curDistance + 1;
                        trace[neighbor.y + ' ' + neighbor.x] = curNode.y + ' ' + curNode.x;
                        neighbor.distance = curStep;
                        curStep++;
                        pq.enqueue(neighbor, curDistance + 1)
                    }
                }
            });
        }

        let endKey = endTile.y + ' ' + endTile.x;
        let startKey = startTile.y + ' ' + startTile.x;

        let path = [];
        let lastStep = endKey;

        while (lastStep !== startKey) {
            path.push(lastStep);
            lastStep = trace[lastStep];
        }

        this.setState({ endStartDistance: path.length - 1 })

        path = path.reverse();
        return this.triggerVisualizePath(path);
    }

    beginAStar = async () => {
        let { arenaArr, startTile, endTile } = this.state;

        let trace = {};
        let pq = new PriorityQueue();

        arenaArr.forEach(arr => arr.forEach(tile => {
            if (tile !== startTile) {
                tile.lit = false;
                tile.f = 0;
                tile.g = 0;
                tile.h = 0;
                tile.closed = false;
            }
        }));

        trace[startTile.y + ' ' + startTile.x] = 0;
        pq.enqueue(startTile, 0);
        startTile.avisited = true;
        let curStep = 0;

        while (!pq.isEmpty()) {
            let curNode = pq.dequeue().elem;
            curNode.closed = true;
            let curG = curNode.g;

            if (curNode.y === endTile.y && curNode.x === endTile.x) {
                this.setState({ neededSteps: curStep });
                break;
            }

            curNode.adjacent.forEach(neighbor => {
                if (neighbor.type === "WALL" || neighbor.closed) return;
                let gScore = curG + 1;
                let wasVisited = neighbor.avisited;
                if (!wasVisited || gScore < neighbor.g) {
                    neighbor.avisited = true;
                    trace[neighbor.y + ' ' + neighbor.x] = curNode.y + ' ' + curNode.x;
                    neighbor.h = Math.abs(endTile.y - neighbor.y) + Math.abs(endTile.x - neighbor.x);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.distance = curStep;
                    curStep++;
                    pq.enqueue(neighbor, neighbor.f);
                }
            })
        }

        let endKey = endTile.y + ' ' + endTile.x;
        let startKey = startTile.y + ' ' + startTile.x;

        let path = [];
        let lastStep = endKey;

        while (lastStep !== startKey) {
            path.push(lastStep);
            lastStep = trace[lastStep];
        }

        this.triggerVisualizePath(path);
    }

    triggerVisualizePath = (path) => {
        let { arenaArr } = this.state;
        for (let i = 0; i < path.length; i++) {
            let str = path[i];
            let tStr = str.split(' ');
            arenaArr[tStr[0]][tStr[1]].lit = true;
        }
    }

    render() {

        const { arenaArr, mouseDown, movingStart, movingEnd, startTile, neededSteps, endTile, updateAlgorithm, currentAlgorithm, endStartDistance, startedAlgorithm } = this.state;

        return (
            <div onMouseDown={_ => this.setState({ mouseDown: true })}
                onMouseUp={_ => this.setState({ mouseDown: false })} >
                <Header beginAlgorithm={this.beginAlgorithm}
                    resetAlgorithm={this.resetAlgorithm}
                    startedAlgorithm={startedAlgorithm}
                    currentAlgorithm={currentAlgorithm}
                    updateAlgorithm={this.updateAlgorithm}
                />
                <Arena startedAlgorithm={startedAlgorithm}
                    arena={arenaArr}
                    startTile={startTile}
                    endTile={endTile}
                    width={width}
                    height={height}
                    mouseDown={mouseDown}
                    handleMouseUp={this.handleMouseUp}
                    updateArenaTile={this.updateArenaTile}
                    updateSpecial={this.updateSpecial}
                    movingStart={movingStart}
                    movingEnd={movingEnd}
                    endStartDistance={endStartDistance}
                    neededSteps={neededSteps}
                />
            </div>
        );
    }
}

class Tile {

    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this.avisited = false;
        this.distance = null;
        this.adjacent = [];
        this.type = type;
        this.lit = false;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.closed = false;
    }

    type() {
        return this.type;
    }

    lit() {
        return this.lit;
    }

    visited() {
        return this.avisited;
    }

    isSorted() {
        return this.sorted;
    }

}

export default App;