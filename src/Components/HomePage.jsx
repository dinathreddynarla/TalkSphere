import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Row, Col, Spin, Space } from 'antd';
import { VideoCameraOutlined, EnterOutlined } from '@ant-design/icons'; // Ant Design Icons
import Cookies from "js-cookie";
import { getFreshToken } from '../services/authService';
import '../Styles/HomePage.css';

const HomePage = () => {
  const [roomID, setRoomID] = useState("");
  const [meetingData, setMeetingData] = useState({
    title: 'Instant Meet',
    description: 'Instant Meet',
    date: new Date()
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };

  const cookie = Cookies.get("session");
  const session = cookie ? JSON.parse(cookie) : null;
  if (!session) {
    navigate("/");
    return;
  }

  const handleJoin = useCallback(() => {
    navigate(`/room/${roomID}`);
  }, [navigate, roomID]);

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
        <Row gutter={16} align="middle" justify="center" style={{ minHeight: '100vh' }}>
          {/* Left side - Buttons */}
          <Col xs={24} sm={16} md={12} lg={8}>
            <div className="buttons" style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                onClick={handleInstantMeet}
                loading={loading}
                icon={<VideoCameraOutlined />}
                style={{
                  marginBottom: '20px',
                  width: 'auto', // Reduced width
                  backgroundColor: '#2D6A4F',
                  borderColor: '#2D6A4F',
                  color: 'white',
                  padding: '10px 20px',
                }}
              >
                {loading ? 'Creating Meeting...' : 'Start Instant Meet'}
              </Button>

              <Input
                placeholder="Enter Meeting ID"
                value={roomID}
                onChange={handleRoomIDChange}
                className="meeting-id-input"
                style={{
                  marginBottom: '20px',
                  width: '50%',
                  maxWidth: '400px', // Limit the width of the input
                  borderColor: '#2D6A4F',
                  padding: '8px 15px',
                  margin: '0 auto'
                }}
              />

              <Button
                type="default"
                onClick={handleJoin}
                icon={<EnterOutlined />}
                style={{
                  width: 'auto', // Reduced width
                  backgroundColor: '#E9F5F2',
                  color: '#2D6A4F',
                  borderColor: '#2D6A4F',
                  padding: '10px 20px',
                  marginTop: '10px',
                }}
              >
                Join Meeting
              </Button>
            </div>
          </Col>

          {/* Right side - Video */}
          <Col xs={24} sm={16} md={12} lg={8}>
            <div className="right-side" style={{ textAlign: 'center', marginTop: '20px' }}>
              <video width="100%" controls>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
