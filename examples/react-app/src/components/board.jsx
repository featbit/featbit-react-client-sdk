import Square from './square.jsx';
import React from 'react';
import { withFbConsumer } from '@featbit/react-client-sdk';

class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    render() {
      const { flags, fbClient } = this.props;

      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }

  export default withFbConsumer()(Board)