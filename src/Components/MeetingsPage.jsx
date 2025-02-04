import React, { useState, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Styles/MeetingsPage.css";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    duration: ""
  });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const navigate = useNavigate()
  const handleJoin = useCallback((roomID)=>{
          navigate(`/room/${roomID}`)
      },[navigate])

  let token = JSON.parse(localStorage.getItem("session")).token;

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("https://talksphere-nyay.onrender.com/api/meetings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  },[meetings]);

  const handleFormSubmit = async e => {
    e.preventDefault();

    try {
      if (editingMeeting) {
        await axios.put(
          `https://talksphere-nyay.onrender.com/api/meetings/${editingMeeting._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("https://talksphere-nyay.onrender.com/api/meetings", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      setEditingMeeting(null);
      setFormData({ title: "", description: "", date: new Date(), duration: "" });
      fetchMeetings();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://talksphere-nyay.onrender.com/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleEdit = meeting => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      date: new Date(meeting.date),
      duration: meeting.duration
    });
    setShowModal(true);
  };

  return (
    <div className="meetings-container">
      <h1 className="meetings-title">Meetings</h1>

      <button className="schedule-btn" onClick={() => setShowModal(true)}>
        Schedule a Meeting
      </button>

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
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                className="textarea-field"
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
              <DatePicker
                selected={formData.date}
                onChange={date => setFormData({ ...formData, date })}
                className="input-field"
                showTimeSelect
                dateFormat="Pp"
              />
              <input
                type="number"
                className="input-field"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
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

      <div className="meetings-list">
        {meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          meetings.map(meeting => (
            <div key={meeting._id} className="meeting-card">
              <h3 className="meeting-title">{meeting.title}</h3>
              <p>{meeting.description}</p>
              <p>{meeting._id}</p>
              <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
              <p><strong>Duration:</strong> {meeting.duration} minutes</p>
              <div className="meeting-actions">
              <button className="start-btn" onClick={() => handleJoin(meeting._id)}>Start</button>
                <button className="edit-btn" onClick={() => handleEdit(meeting)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(meeting._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
