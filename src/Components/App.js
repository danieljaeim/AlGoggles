import React from 'react';
import Arena from '../Components/Arena';

const width = 60; //make this 2x height
const height = 30;
const START_TILE = { x: 0, y: 0 };
const END_TILE = { x: 19, y: 0 };

class App extends React.Component {

  state = {
    arenaArr: null,
    mouseDown: false,
    startTile: undefined,
    endTile: undefined,
    movingStart: false,
    movingEnd: false
  };

  componentDidMount = () => {
    let dataArr = new Array(height).fill(0).map(_ => new Array(width).fill(0));

    let startTile;
    let endTile;

    for (let i = 0; i < dataArr.length; i++) {
      for (let j = 0; j < dataArr[i].length; j++) {
        if (i === START_TILE.y && j === START_TILE.x) {
          dataArr[i][j] = new Tile("START", j, i);
          startTile = dataArr[i][j];
          continue;
        }
        if (i === END_TILE.y && j === END_TILE.x) {
          dataArr[i][j] = new Tile("END", j, i);
          endTile = dataArr[i][j];
          continue;
        }
        dataArr[i][j] = new Tile("REG", j, i);
      }
    }

    this.setState({
      arenaArr: dataArr,
      startTile,
      endTile
    });
  }

  //optimize this so it iterates through all in chunks
  updateArenaTile = (x, y, type) => {
    let { arenaArr, mouseDown, movingStart, movingEnd, startTile, endTile } = this.state;
    if (!mouseDown || movingStart || movingEnd) return;
    console.log('calling update arena')
    if ((x === startTile.x && y === startTile.y) || (x === endTile.x && y === endTile.y)) return;

    // let arenaCpy = [...arenaArr];
    arenaArr[y][x].type = arenaArr[y][x] === "WALL" ? "" : "WALL";
    this.setState({ arenaArr: arenaArr });
  }

  updateSpecial = (x, y, type) => {
    console.log('calling updatespecial')
    if (type === "REG") {
      if (this.state.movingStart === true) {
        let { arenaArr, startTile } = this.state;
        arenaArr[startTile.y][startTile.x].type = "REG";
        arenaArr[y][x].type = "START";
        this.setState({ startTile: arenaArr[y][x], movingStart: false });
        return;
      }
      if (this.state.movingEnd === true) {
        let { arenaArr, endTile } = this.state;
        arenaArr[endTile.y][endTile.x].type = "REG";
        arenaArr[y][x].type = "END";
        this.setState({ endTile: arenaArr[y][x], movingEnd: false });
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

  beginDijkstra = () => {

  }

  render() {

    const { arenaArr, mouseDown, movingStart, movingEnd } = this.state;

    return (
      <div onMouseDown={_ => this.setState({ mouseDown: true })}
        onMouseUp={_ => this.setState({ mouseDown: false })}>
        <Arena arena={arenaArr}
          width={width}
          height={height}
          mouseDown={mouseDown}
          updateArenaTile={this.updateArenaTile}
          updateSpecial={this.updateSpecial}
          movingStart={movingStart}
          movingEnd={movingEnd}
        />
      </div>
    );
  }
}

class Tile {

  constructor(type, x, y) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.lit = false;
    this.sorted = false;
  }

  type() {
    return this.type;
  }

  lit() {
    return this.lit;
  }

  isSorted() {
    return this.sorted;
  }

}

export default App;
