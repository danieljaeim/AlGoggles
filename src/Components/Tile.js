import React from 'react';
import '../css/Tile.css';
import { calcDistance } from '../data/Algorithms';

const visitDelay = 0.3;

class Tile extends React.Component {
    render() {
        let { x, y, lit, visited, distance, startTile, endStartDistance, endTile, type, movingStart, movingEnd, updateArenaTile, updateSpecial } = this.props;

        let endDist = calcDistance(endTile.x, x, endTile.y, y);
        let startDist = calcDistance(startTile.x, x, startTile.y, y);

        let movingState = (type === "START" && movingStart) || (type === "END" && movingEnd) ? ' moving forwards' : '';
        let litState = lit && !(type === "END" || type === "START");
        let visitState = visited && !(type === "END" || type === "START") && distance <= endStartDistance;

        let delay = startDist;
        let litAnimation = litState ? `.1s light-up linear ${delay * .1 + visitDelay * endStartDistance}s forwards running, ` : '';
        let visitAnimation = visitState ? `1.5s visited linear ${delay * visitDelay}s` : '';
        // keep this as ${endStartDistance * delay * visitDelay} for some cool effects

        return (
            <div className={type + ' tile-container ' + movingState + x + ' ' + y}
                style={{
                    animation: litAnimation + visitAnimation,
                    animationDelay: delay
                }}
                onClick={_ => updateSpecial(x, y, type)}
                // onMouseDown={_ => updateArenaTile(x, y, type)} />
                onMouseOver={_ => updateArenaTile(x, y, type)} />
        );
    }
}

Tile.propTypes = {};

export default Tile;


