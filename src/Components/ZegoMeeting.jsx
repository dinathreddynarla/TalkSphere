import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constants';

const ZegoMeeting = ({ roomID }) => {
    // This function handles starting the meeting with Zego
    React.useEffect(() => {
        if (roomID) {
            let myMeeting = async (element) => {
                const appID = APP_ID;
                const serverSecret = SERVER_SECRET;
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    roomID,
                    Date.now().toString(),
                    "User"
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zp.joinRoom({
                    container: element,
                    sharedLinks: [
                        {
                            name: 'Personal link',
                            url:
                                window.location.protocol + '//' +
                                window.location.host +
                                window.location.pathname +
                                '?roomID=' +
                                roomID,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.GroupCall, // Modify for 1-on-1 calls if needed
                    },
                });
            };

            // Assuming "meetingContainer" is a reference to a div that will contain the meeting UI
            const meetingContainer = document.getElementById("meetingContainer");
            if (meetingContainer) {
                myMeeting(meetingContainer);
            }
        }
    }, [roomID]);

    return <div id="meetingContainer" style={{ width: '100vw', height: '100vh' }}></div>;
};

export default ZegoMeeting;
