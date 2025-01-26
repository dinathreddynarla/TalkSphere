import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { logout } from "../services/authService"; // Import the logout function

const ProfilePage = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleLogout = async () => {
        try {
            await logout(); // Log out the user
            navigate("/"); // Redirect to the login page after logout
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <div className="profile-page">
            <h2>Profile Page</h2>
            <p>Welcome to your profile!</p>
            <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
    );
};

export default ProfilePage;
