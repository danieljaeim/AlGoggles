import React from 'react';
import Arena from '../Components/Arena';

const width = 40;
const height = 40;
const START_TILE = { x: width / 4, y: height / 4 };
const END_TILE = { x: 3 * width / 4, y: 3 * height / 4 };

class App extends React.Component {

    state = {
      arenaArr: null,
      mouseDown: false,
      startTile: START_TILE,
      endTile: END_TILE
    };

componentDidMount = () => {
  let dataArr = new Array(width).fill(new Array(height).fill(undefined));

  let startTile;
  let endTile;

  for (let i = 0; i < dataArr.length; i++) {
    for (let j = 0; j < dataArr[i].length; j++) {
      if (i == START_TILE.y && j == START_TILE.x) {
        dataArr[i][j] = new Tile("START");
        startTile = dataArr[i][j];
        continue;
      }
      if (i == END_TILE.y && j == END_TILE.x) {
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
  let { arenaArr } = this.state;
  arenaArr[y][x].lit = !arenaArr[y][x].lit;
  this.setState({ arenaArr });
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

function Tile(type) {
  this.type = type;
  this.isLit = false;
}

Tile.prototype.getType = () => {
  return this.type;
}

Tile.prototype.getIsLit = () => {
  return this.isLit;
}

export default App;
