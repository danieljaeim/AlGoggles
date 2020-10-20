import React from 'react';
import '../css/Arena.css';
import Tile from '../Components/Tile';

class Arena extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        let { arena, width, height, mouseDown, movingStart, movingEnd, updateSpecial, updateArenaTile } = this.props;

        return (
            <div className="arena-container">
                {arena ? arena.map((arr, y) => arr.map((tile, x) => {
                    return <Tile 
                        key={x + ',' + y}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        type={tile.type}
                        updateArenaTile={updateArenaTile}
                        updateSpecial={updateSpecial}
                        mouseDown={mouseDown}
                        movingStart={movingStart}
                        movingEnd={movingEnd}
                    />
                }))
                    : null}
            </div>
        );
    }
}

Arena.propTypes = {};

export default Arena;
