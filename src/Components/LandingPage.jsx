import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Typography, Row, Col, Card, message, Spin } from "antd";
import { GoogleOutlined, UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { loginWithEmailPassword, signupWithEmailPassword, loginWithGoogle, guestLogin, passwordReset } from "../services/authService";
import "../Styles/LandingPage.css";
import Logo from "../assets/logo.png";
import Cookies from "js-cookie";

const { Title, Text } = Typography;

const LandingPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [roomID, setRoomID] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cookie = Cookies.get("session");
        const session = cookie ? JSON.parse(cookie) : null;
        const roomSession = localStorage.getItem("roomID");

        if (roomSession) setRoomID(roomSession);
        if (session) navigate("/dashboard");
    }, [navigate]);

    const changeIsLogin = () => setIsLoginForm((prev) => !prev);

    const handleNavigation = (path) => {
        setLoading(true);
        setTimeout(() => {
            navigate(path);
            setLoading(false);
        }, 2000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginWithEmailPassword(email, password);
            message.success("Login successful! Redirecting...");
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Login failed! Please check your credentials.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            message.warning("Passwords do not match!");
            return;
        }
        try {
            await signupWithEmailPassword(name, email, password);
            message.success("Signup successful! Please log in.");
            setIsLoginForm(true);
        } catch {
            message.error("Signup failed! Please check your details.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            message.success("Google login successful! Redirecting...");
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Google login failed!");
        }
    };

    const handleGuestLogin = async () => {
        try {
            await guestLogin();
            message.success("Logged in as Guest! Redirecting...");
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Guest login failed!");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await passwordReset(email);
            message.success(`Password reset email sent to ${email}`);
        } catch (err) {
            message.error(err.message || "Failed to send password reset email.");
        }
    };

    return (
        <div className="landing-container">
            <Title level={1} className="title">TalkSphere</Title>

            <Row className="content-container" justify="center" align="middle">
                <Col xs={24} sm={12} md={10} className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                </Col>

                <Col xs={24} sm={12} md={10} className="form-container">
                    <Card className="auth-card">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <Spin size="large" />
                                <Text type="secondary">Redirecting, please wait...</Text>
                            </div>
                        ) : isLoginForm ? (
                            <>
                                <Title level={3}>Login</Title>
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                />
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                />
                                <Button type="primary" block onClick={handleLogin} className="submit-button">
                                    Login
                                </Button>
                                <Button icon={<GoogleOutlined />} block onClick={handleGoogleLogin} className="google-button">
                                    Continue with Google
                                </Button>
                                <Button type="link" block onClick={handleForgotPassword}>
                                    Forgot Password?
                                </Button>
                                <Button type="dashed" block onClick={handleGuestLogin}>
                                    Continue as Guest
                                </Button>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Text>
                                        Don't have an account?
                                        <Button type="link" onClick={changeIsLogin}>
                                            Sign Up
                                        </Button>
                                    </Text>
                                </div>
                            </>
                        ) : (
                            <>
                                <Title level={3}>Sign Up</Title>
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                />
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                />
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                />
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                />
                                <Button type="primary" block onClick={handleSignup} className="submit-button">
                                    Sign Up
                                </Button>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Text>
                                        Already have an account?{" "}
                                        <Button type="link" onClick={changeIsLogin} className="btn">
                                            Login
                                        </Button>
                                    </Text>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default LandingPage;
