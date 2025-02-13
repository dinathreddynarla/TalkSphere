import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constants';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../Redux/userSlice';
import "../Styles/Room.css"

const Room = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [meeting, setMeeting] = useState(null);
  const [meetingNotFound, setMeetingNotFound] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading
  const dispatch = useDispatch();
  let zpInstance = null;
  let user = useSelector((state) => state.user.user);

  const handleBackNavigation = () => {
    // Force the navigate to the dashboard page
    navigate('/dashboard'); // Replace with actual dashboard path
  };

  useEffect(() => {
    // Store the current location as the previous page to be used later
    sessionStorage.setItem('previousPage', location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    window.alert = () => {}; // Suppress all alerts
    return () => {
      window.alert = alert; // Restore original alert on unmount
    };
  }, []);
  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        await dispatch(fetchUserProfile());
      }
    };
    checkUser();
  }, [user, dispatch]);

  // Fetch user profile
  useEffect(() => {
    const cookie = Cookies.get('session');
    const session = cookie ? JSON.parse(cookie) : null;

    if (!session || !session.token) {
      localStorage.setItem('roomID', roomID);
      navigate('/');
      return;
    }
    localStorage.removeItem('roomID');
    setToken(session.token);
  }, [navigate, roomID]);

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `https://talksphere-nyay.onrender.com/meetings/${roomID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.data) {
          setMeetingNotFound(true); // Set fallback when no meeting found
        } else {
          setMeeting(response.data);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setMeetingNotFound(true); // Set fallback if there's an error
      }
      setLoading(false); // Stop loading once the meeting data is fetched
    };
    fetchMeeting();
  }, [roomID, token]);

  const joinMeet = async (email, id) => {
    try {
      const response = await axios.post(
        `https://talksphere-nyay.onrender.com/meetings/joinmeet/${id}`,
        { email: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  // Join room using ZEGOCLOUD
  useEffect(() => {
    const myMeeting = async () => {
      if (!user || !meeting) return;
      let isHost = user.uid == meeting.host ? true : false;

      if (!isHost) {
        let userEmail = user.email ?? 'anonymususer@gmail.com';
        let meetID = roomID;
        await joinMeet(userEmail, meetID)
      }
      try {
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          user.uid ?? Date.now().toString(),
          user.name ?? 'Guest'
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
          showTurnOffRemoteCameraButton: isHost,
          showTurnOffRemoteMicrophoneButton: isHost,
          showRemoveUserButton: isHost,
          videoScreenConfig: 'fill',
        });
      } catch (error) {
        console.error('Error starting the meeting:', error);
      }
    };
    myMeeting();
  }, [user, meeting, roomID]);

  if (meetingNotFound) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#E9F5F2',
          color: '#2D6A4F',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Meeting Not Found</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            Oops! The meeting you're trying to join doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              fontSize: '1.2rem',
              backgroundColor: '#2D6A4F',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#E9F5F2',
        }}
      >
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div
      className="myCallContainer"
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Room;
