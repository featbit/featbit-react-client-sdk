import { withFbConsumer } from '@featbit/react-client-sdk';

function Square(props) {
    const { flags, fbClient } = props;
    
    return (
      <button style={{backgroundColor: props.backgroundColor}} className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  export default withFbConsumer()(Square);