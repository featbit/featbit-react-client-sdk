import { useFlags } from '@featbit/react-client-sdk';

const UserInfo = props => {
    const { robot } = useFlags();

    return (
        <div>
            <h2>User Information</h2>
            <div>1: {robot}</div>
            <div>
                Player： {props.playerName}
            </div>
        </div>
    );
};


export default UserInfo;