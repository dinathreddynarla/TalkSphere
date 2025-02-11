import React, { useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Typography, Spin, Modal, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import HomePage from "./HomePage";
import MeetingsPage from "./MeetingsPage";
import ProfilePage from "./ProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../Redux/meetingsSlice.js";
import { fetchUserProfile } from "../Redux/userSlice.js";
import { logoutUser } from "../Redux/userSlice.js";
import "../Styles/Dashboard.css";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  
  // Ref to track whether the toast has been shown
  const hasShownToast = useRef(false);

  useEffect(() => {
    dispatch(fetchMeetings());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded" && user && !hasShownToast.current) {
      message.success(`Welcome, ${user.name || "Guest"}!`);
      hasShownToast.current = true; // Prevent duplicate toasts
    } else if (status === "failed" && !hasShownToast.current) {
      message.error("Failed to load user profile. Please try again.");
      hasShownToast.current = true;
    }
  }, [status, user]);

  // Handle Logout
  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(logoutUser());
        navigate("/");
      },
    });
  };

  // Define items for the Menu
  const menuItems = [
    { label: <Link to="/dashboard">Home</Link>, key: "1" },
    { label: <Link to="/dashboard/meetings">Meetings</Link>, key: "2" },
    { label: <Link to="/dashboard/profile">Profile</Link>, key: "3" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Header style={{ backgroundColor: "#2D6A4F", padding: "20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={3} style={{ color: "#fff", margin: 0, textAlign: "center" }}>TalkSphere</Title>
          {/* Logout Button */}
          <Button
            type="link"
            onClick={handleLogout}
            style={{ color: "#fff", fontSize: "16px" }}
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Layout style={{ flexDirection: "row" }}>
        {/* Sidebar */}
        <Sider
          width={200}
          style={{
            backgroundColor: "#E9F5F2",
            padding: "10px",
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: 1,
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }} items={menuItems} />
        </Sider>

        {/* Main Content with Loader */}
        <Layout style={{ padding: "10px", width: "80%" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: "#fff",
            }}
          >
            {status === "loading" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Spin size="large" />
                <p style={{ marginTop: 10, fontSize: "16px", fontWeight: "bold", color: "#2D6A4F" }}>
                  Loading user details...
                </p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="meetings" element={<MeetingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Routes>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
