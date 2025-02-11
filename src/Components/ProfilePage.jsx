import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateUserProfile } from "../Redux/userSlice";
import "../Styles/ProfilePage.css";
import { FaEdit, FaCheck, FaLock } from "react-icons/fa";
import { Skeleton } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { passwordReset } from "../services/authService";

const ProfileField = ({ label, value, isEditing, onEdit, onSave, onChange }) => {
  return (
    <div className="profile-field">
      <label>{label}:</label>
      {isEditing ? (
        <>
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
          <FaCheck className="edit-icon" onClick={onSave} />
        </>
      ) : (
        <>
          <span>{value || <Skeleton.Input active size="small" />}</span>
          <FaEdit className="edit-icon" onClick={onEdit} />
        </>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  
  const [editMode, setEditMode] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const navigate = useNavigate();

  const cookie = Cookies.get("session");
  const session = cookie ? JSON.parse(cookie) : null;
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

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("isReload", "true");
  });

  const handleEditToggle = (field) => {
    setEditMode((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field) => {
    if (editedValues[field]) {
      dispatch(updateUserProfile({ [field]: editedValues[field] }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleForgotPassword = async () => {
    try {
      await passwordReset(user.email);
      alert(`Password reset email sent to ${user.email}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return <Skeleton active />;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{user.name || "Guest User"}</h2>
        {status === "loading" && <p>Updating profile...</p>}
        {error && <p className="error">{error}</p>}

        <div className="profile-details">
          {[
            { label: "Username", key: "username" },
            { label: "Phone", key: "phone" },
            { label: "Date of Birth", key: "dob" },
            { label: "Gender", key: "gender" },
            { label: "LinkedIn", key: "linkedin" },
            { label: "GitHub", key: "github" },
          ].map(({ label, key }) => (
            <ProfileField
              key={key}
              label={label}
              value={editedValues[key] ?? user[key] ?? ""}
              isEditing={editMode[key]}
              onEdit={() => handleEditToggle(key)}
              onSave={() => handleUpdate(key)}
              onChange={(value) => handleChange(key, value)}
            />
          ))}

          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}
          </p>

          <div className="profile-actions">
            <button className="password-change-btn" onClick={handleForgotPassword}>
              <FaLock /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
