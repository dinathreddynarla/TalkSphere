import React, { useEffect, useState , useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings, addMeeting, editMeeting, deleteMeeting,} from "../Redux/meetingsSlice.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Styles/MeetingsPage.css";
import Cookies from "js-cookie";


const MeetingsPage = () => {
  const dispatch = useDispatch();
  const meetings = useSelector((state) => state.meetings.meetings);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    duration: ""
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingMeeting) {
      dispatch(editMeeting({ id: editingMeeting._id, formData }));
    } else {
      dispatch(addMeeting(formData));
    }
    setShowModal(false);
    setEditingMeeting(null);
    setFormData({ title: "", description: "", date: new Date(), duration: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteMeeting(id));
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      date: new Date(meeting.date),
      duration: meeting.duration,
    });
    setShowModal(true);
  };

  const handleJoin = useCallback((roomID)=>{
    navigate(`/room/${roomID}`)
  },[navigate])

  return (
    <div className="meetings-container">
      <h1 className="meetings-title">Meetings</h1>

      <button className="schedule-btn" onClick={() => setShowModal(true)}>
        Schedule a Meeting
      </button>

      {/* Render Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editingMeeting ? "Edit Meeting" : "Schedule Meeting"}</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                className="input-field"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                className="textarea-field"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                className="input-field"
                showTimeSelect
                dateFormat="Pp"
              />
              <input
                type="number"
                className="input-field"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingMeeting ? "Update" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Meetings */}
      <div className="meetings-list">
        {meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting._id} className="meeting-card">
              <h3 className="meeting-title">{meeting.title}</h3>
              <p>{meeting.description}</p>
              <p>
                <strong>Date:</strong> {new Date(meeting.date).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong> {meeting.duration} minutes
              </p>
              <div className="meeting-actions">
              <button className="start-btn" onClick={() => handleJoin(meeting._id)}>Start</button>
                <button className="edit-btn" onClick={() => handleEdit(meeting)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(meeting._id)}> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
