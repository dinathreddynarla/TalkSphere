import React from 'react'
import { Form, Input, Button, Typography, Row, Col, Card, message, Spin } from "antd";
import {  UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { signupWithEmailPassword } from "../../services/authService";

const { Title, Text } = Typography;

const Signup = ({setIsLoginForm}) => {

     const changeIsLogin = () => setIsLoginForm((prev) => !prev);

        const handleSignup = async (values) => {
         
            try {
                await signupWithEmailPassword(values.fullName, values.email, values.password);
                message.success("Signup successful! Please log in.");
                setIsLoginForm(true);
            } catch (error) {
                if(error.message == "Firebase: Error (auth/email-already-in-use)."){
                    message.error("email already in use")
                    return;
                }
                
                message.error("Signup failed! Please check your details.");
            }
        };
  return (
    <Form onFinish={handleSignup} layout="vertical">
    <Title level={3}>Sign Up</Title>

    <Form.Item
        name="fullName"
        rules={[
            { required: true, message: "Please enter your full name" },
            { min: 3, message: "Name must be at least 3 characters" }
        ]}
    >
        <Input prefix={<UserOutlined />} placeholder="Full Name" />
    </Form.Item>

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
            { min: 6, message: "Password must be at least 6 characters" },
            { pattern: /^(?=.*[A-Z])(?=.*\d).*$/, message: "Password must contain at least 1 uppercase letter and 1 number" }
        ]}
    >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
    </Form.Item>

    <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                }
            })
        ]}
    >
        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
    </Form.Item>

    <Button type="primary" block htmlType="submit" className="submit-button">
        Sign Up
    </Button>

    <div style={{ display: "flex", justifyContent: "center" }}>
        <Text style={{ fontSize: "16px" }}>
            Already have an account?
            <Button type="link" onClick={changeIsLogin} style={{ fontSize: "16px" }}>
                Login
            </Button>
        </Text>
    </div>
</Form>
  )
}

export default Signup
