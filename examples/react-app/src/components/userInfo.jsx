import {useFbClient, useFlags, withFbConsumer} from '@featbit/react-client-sdk';
import {useEffect, useState} from "react";
import {useFeatureFlag} from "../useFeatureFlag.ts";


const UserInfo = props => {
    const { robot } = useFlags();
    const asdf = useFeatureFlag('asdf', false);
    const fbClient = useFbClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const switchUser = async () => {
        setIsLoggedIn(true);
        // console.log(robot);
        // fbClient
        //     .identify({
        //         name: 'the second user',
        //         keyId: 'fb-demo-user-second',
        //         customizedProperties: [],
        //     });
        //
        // console.log(`identify end`);
        // const nasdf = fbClient.variation("asdf");
        // console.log('asdf:', asdf);
        // console.log('type:', typeof asdf);
    }

    useEffect(() => {
        if (!fbClient || !isLoggedIn) {
            return
        }

        fbClient.identify({
            name: 'the second user',
            keyId: 'fb-demo-user-second',
            customizedProperties: [{ name: 'platform', value: 'web' }],
        }).then();
    }, [isLoggedIn]);

    useEffect(() => {
        console.log('asdf:', asdf);
        console.log('type:', typeof asdf);
    }, [asdf])

    return (
        <div>
            <h2>User Information</h2>
            <button onClick={switchUser}>Switch User</button>
            <div>1: {robot}</div>
            <div>asdf: {asdf.toString()}</div>
            <div>type: {typeof asdf}</div>
            <div>
                Player： {props.playerName}
            </div>
        </div>
    );
};


export default UserInfo;