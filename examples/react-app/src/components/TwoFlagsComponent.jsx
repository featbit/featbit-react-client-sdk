import React, { useEffect, useRef } from 'react';
import {useFbClient, useFlags, UserBuilder} from '@featbit/react-client-sdk';

export default function TwoFlagsComponent() {
    const flags = useFlags();
    const flagA = flags["flag-a"];
    const flagB = flags["flag-b"];
    const fbClient = useFbClient();


    useEffect(() => {
        if (!flagA || !fbClient) return;
        const variationId = `203:${flagA}:exclusive`;
        const user = new UserBuilder("fb-demo-user-key")
            .name("the user name")
            .custom("loggedIn", "true")
            .custom("variationId", variationId)
            .build();

        console.log('flagA changed')
        fbClient?.identify(user).then((result) => console.log('identify finished'));
    }, [fbClient, flagA]);

    return (
        <div
            style={{
                marginTop: 32,
                paddingLeft: 24,
                paddingRight: 24,
            }}>
            <div
                style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: '700',
                }}>
                flagA: {flagA}
            </div>
            <div
                style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: '700',
                }}>
                flagB: {flagB}
            </div>
        </div>
    );
}
