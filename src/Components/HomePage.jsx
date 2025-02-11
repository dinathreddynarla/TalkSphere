import React from 'react'
import axios from 'axios';
import { useState ,useCallback ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/HomePage.css';
import Cookies from "js-cookie";
import { getFreshToken } from '../services/authService';
import { duration } from '@mui/material';
const HomePage = () => {
    const [roomID, setRoomID] = useState("");
    const [meetingData, setMeetingData] = useState({
        title: 'Instant Meet',
        description: 'Instant Meet',
        date: new Date(),
        duration:"100"
      });
      const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleRoomIDChange = (e) => {
        setRoomID(e.target.value); 
    };
    const cookie = Cookies.get("session")
    const session = cookie ? JSON.parse(cookie) : null ;
    if (!session) {
        navigate("/");
        return;
    }
    const handleJoin = useCallback(()=>{
        navigate(`/room/${roomID}`)
    },[navigate,roomID])

    const handleInstantMeet = async () => {
        setLoading(true);  
        console.log(meetingData);
        
        try {
          const token = await getFreshToken();
          const response = await axios.post(
            'https://talksphere-nyay.onrender.com/meetings',
            meetingData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
    
          const meetingId = response.data._id;
          navigate(`/room/${meetingId}`);
    
        } catch (error) {
          console.error("Error creating instant meeting", error);
        } finally {
          setLoading(false);
        }
      };
    useEffect(() => {
        const isReload = sessionStorage.getItem("isReload");
        if (isReload) {
          navigate("/dashboard");
          sessionStorage.removeItem("isReload");
        }
      }, [navigate]);
      
      // Set reload flag on page reload
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("isReload", "true");
      });
      
      
    return (
        <div className="home-page">
                <div className="home-content">
                    <div className="buttons">
                        {/* Meeting ID input and Join button */}
                        <button onClick={handleInstantMeet} disabled={loading}>
        {loading ? 'Creating Meeting...' : 'Start Instant Meet'}
      </button>
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
