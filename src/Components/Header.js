import React from 'react';
import '../css/Header.css';

class Header extends React.Component {
    render() {

        let { beginAlgorithm, resetAlgorithm, startedAlgorithm } = this.props;

        return(
            <div className="header-container">
                <div className="btn-begin-algorithm" onClick={_ => !startedAlgorithm ? beginAlgorithm() : resetAlgorithm() }>
                    {!startedAlgorithm ? 'Begin Algorithm' : 'Reset Algorithm'}
                </div>
            </div>
        )
    }
}

export default Header;