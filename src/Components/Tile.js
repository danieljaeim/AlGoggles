import React from 'react';
import '../css/Tile.css';

const visitDelay = 0.001;

class Tile extends React.Component {
    render() {
        let { x, y, lit, visited, distance, neededSteps, type, movingStart, movingEnd, updateArenaTile, updateSpecial, handleMouseUp } = this.props;

        let movingState = (type === "START" && movingStart) || (type === "END" && movingEnd) ? ' moving forwards' : '';
        let litState = lit && !(type === "END" || type === "START");
        let visitState = visited && !(type === "END" || type === "START");

        let litAnimation = litState ? `.1s light-up linear ${distance * 0.001 + neededSteps * 0.0035}s forwards, ` : '';
        let visitAnimation = visitState ? `1.5s visited linear ${distance * 3 * visitDelay}s forwards` : '';
        // keep this as ${endStartDistance * delay * visitDelay} for some cool effects

        return (
            <div className={type + ' tile-container ' + movingState + 'tile'+ '-' + x + '-' + y}
                style={{
                    animation: litAnimation + visitAnimation,
                }}
                onMouseDown={_ => updateSpecial(x, y, type)}
                onMouseUp={_ => handleMouseUp()}
                onMouseEnter={_ => updateArenaTile(x, y, type)} />
        );
    }
}

Tile.propTypes = {};

export default Tile;


