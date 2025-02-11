import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import MeetingsPage from "./MeetingsPage";
import ProfilePage from "./ProfilePage";
import { useEffect } from "react";
import "../Styles/Dashboard.css";
import { useDispatch } from 'react-redux';
import { fetchMeetings } from '../Redux/meetingsSlice.js';
import { fetchUserProfile } from "../Redux/userSlice.js";

const Dashboard = () => {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMeetings());
     dispatch(fetchUserProfile());
  }, [dispatch]);
  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="brand-name">TalkSphere</h1>
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/dashboard">Home</Link></li>
            <li className="nav-item"><Link to="/dashboard/meetings">Meetings</Link></li>
            <li className="nav-item"><Link to="/dashboard/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-content">
        {/* Nested Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
