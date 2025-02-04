import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { getUser } from "../services/userService";
import "../styles/ProfilePage.css";
import { FaEdit } from "react-icons/fa";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const session = JSON.parse(localStorage.getItem("session"));
                if (!session || !session.token) {
                    navigate("/login");
                    return;
                }
                const response = await getUser(session.token);
                setUser(response);
                setUpdatedUser(response);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("session");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    const handleEdit = (field) => {
        setEditMode({ ...editMode, [field]: !editMode[field] });
    };

    const handleChange = (e, field) => {
        setUpdatedUser({ ...updatedUser, [field]: e.target.value });
    };

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <h2>{user.name}</h2>
                <div className="profile-details">
                    {[
                        { label: "Username", key: "username" },
                        { label: "Phone", key: "phone" },
                        { label: "Date of Birth", key: "dob" },
                        { label: "Gender", key: "gender" },
                        { label: "LinkedIn", key: "linkedin" },
                        { label: "GitHub", key: "github" },
                    ].map(({ label, key }) => (
                        <div className="profile-field" key={key}>
                            <span>{label}:</span>
                            {editMode[key] ? (
                                <input
                                    type="text"
                                    value={updatedUser[key] || ""}
                                    onChange={(e) => handleChange(e, key)}
                                    onBlur={() => handleEdit(key)}
                                    autoFocus
                                />
                            ) : (
                                <span>{user[key] || "Not set"}</span>
                            )}
                            <FaEdit className="edit-icon" onClick={() => handleEdit(key)} />
                        </div>
                    ))}
                </div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
                <div className="profile-actions">
                    <button className="password-change-btn">Change Password</button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
