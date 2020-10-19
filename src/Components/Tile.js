import React from 'react';
import '../css/Tile.css';
import PropTypes from 'prop-types';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {x, y, lit, start, end, updateArenaTile, mouseDown} = this.props;

        let type = start ? 'start-' : end ? 'end-' : '';

        return (
            <div className={type + 'tile-container' + (lit ? ' tile-lit' : '')} 
                onMouseDown={_ => updateArenaTile(x, y)}
                onMouseEnter={_ => {if (mouseDown) {updateArenaTile(x, y)}}}>
                {/* {'x: ' + x + ' y: ' + y}
                <br/>
                {' \ lit: ' + lit} */}
            </div>
        );
    }
}

Tile.propTypes = {};

export default Tile;
