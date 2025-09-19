import {useFbClient, useFlags} from '@featbit/react-client-sdk';
import {useEffect} from "react";

const UserInfo = props => {
    const { robot } = useFlags();
    const fbClient = useFbClient();

    const switchUser = async () => {
        console.log(robot);
        await fbClient
            .identify({
                name: 'the second user',
                keyId: 'fb-demo-user-second',
                customizedProperties: [],
            });

        console.log(`identify end`);
        console.log(fbClient.variation("robot"));
    }

    // useEffect(() => {
    //     console.log(robot);
    //     if (!fbClient) {
    //         return;
    //     }
    //     switchUser();
    // }, [fbClient, robot]);

    return (
        <div>
            <h2>User Information</h2>
            <button onClick={switchUser}>Switch User</button>
            <div>1: {robot}</div>
            <div>
                Player： {props.playerName}
            </div>
        </div>
    );
};


export default UserInfo;