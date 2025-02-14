import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  Typography, Row, Col, Card, Spin } from "antd";
import { useMediaQuery } from "react-responsive";
import "../../Styles/LandingPage.css";
import LogoDesktop from "../../assets/logo-Desktop.png";
import LogoMobile from "../../assets/logo-Mobile.png";
import Cookies from "js-cookie";
import Login from "./Login";
import Signup from "./Signup";

const { Text } = Typography;

const LandingPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [roomID, setRoomID] = useState(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const cookie = Cookies.get("session");
        const session = cookie ? JSON.parse(cookie) : null;
        const roomSession = localStorage.getItem("roomID");

        if (roomSession) setRoomID(roomSession);
        if (session) navigate("/dashboard");
    }, [navigate]);

    return (
        <div className="landing-container">
            <Row className="content-container" justify="center" align="middle">
                <Col xs={24} sm={12} md={10} className="logo-container">
                    <img src={isMobile ? LogoMobile : LogoDesktop} alt="Logo" className="logo" />
                </Col>

                <Col xs={24} sm={12} md={10} className="form-container">
                    <Card className="auth-card">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <Spin size="large" />
                                <Text type="secondary">Redirecting, please wait...</Text>
                            </div>
                        ) : isLoginForm ? (
                            <Login setIsLoginForm={setIsLoginForm} roomID={roomID} setLoading={setLoading}/>
                        ) : (
                           <Signup setIsLoginForm={setIsLoginForm}/>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default LandingPage;
