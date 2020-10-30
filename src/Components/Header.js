import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import '../css/Header.css';

class Header extends React.Component {

    state = {
        dropDown: false
    }

    render() {
        let { beginAlgorithm, resetAlgorithm, startedAlgorithm, currentAlgorithm, updateAlgorithm } = this.props;
        let { dropDown } = this.state;
        let maze = currentAlgorithm == "ELLER" || currentAlgorithm == "DFSMAZE";

        return (
            <div className="header-container">
                <div className="btn-begin-algorithm" onClick={_ => !startedAlgorithm ? beginAlgorithm() : resetAlgorithm()}>
                    {!startedAlgorithm ? `Visualize ${currentAlgorithm}` : 'Reset'}
                </div>
                <div action="#" className="algorithm-form">
                    <div id="algorithms" name="cars" onClick={() => this.setState(st => ({ dropDown: !st.dropDown }))}>
                        {currentAlgorithm}
                        {this.state.dropDown ?
                            <div className="algorithm-opt-container">
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('DIJKSTRAS')} > Dijkstras </div>
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('ASTAR')} > AStar </div>
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('DFS')} > Depth First Search </div>
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('BFS')} > Breadth First Search Maze </div>
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('ELLER')} > Eller's Maze </div>
                                <div className="algorithm-opt" onClick={_ => updateAlgorithm('DFSMAZE')} > Depth First Search Maze </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;