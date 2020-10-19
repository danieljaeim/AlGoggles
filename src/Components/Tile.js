import React from 'react';
import '../css/Tile.css';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {x, y, lit, width, height, type, updateArenaTile, mouseDown} = this.props;

        return (
            <div className={type + ' tile-container' + (lit ? ' tile-lit' : '')}
                style={{ width: `calc((80vw - ${width * 2}px) / ${width})`, height: `calc((80vh - ${height * 2}px) / ${height})`}} 
                onMouseDown={_ => updateArenaTile(x, y)}
                onMouseEnter={_ => {if (mouseDown) {updateArenaTile(x, y)}}}>
            </div>
        );
    }
}

Tile.propTypes = {};

export default Tile;
