import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateUserProfile } from "../Redux/userSlice";
import "../Styles/ProfilePage.css";
import { FaEdit, FaCheck } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { passwordReset } from "../services/authService";


const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
    
  const [editMode, setEditMode] = useState({});
  const [editedValues, setEditedValues] = useState({});
    const navigate = useNavigate()
   const cookie = Cookies.get("session")
      const session = cookie ? JSON.parse(cookie) : null ;
      if (!session) {
          navigate("/");
          return;
      }
    
      useEffect(() => {
        const isReload = sessionStorage.getItem("isReload");
        if (isReload) {
          navigate("/dashboard");
          sessionStorage.removeItem("isReload");
        }
      }, [navigate]);
      
      // Set reload flag on page reload
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("isReload", "true");
      });

  // Toggle edit mode for a specific field
  const handleEditToggle = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  // Handle value changes when editing
  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update request
  const handleUpdate = async (field) => {
    if (editedValues[field]) {
      dispatch(updateUserProfile({ [field]: editedValues[field] }));
      console.log(user);
      setEditMode((prev) => ({ ...prev, [field]: false }));
    }
  };

  //Handle Logout 
  const handleLogout =()=>{
    dispatch(logoutUser())
    navigate("/")
  }

  //Handle Password Reset
  const handleForgotPassword = async ()=>{
          try{
              await passwordReset(user.email)
              alert(`Password reset email sent to ${user.email}`)    
          }
          catch (err){
              alert(err.message)
              
          }
      }
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{user.name || "Guest User"}</h2>
        {status === "loading" && <p>Updating profile...</p>}
        {error && <p className="error">{error}</p>}

        <div className="profile-details">
        <>
        
        {[
             { label: "Username", key: "username" },
             { label: "Phone", key: "phone" },
             { label: "Date of Birth", key: "dob" },
             { label: "Gender", key: "gender" },
             { label: "LinkedIn", key: "linkedin" },
             { label: "GitHub", key: "github" },
          ].map(({ label, key }) => (
            <div className="profile-field" key={key}>
              <label>{label}:</label>
              {editMode[key] ? (
                <>
                  <input
                    type="text"
                    value={editedValues[key] ?? user[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  <FaCheck className="edit-icon" onClick={() => handleUpdate(key)} />
                </>
              ) : (
                <>
                  <span>{user[key] || "Not set"}</span>
                  <FaEdit className="edit-icon" onClick={() => handleEditToggle(key)} />
                </>
              )}
            </div>
        ))}

                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
                <div className="profile-actions">
                    <button className="password-change-btn" onClick={handleForgotPassword}>Change Password</button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
        </>
         
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
