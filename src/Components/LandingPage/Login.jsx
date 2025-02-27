import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { loginWithEmailPassword, loginWithGoogle, guestLogin, passwordReset } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = ({ setIsLoginForm, roomID, setLoading }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loadingState, setLoadingState] = useState({}); // Stores loading state for each button

    const setButtonLoading = (key, state) => {
        setLoadingState((prev) => ({ ...prev, [key]: state }));
    };
    //console.log(loadingState);

    const handleLogin = async (values) => {
        setButtonLoading("login", true);
        try {
            await loginWithEmailPassword(values.email, values.password);
            message.success("Login successful! Redirecting...");
            form.resetFields(); // Clear fields after successful login
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Login failed! Please check your credentials.");
        }
        setButtonLoading("login", false);
    };

    const handleGoogleLogin = async () => {
        setButtonLoading("google", true);
        try {
            await loginWithGoogle();
            message.success("Google login successful! Redirecting...");
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Google login failed!");
        }
        setButtonLoading("google", false);
    };

    const handleGuestLogin = async () => {
        setButtonLoading("guestlogin", true);
        try {
            await loginWithEmailPassword("anonymous@gmail.com", "Guest@1234");
            message.success("Logged in as Guest! Redirecting...");
            handleNavigation(roomID ? `/room/${roomID}` : "/dashboard");
        } catch {
            message.error("Guest login failed!");
        }
        setButtonLoading("guestlogin", false);

    };

    const handleForgotPassword = async () => {
        setButtonLoading("forgotpassword", true);
        const email = form.getFieldValue("email");
        if (!email) {
            message.error("Please enter your email");
            return;
        }
        try {
            await passwordReset(email);
            message.success(`Password reset email sent to ${email}`);
            form.resetFields(); // Clear email field after successful password reset
        } catch (err) {
            message.error(err.message || "Failed to send password reset email.");
        }
        setButtonLoading("forgotpassword",false);

    };

    const handleNavigation = (path) => {
        setLoading(true);
        setTimeout(() => {
            navigate(path);
            setLoading(false);
        }, 2000);
    };

    return (
        <Form onFinish={isForgotPassword ? handleForgotPassword : handleLogin} layout="vertical" form={form}>
            {isForgotPassword ? (
                <>
                    <Title level={3} style={{ marginBottom: "15px" }}>Forgot Password</Title>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Button type="primary" block htmlType="submit" className="reset-button" loading={loadingState["forgotPassword"]}>
                        Reset Password
                    </Button>

                    <Button
                        type="link"
                        block
                        onClick={() => {
                            form.resetFields(); // Clear fields when switching back to login
                            setIsForgotPassword(false);
                        }}
                        style={{ fontSize: "16px" }}
                    >
                        Back to Login
                    </Button>
                </>
            ) : (
                <>
                    <Title level={3} style={{ marginBottom: "15px" }}>Login</Title>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item> 
                    <Button type="primary" block htmlType="submit" className="submit-button" loading={loadingState["login"]}>
                            Login
                        </Button>

                        <Button icon={<GoogleOutlined />} block onClick={handleGoogleLogin} className="google-button" loading={loadingState["google"]}>
                            Continue with Google
                        </Button>
                        <Button type="dashed" block onClick={handleGuestLogin} style={{fontSize:"16px"}} loading={loadingState["guestlogin"]}>
                                                        Continue as Guest
                        </Button>
                    <Button
                        type="link"
                        block
                        onClick={() => {
                            form.resetFields(); // Clear fields when switching to forgot password
                            setIsForgotPassword(true);
                        }}
                        style={{ fontSize: "16px" }}
                    >
                        Forgot Password?
                    </Button>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Text style={{ fontSize: "16px" }}>
                            Don't have an account?
                            <Button type="link" onClick={() => setIsLoginForm((prev) => !prev)} style={{ fontSize: "16px" }}>
                                Sign Up
                            </Button>
                        </Text>
                    </div>
                </>
            )}
        </Form>
    );
};

export default Login;
