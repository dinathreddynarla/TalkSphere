import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Input, Row, Col } from 'antd';
import { VideoCameraOutlined, EnterOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import { getFreshToken } from '../services/authService';
import '../Styles/HomePage.css';
import { baseUrl } from '../App';

const HomePage = () => {
  const [roomID, setRoomID] = useState("");
  const [meetingData, setMeetingData] = useState({
    title: 'Instant Meet',
    description: `Instant Meet - ${new Date().toISOString()}`,
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
        <Row gutter={16} align="middle" justify="center" style={{ minHeight: '100vh' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card
              title="Video Calls and Meetings for Everyone"
              bordered={false}
              style={{
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "20px",
                margin:"0px"
              }}
            >
              <p style={{ marginBottom: "20px", fontSize: "16px", fontWeight: "bold" }}>
                Connecting Conversations, Anytime
              </p>

              <Button
                type="primary"
                onClick={handleInstantMeet}
                loading={loading}
                icon={<VideoCameraOutlined />}
                style={{
                  marginBottom: "20px",
                  width: "auto",
                  backgroundColor: "#2D6A4F",
                  borderColor: "#2D6A4F",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                {loading ? "Creating Meeting..." : "Start Instant Meet"}
              </Button>

              <Input
                placeholder="Enter Meeting ID"
                value={roomID}
                onChange={handleRoomIDChange}
                className="meeting-id-input"
                style={{
                  marginBottom: "20px",
                  width: "50%",
                  maxWidth: "400px",
                  borderColor: "#2D6A4F",
                  padding: "8px 15px",
                  margin: "0 auto",
                }}
              />

              <Button
                type="default"
                onClick={handleJoin}
                icon={<EnterOutlined />}
                style={{
                  width: "auto",
                  backgroundColor: "#E9F5F2",
                  color: "#2D6A4F",
                  borderColor: "#2D6A4F",
                  padding: "10px 20px",
                  marginTop: "10px",
                }}
              >
                Join Meeting
              </Button>
            </Card>
          </Col>

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
