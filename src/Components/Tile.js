import React from 'react';
import '../css/Tile.css';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {x, y, lit, width, height, type, mouseDown, movingStart, movingEnd, updateArenaTile, updateSpecial } = this.props;

        let onClickFunc = () => updateSpecial(x, y, type);
        let onMouseDownFunc = movingStart || movingEnd ? () => {return null} : () => updateArenaTile(x, y, type);
        let onMouseOverFunc = !mouseDown || movingStart || movingEnd ? () => {return null} : () => updateArenaTile(x, y);

        let movingState = (type == "START" && movingStart) || (type == "END" && movingEnd) ? ' moving' : '';

        return (
            <div className={type + ' tile-container' + movingState + (lit ? ' tile-lit' : '')}
                style={{ width: `calc((80vw - ${width * 2}px) / ${width})`, height: `calc((80vh - ${height * 2}px) / ${height})`}} 
                onClick={_ => onClickFunc()}
                onMouseDown={_ => onMouseDownFunc()}
                onMouseOver={_ => onMouseOverFunc()}>
            </div>
        );
    }
}

Tile.propTypes = {};

export default Tile;
