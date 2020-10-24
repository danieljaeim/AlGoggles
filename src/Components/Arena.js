import React from 'react';
import '../css/Arena.css';
import Tile from '../Components/Tile';

class Arena extends React.Component {
    render() {

        let { arena, width, height, mouseDown, 
            movingStart, movingEnd, updateSpecial, 
            updateArenaTile, startTile, endTile, 
            endStartDistance, startedAlgorithm, neededSteps } = this.props;

        return (
            <div className="arena-container"
                style={{ gridTemplateRows: `repeat(${height}, 1fr)`, gridTemplateColumns: `repeat(${width}, 1fr)` }}>
                {arena ? arena.map((arr, y) => arr.map((tile, x) => {
                    return <Tile
                        key={x + ',' + y}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        endStartDistance={endStartDistance}
                        startTile={startTile}
                        endTile={endTile}
                        distance={tile.distance}
                        lit={tile.lit}
                        visited={tile.avisited}
                        type={tile.type}
                        updateArenaTile={updateArenaTile}
                        updateSpecial={updateSpecial}
                        mouseDown={mouseDown}
                        movingStart={movingStart}
                        movingEnd={movingEnd}
                        neededSteps={neededSteps}
                    />
                }))
                    : null}
            </div>
        );
    }
}

Arena.propTypes = {};

export default Arena;
