import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../Redux/userSlice";
import { FaEdit, FaCheck, FaLock, FaUserAlt, FaPhone, FaBirthdayCake, FaGenderless, FaLinkedin, FaGithub } from "react-icons/fa";
import { Skeleton, Input, Button, message, Modal ,Select, DatePicker } from "antd";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Styles/ProfilePage.css";
import { passwordReset } from "../services/authService";

const defaultProfilePic = "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid"; 

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [editMode, setEditMode] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [profilePic, setProfilePic] = useState(user?.profilePic || defaultProfilePic);
  
  const nameRef = useRef(null);
  const genderRef = useRef(null);
  const dobRef = useRef(null);
  const phoneRef = useRef(null);
  const linkedinRef = useRef(null);
  const githubRef = useRef(null);

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
    setEditMode((prevState) => {
      const newEditState = { ...prevState, [field]: !prevState[field] };
      if (newEditState[field]) {
        // Auto-focus the input when entering edit mode, only if ref is available
        switch (field) {
          case "name":
            if (nameRef.current) nameRef.current.focus();
            break;
          case "gender":
            if (genderRef.current) genderRef.current.focus();
            break;
          case "dob":
            if (dobRef.current) dobRef.current.focus();
            break;
          case "phone":
            if (phoneRef.current) phoneRef.current.focus();
            break;
          case "linkedin":
            if (linkedinRef.current) linkedinRef.current.focus();
            break;
          case "github":
            if (githubRef.current) githubRef.current.focus();
            break;
          default:
            break;
        }
      }
      return newEditState;
    });
  };
  
  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field) => {
    const originalValue = user[field];
    const updatedValue = editedValues[field] || originalValue;
    
    if (updatedValue !== originalValue) {
      try {
        await dispatch(updateUserProfile({ [field]: updatedValue }));
        message.success(`${field} updated successfully!`);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      } catch (err) {
        message.error(`Failed to update ${field}`);
      }
    } else {
      message.info(`No changes made for ${field}`);
      setEditMode((prev) => ({ ...prev, [field]: false }));
    }
  };

  const showPasswordResetConfirmation = () => {
    Modal.confirm({
      title: "Are you sure you want to reset your password?",
      content: "A password reset link will be sent to your email address.",
      okText: "Yes",
      cancelText: "No",
      onOk: handleForgotPassword,
    });
  };

  const handleForgotPassword = async () => {
    try {
      await passwordReset(user.email);
      message.success(`Password reset email sent to ${user.email}`);
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleProfilePicUpdate = () => {
    message.info("Profile pic update functionality coming soon!");
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-pic-container">
            <Skeleton.Avatar active size="large" shape="circle" />
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
          </div>

          <div className="profile-right">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        </div>
      </div>
    );
  }

  const accountCreationDate = dayjs(user.createdAt).format('dddd, MMMM D, YYYY');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-pic-container">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-pic"
            onError={() => setProfilePic(defaultProfilePic)}
          />
          <div className="buttons">
            <Button type="primary" onClick={handleProfilePicUpdate} className="update-pic-btn">
              Update Profile Pic
            </Button>
            <Button type="default" onClick={showPasswordResetConfirmation} className="change-password-btn">
              <FaLock /> Reset Password
            </Button>
          </div>
        </div>

        <div className="profile-right">
          <h1>{user.name || "Guest User"}</h1>
          {status === "loading" && <p>Updating profile...</p>}
          {error && <p className="error">{error}</p>}

          <div className="profile-details">
            <div className="info-section">
              <h3>Personal Info</h3>

              <p>
                <FaUserAlt /> Name:{" "}
                {editMode.name ? (
                  <Input
                    ref={nameRef}
                    defaultValue={user.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  user.name
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.name ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.name ? handleUpdate("name") : handleEditToggle("name")}
                />
              </p>

              <p>
                <FaGenderless /> Gender:{" "}
                {editMode.gender ? (
                  <Select
                    ref={genderRef}
                    defaultValue={user.gender || "Prefer not to say"}
                    onChange={(value) => handleChange("gender", value)}
                    style={{ width: "70%" }}
                  >
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Prefer not to say">Prefer not to say</Select.Option>
                  </Select>
                ) : (
                  user.gender
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.gender ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.gender ? handleUpdate("gender") : handleEditToggle("gender")}
                />
              </p>

              <p>
                <FaBirthdayCake /> Date of Birth:{" "}
                {editMode.dob ? (
                  <DatePicker
                    ref={dobRef}
                    defaultValue={user.dob ? dayjs(user.dob, "YYYY-MM-DD") : null}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => handleChange("dob", dateString)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  user.dob
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.dob ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.dob ? handleUpdate("dob") : handleEditToggle("dob")}
                />
              </p>
            </div>

            <div className="info-section">
              <h3>Contact Info</h3>

              <p>
                <FaPhone /> Phone:{" "}
                {editMode.phone ? (
                  <Input
                    ref={phoneRef}
                    defaultValue={user.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  user.phone
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.phone ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.phone ? handleUpdate("phone") : handleEditToggle("phone")}
                />
              </p>

              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="info-section">
              <h3>Social Links</h3>

              <p>
                <FaLinkedin /> LinkedIn:{" "}
                {editMode.linkedin ? (
                  <Input
                    ref={linkedinRef}
                    defaultValue={user.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  user.linkedin
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.linkedin ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.linkedin ? handleUpdate("linkedin") : handleEditToggle("linkedin")}
                />
              </p>

              <p>
                <FaGithub /> GitHub:{" "}
                {editMode.github ? (
                  <Input
                    ref={githubRef}
                    defaultValue={user.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  user.github
                )}
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  icon={editMode.github ? <FaCheck /> : <FaEdit />}
                  onClick={() => editMode.github ? handleUpdate("github") : handleEditToggle("github")}
                />
              </p>
            </div>
            <div className="info-section">
              <h3>Account Created</h3>
              <p>
                <strong>Created on:</strong> {accountCreationDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
