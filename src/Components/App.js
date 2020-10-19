import React from 'react';
import Arena from '../Components/Arena';

const width = 60; //make this 2x height
const height = 30;
const START_TILE = { x: 0, y: 1 };
const END_TILE = { x: 19, y: 0 };

class App extends React.Component {

  state = {
    arenaArr: null,
    mouseDown: false,
    startTile: undefined,
    endTile: undefined
  };

  componentDidMount = () => {
    let dataArr = new Array(height).fill(0).map(_ => new Array(width).fill(0));

    let startTile;
    let endTile;

    for (let i = 0; i < dataArr.length; i++) {
      for (let j = 0; j < dataArr[i].length; j++) {
        if (i === START_TILE.y && j === START_TILE.x) {
          dataArr[i][j] = new Tile("START");
          startTile = dataArr[i][j];
          continue;
        }
        if (i === END_TILE.y && j === END_TILE.x) {
          dataArr[i][j] = new Tile("END");
          endTile = dataArr[i][j];
          continue;
        }
        dataArr[i][j] = new Tile("");
      }
    }

    this.setState({
      arenaArr: dataArr,
      startTile,
      endTile
    });
  }

  //optimize this so it iterates through all in chunks
  updateArenaTile = (x, y, light) => {
    let { arenaArr, mouseDown } = this.state;
    // if (mouseDown) return;
    let arenaCpy = [...arenaArr];
    arenaCpy[y][x].type = arenaCpy[y][x] === "WALL" ? "" : "WALL";
    this.setState({ arenaArr: arenaCpy });
  }

  render() {

    const { arenaArr, mouseDown } = this.state;

    return (
      <div onMouseDown={_ => this.setState({ mouseDown: true })}
           onMouseUp={_ => this.setState({ mouseDown: false })}>
        <Arena arena={arenaArr}
            width={width}
            height={height}
            updateArenaTile={this.updateArenaTile}
            mouseDown={mouseDown} />
      </div>
    );
  }
}

class Tile {

  constructor(type) {
    this.type = type;
    this.lit = false;
  }

  type() {
    return this.type;
  }

  lit() {
    return this.lit;
  }

}

export default App;
