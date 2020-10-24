import React from 'react';
import '../css/Tile.css';

const visitDelay = 0.001;

class Tile extends React.Component {
    render() {
        let { x, y, lit, visited, distance, neededSteps, type, movingStart, movingEnd, updateArenaTile, updateSpecial } = this.props;

        let movingState = (type === "START" && movingStart) || (type === "END" && movingEnd) ? ' moving forwards' : '';
        let litState = lit && !(type === "END" || type === "START");
        let visitState = visited && !(type === "END" || type === "START");

        let litAnimation = litState ? `.1s light-up linear ${distance * 0.001 + neededSteps * 0.0025}s forwards, ` : '';
        let visitAnimation = visitState ? `1s visited linear ${distance * 2 * visitDelay}s` : '';
        // keep this as ${endStartDistance * delay * visitDelay} for some cool effects

        return (
            <div className={type + ' tile-container ' + movingState + x + ' ' + y}
                style={{
                    animation: litAnimation + visitAnimation,
                }}
                onClick={_ => updateSpecial(x, y, type)}
                // onMouseDown={_ => updateArenaTile(x, y, type)} />
                onMouseOver={_ => updateArenaTile(x, y, type)} />
        );
    }
}

Tile.propTypes = {};

export default Tile;


