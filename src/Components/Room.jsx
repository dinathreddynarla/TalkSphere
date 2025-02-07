import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constants';
import { getUser } from "../services/userService";
import axios from "axios";
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

const Room = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [meeting, setMeeting] = useState(null);
  let zpInstance = null;

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
         const cookie = Cookies.get("session")
         const session = cookie ? JSON.parse(cookie) : null ;
        // const session = JSON.parse(localStorage.getItem("session"));
        if (!session || !session.token) {
          localStorage.setItem("roomID" ,roomID)      
          navigate("/");
          return;
        }
        localStorage.removeItem("roomID")
        setToken(session.token);
        const response = await getUser(session.token);
        setUser(response);
        console.log(response);
      } catch (error) { 
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `https://talksphere-nyay.onrender.com/api/meetings/${roomID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setMeeting(response.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeeting();
  }, [roomID, token]);

  // Join room using ZEGOCLOUD
  useEffect(() => {
    const myMeeting = async () => {
      if (!user || !meeting) return;
      let isHost = user.uid==meeting.host ? true : false ;
      try {
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          user.uid??Date.now().toString(),
          user.name??"Guest"
        );

        zpInstance = ZegoUIKitPrebuilt.create(kitToken);
        zpInstance.joinRoom({
          container: document.querySelector('.myCallContainer'),
          sharedLinks: [
            {
              name: 'Personal link',
              url:
                window.location.protocol +
                '//' +
                window.location.host +
                window.location.pathname +
                '?roomID=' +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          showTurnOffRemoteCameraButton:isHost,
	        showTurnOffRemoteMicrophoneButton:isHost,
          showRemoveUserButton:isHost,
          videoScreenConfig:"fill"
          
        });
      } catch (error) {
        console.error("Error starting the meeting:", error);
      }
    };
    myMeeting();
  }, [user, meeting, roomID]);

  return (
    <div
      className="myCallContainer"
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Room;
