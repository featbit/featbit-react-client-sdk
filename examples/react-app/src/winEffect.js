
const WinBoard = props => {
    return (
        <div>
            {
                props.playerName ?
                    <h1>WINNER IS: {props.playerName}</h1> :
                    <h1>No Winner Yet</h1>
            }

        </div>
    );
};


export default WinBoard;