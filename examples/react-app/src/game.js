import React from 'react';
import './index.css';
import Board from './board';
import WinBoard from './winEffect';
import UserInfo from './userInfo';
import { context, withFbProvider } from '@featbit/react-client-sdk';
import { configWithAnonymousUser, configWithUser, userName } from './config';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      userName: userName,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  robotAction(squares) {
    let handled = false;
    let firstNullCase = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null && Math.random() < 0.3) {
        this.handleClick(i);
        handled = true;
        break;
      }
    }
    if (handled === false) {
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null && Math.random() < 0.7) {
          this.handleClick(i);
          handled = true;
          break;
        }
      }
    }
    if (handled === false) {
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null && Math.random() < 2) {
          this.handleClick(i);
          handled = true;
          break;
        }
      }
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }, () => {
      if (this.state.xIsNext === false)
        setTimeout(() => {
          this.robotAction(squares);
        }, 500)
    });
  }

  static contextType = context;
  render() {
    const { flags, fbClient } = this.context;

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          {
              flags.用户信息模块 === 'v1.0.0' ?
              <div>
                <div style={{ marginTop: "10px" }}>
                  Player： {this.state.userName}
                </div>
              </div> :

              <UserInfo playerName={this.state.userName} />
          }
          {
            this.state.showWinEffect === 'true' ? <WinBoard playerName={winner} /> : null
          }

        </div>
        <div className="game-info">
          <div>Against：{flags.robot}</div>
          <div>{status}</div>
          <ol>{moves}</ol>
          <div></div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
 
// Uncomment the following line to use withFbProvider
export default withFbProvider(configWithAnonymousUser)(Game);

// Uncommennt the following line to use asyncWithFbProvider
// export default Game;
