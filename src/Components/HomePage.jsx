import React from 'react'
import { useState ,useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/HomePage.css';
const HomePage = () => {
    const [roomID, setRoomID] = useState("");
    const navigate = useNavigate()
    const handleRoomIDChange = (e) => {
        setRoomID(e.target.value); 
    };

    const handleJoin = useCallback(()=>{
        navigate(`/room/${roomID}`)
    },[navigate,roomID])

    return (
        <div className="home-page">
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
        </div>
    );
};


export default HomePage
