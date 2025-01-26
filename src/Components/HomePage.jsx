import React, { useState } from 'react';
import ZegoMeeting from './ZegoMeeting'; // Import the ZegoMeeting component
import '../Styles/HomePage.css'; // Add a CSS file for HomePage styling

const HomePage = () => {
    const [roomID, setRoomID] = useState(""); // State to store the room ID
    const [isJoined, setIsJoined] = useState(false); // State to check if meeting is joined

    const handleRoomIDChange = (e) => {
        setRoomID(e.target.value); // Update the room ID when the user types
    };

    const handleJoin = () => {
        if (roomID) {
            setIsJoined(true); // Set the state to true to show the meeting
        }
    };

    return (
        <div className="home-page">
            {!isJoined ? (
                <div className="home-content">
                    <div className="buttons">
                        {/* Meeting ID input and Join button */}
                        <input
                            type="text"
                            placeholder="Enter Meeting ID"
                            value={roomID}
                            onChange={handleRoomIDChange}
                            className="meeting-id-input"
                        />
                        <button className="join-button" onClick={handleJoin}>
                            Join Meeting
                        </button>
                    </div>
                    <div className="right-side">
                        <video width="500" controls>
                            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ) : (
                // Once the meeting is joined, display the Zego meeting
                <ZegoMeeting roomID={roomID} />
            )}
        </div>
    );
};

export default HomePage;
