import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage"; // Import HomePage
import MeetingsPage from "./MeetingsPage"; // Import MeetingsPage
import ProfilePage from "./ProfilePage"; // Import ProfilePage
import "../Styles/Dashboard.css"; // Create a new CSS file for dashboard styling

const Dashboard = () => {
    return (
        <div className="dashboard">
            {/* Dashboard Header & Navigation */}
           <header className="header">
                           <h1 className="brand-name">TalkSphere</h1>
                           <nav className="navbar">
                               <ul className="nav-list">
                                   <li className="nav-item"><Link to="/">Home</Link></li>
                                   <li className="nav-item"><Link to="/dashboard/meetings">Meetings</Link></li>
                                   <li className="nav-item"><Link to="/dashboard/profile">Profile</Link></li>
                               </ul>
                           </nav>
                       </header>

            {/* Content Area (Routes for HomePage, MeetingsPage, ProfilePage) */}
            <main className="dashboard-content">
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
