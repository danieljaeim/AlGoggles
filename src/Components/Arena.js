import React from 'react';
import '../css/Arena.css';
import Tile from '../Components/Tile';
import PropTypes from 'prop-types';

class Arena extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        let {arena, width, height, updateArenaTile, mouseDown} = this.props;

        return (
            <div className="arena-container">
                {arena ? arena.map((arr, y) => arr.map((tile, x) => 
                    <Tile key={x + ',' + y} 
                          x={x} 
                          y={y} 
                          {...tile}
                          updateArenaTile={updateArenaTile}
                          mouseDown={mouseDown}
                    />)) 
                : null}
            </div>
        );
    }
}

Arena.propTypes = {};

export default Arena;
