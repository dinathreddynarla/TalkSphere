import React, { useEffect, useRef ,useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Typography, Spin, Modal, message } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { HomeOutlined, VideoCameraOutlined, UserOutlined } from "@ant-design/icons";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import HomePage from "./HomePage";
import MeetingsPage from "./MeetingsPage";
import ProfilePage from "./ProfilePage";
import NotFound from "./NotFound.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../Redux/meetingsSlice.js";
import { fetchUserProfile } from "../Redux/userSlice.js";
import { logoutUser } from "../Redux/userSlice.js";
import "../Styles/Dashboard.css";
import logo from '../assets/favicon2.png';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  

  // Ref to track whether the toast has been shown
  const hasShownToast = useRef(false);

  // Reload dashboard when navigating back from the meeting page
  useEffect(() => {
    // Check if the user has come from the /room/:roomID page
    const previousPage = sessionStorage.getItem('previousPage');

    if (previousPage && previousPage.startsWith('/room/')) {
      window.location.reload(); // Fetch the latest data
      sessionStorage.removeItem('previousPage'); // Clear the stored route after reloading
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768); // Collapse when screen is ≤ 768px
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchMeetings());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    // Check if the current route doesn't match any valid routes
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/meetings" || location.pathname === "/dashboard/profile") {
      // Only show the toast if we're on valid routes (not 404)
      if (status === "succeeded" && user && !hasShownToast.current) {
        message.success(`Welcome, ${user.name || "Guest"}!`);
        hasShownToast.current = true; // Prevent duplicate toasts
      } else if (status === "failed" && !hasShownToast.current) {
        message.error("Failed to load user profile. Please try again.");
        hasShownToast.current = true;
      }
    }
  }, [status, user, location.pathname]);

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
    { label: <Link to="/dashboard">Home</Link>, key: "1", icon: <HomeOutlined /> },
    { label: <Link to="/dashboard/meetings">Meetings</Link>, key: "2", icon: <VideoCameraOutlined /> },
    { label: <Link to="/dashboard/profile">Profile</Link>, key: "3", icon: <UserOutlined /> },
  ];

  return (
    <Layout className="dashboard">
      {/* Header */}
      <Header style={{ backgroundColor: "#2D6A4F",width:"100%" , padding: "0 20px", display: "flex", alignItems: "center" ,justifyContent: "space-between" , height:"10%" }}>
          {/* Logo and Brand Name */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="TalkSphere Logo"
              style={{ width: 40, height: 40, marginRight: 15 , alignSelf:'center'   }}
            />
            <Title level={3} style={{ color: "#fff", margin: 0, textAlign: "center",marginRight: 9 }}>TalkSphere</Title>
           {window.innerWidth > 768 && ( 
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ color: "#fff", fontSize: 22 }} /> 
                              : <MenuFoldOutlined style={{ color: "#fff", fontSize: 22 }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginLeft: 8 }}
            /> )}
          </div>

          {/* Logout Button */}
          <Button
      type="link"
      onClick={handleLogout}
      className="logout-btn"
      style={{ 
        color: "#fff", 
        fontSize: "16px", 
        fontWeight: "bold", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <ExportOutlined style={{ fontSize: "20px" }} /> : <LogoutOutlined style={{ fontSize: "20px" }} />}
      {window.innerWidth > 768 ? "Logout" : ""}
    </Button>
      </Header>

      <Layout style={{ flexDirection: "row" , height:"90%" , overflow:"hidden", width:"100%" }}>
        {/* Sidebar */}
        <Sider
            width={"10%"}
            collapsible
            collapsed={collapsed}
            collapsedWidth={window.innerWidth > 576 ? 50 :"12%"}
            trigger={null} 
            style={{
              boxSizing:"border-box",
              backgroundColor: "#E9F5F2",
              padding: "5px",
              height: "100%",
              transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
              overflow: "hidden", 
              boxShadow: collapsed ? "none" : "2px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
          // onMouseEnter={() => {
          //     if(window.innerWidth > 768){
          //         setCollapsed(false)
          //     }
          // }}
          // onMouseLeave={() => setCollapsed(true)}
        >
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }} items={menuItems} />
        </Sider>
    
        {/* Main Content with Loader */}
        <Layout style={{ padding: "10px", width: "90%" , height:"100%" , boxSizing:"border-box"}}>
          <Content
            style={{
             
              padding: 24,
              margin: 0,
              height: "100%",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
             
            }}
          >
            {status === "loading" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" , justifyContent:"center" , }}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
