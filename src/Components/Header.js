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
                            </div> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;