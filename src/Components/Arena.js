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

        let { arena, width, height, updateArenaTile, mouseDown } = this.props;

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
                        mouseDown={mouseDown}
                    />
                }))
                    : null}
            </div>
        );
    }
}

Arena.propTypes = {};

export default Arena;
