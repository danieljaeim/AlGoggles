import React from 'react';
import Arena from '../Components/Arena';
import Header from '../Components/Header';

import { calcDistance } from '../data/Algorithms';

import PriorityQueue from '../data/PriorityQueue';

// import algorithms from '../data/Algorithms';

const width = 70; //make this 2x height
const height = 35;
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
    currentAlgorithm: 'DIJKSTRAS', // add an early termination version and a populate weights version
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

  //optimize this so it iterates through all in chunks
  updateArenaTile = (x, y, type) => {
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

  resetAlgorithm = () => {

    let { arenaArr } = this.state;

    arenaArr.forEach(arr => arr.forEach(tile => {
      tile.lit = false;
      tile.avisited = false;
    }));

    this.setState({ startedAlgorithm: false })
  }

  beginAlgorithm = () => {

    let { currentAlgorithm, startTile, endTile, arenaArr } = this.state;

    this.setState({ startedAlgorithm: true });

    switch (currentAlgorithm) {
      case "DIJKSTRAS":
        console.log('calling djik')
        this.beginDijkstra();
        break;
      case "ASTAR":
        this.beginAStar();
        console.log('calling astar')
        break;
      default:
        return;
    }
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

    console.log(path)

    this.triggerVisualizePath(path);
  }

  triggerVisualizePath = (path) => {
    // path.pop();
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
        onMouseUp={_ => this.setState({ mouseDown: false })}>
        <Header beginAlgorithm={this.beginAlgorithm}
          resetAlgorithm={this.resetAlgorithm}
          startedAlgorithm={startedAlgorithm}
          currentAlgorithm={currentAlgorithm}
          updateAlgorithm={this.updateAlgorithm} />
        <Arena
          startedAlgorithm={startedAlgorithm}
          arena={arenaArr}
          startTile={startTile}
          endTile={endTile}
          width={width}
          height={height}
          mouseDown={mouseDown}
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
