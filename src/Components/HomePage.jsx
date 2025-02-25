import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Input, Row, Col } from 'antd';
import { VideoCameraOutlined, EnterOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import { getFreshToken } from '../services/authService';
import '../Styles/HomePage.css';
import { baseUrl } from '../App';
import Carousal from './Carousal';

const HomePage = () => {
  const [roomID, setRoomID] = useState("");
  const [meetingData, setMeetingData] = useState({
    title: 'Instant Meet',
    description: `Instant Meet - ${new Date().toISOString().slice(0,5)}`,
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
    try {
      const token = await getFreshToken();
      const response = await axios.post(
        `${baseUrl}/meetings`,
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

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("isReload", "true");
  });

  return (
    <div className="home-page">
      <div className="home-content">
        <Row gutter={16} align="middle" justify="center" className='homerow'>
        <Col xs={24} sm={16} md={12} lg={8}  className='instant'>
      <Card
        className="instantMeet-card"
        title={window.innerWidth > 576 ? "Video Calls and Meetings for Everyone" : ""}
        styles={{
          header: {
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
          },
        }}
      >
        
       { window.innerWidth < 576 && (<p className="card-text">Connecting Conversations, Anytime</p>) }
      
        

        <Button
          type="primary"
          onClick={handleInstantMeet}
          loading={loading}
          icon={<VideoCameraOutlined />}
          className="primary-button"
        >
          {loading ? "Creating Meeting..." : "Start Instant Meet"}
        </Button>

        <Input
          placeholder="Enter Meeting ID"
          value={roomID}
          onChange={handleRoomIDChange}
          className="meeting-id-input"
        />

        <Button
          type="default"
          onClick={handleJoin}
          icon={<EnterOutlined />}
          className="join-button"
        >
          Join Meeting
        </Button>
      </Card>
    </Col>
          <Col xs={24} sm={16} md={12} lg={10}>
            <div className="right-side" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Carousal />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
