import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings, addMeeting, editMeeting, deleteMeeting } from "../Redux/meetingsSlice.js";
import { Modal, Button, Input, DatePicker, Typography, Form, Skeleton, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlayCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import dayjs from "dayjs";  // Import dayjs for date handling
import "../Styles/MeetingsPage.css";

const { Title } = Typography;

const MeetingsPage = () => {
  const dispatch = useDispatch();
  const meetings = useSelector((state) => state.meetings.meetings);
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: dayjs(),  // Set default value as dayjs instance
    duration: ""
  });
  const [loading, setLoading] = useState(true); // For skeleton loading
  const [form] = Form.useForm();  // Ant Design form hook to handle form state
  const navigate = useNavigate();
  const cookie = Cookies.get("session");
  const session = cookie ? JSON.parse(cookie) : null;

  if (!session) {
    navigate("/");  // Redirect to login page if no session exists
    return;
  }

  useEffect(() => {
    const isReload = sessionStorage.getItem("isReload");
    if (isReload) {
      navigate("/dashboard");
      sessionStorage.removeItem("isReload");
    }
  }, [navigate]);

  useEffect(() => {
    // Simulate data fetching delay
    
    setTimeout(() => {
      setLoading(false);  // Stop skeleton loading once data is fetched
    }, 1000);
  }, []);

  const handleFormSubmit = async (values) => {
    // If editing, dispatch the update action, else create a new meeting
    if (editingMeeting) {
      dispatch(editMeeting({ id: editingMeeting._id, formData: values }));
    } else {
      dispatch(addMeeting(values));
    }

    setShowModal(false);
    setEditingMeeting(null);
    setFormData({ title: "", description: "", date: dayjs(), duration: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteMeeting(id));
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      date: dayjs(meeting.date),  // Convert to dayjs instance
      duration: meeting.duration,
    });
    setShowModal(true);
  };

  const handleJoin = (roomID) => {
    navigate(`/room/${roomID}`);
  };

  return (
    <div className="meetings-container">
      <Title level={1} className="meetings-title">Meetings</Title>
      
      <Button
        type="primary"
        icon={<ScheduleOutlined />}
        onClick={() => setShowModal(true)}
        style={{ marginBottom: '20px' }}
      >
        Schedule a Meeting
      </Button>

      {/* Modal for scheduling/editing meetings */}
      <Modal
        title={editingMeeting ? "Edit Meeting" : "Schedule Meeting"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          initialValues={formData}
          onFinish={handleFormSubmit}  // Use onFinish instead of onSubmit
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Date & Time" name="date" rules={[{ required: true, message: 'Please select a date and time!' }]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              value={formData.date}  // Ensure it's a dayjs instance
              onChange={(date) => setFormData({ ...formData, date })}  // Update date using dayjs
            />
          </Form.Item>

          <Form.Item label="Duration (minutes)" name="duration" rules={[{ required: true, message: 'Please enter the duration!' }]}>
            <Input type="number" />
          </Form.Item>

          <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setShowModal(false)} style={{ width: '48%' }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '48%' }}
            >
              {editingMeeting ? "Update" : "Schedule"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Render Meetings List */}
      <div className="meetings-list">
        {loading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting._id} className="meeting-card">
              <Title level={3} className="meeting-title">{meeting.title}</Title>
              <p>{meeting.description}</p>
              <p><strong>Date:</strong> {dayjs(meeting.date).format("YYYY-MM-DD HH:mm")}</p>
              <p><strong>Duration:</strong> {meeting.duration} minutes</p>
              <div className="meeting-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleJoin(meeting._id)}
                >
                  Start
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(meeting)}
                >
                  Edit
                </Button>
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(meeting._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
