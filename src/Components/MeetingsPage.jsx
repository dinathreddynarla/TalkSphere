import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings, addMeeting, editMeeting, deleteMeeting } from "../Redux/meetingsSlice.js";
import { Modal, Button, Input, DatePicker, Typography, Form, Skeleton, Space, message, Spin } from 'antd';
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
  });
  const [loading, setLoading] = useState(true); // For skeleton loading
  const [form] = Form.useForm();  // Ant Design form hook to handle form state
  const [isRedirecting, setIsRedirecting] = useState(false); // State to handle redirecting
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
    form.setFieldsValue(formData); // Update form values when formData changes
  }, [formData, form]);

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
      message.success("Meeting updated successfully!");
    } else {
      dispatch(addMeeting(values));
      message.success("Meeting scheduled successfully!");
    }

    setShowModal(false);
    setEditingMeeting(null);
    setFormData({ title: "", description: "", date: dayjs() });
    form.resetFields()
  };
console.log(formData)
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this meeting?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        dispatch(deleteMeeting(id));
        message.success("Meeting deleted successfully!");
      }
    });
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      date: dayjs(meeting.date)  // Convert to dayjs instance
    });
    setShowModal(true);
  };

  const handleJoin = (roomID) => {
    message.success("Redirecting to the room...");
    setIsRedirecting(true);
    setTimeout(() => {
      navigate(`/room/${roomID}`);
    }, 2000);
  };
  const handleCancel= ()=>{
    setFormData({ title: "", description: "", date: dayjs() });
    form.resetFields()
    setShowModal(false)
  }
  return (
    <div className="meetings-container">
      <Title level={1} className="meetings-title">Meetings</Title>
      
      <Button
  type="primary"
  icon={<ScheduleOutlined />}
  onClick={() => setShowModal(true)}
  style={{
    marginBottom: '20px',
    backgroundColor: '#2D6A4F',
    color: 'white',
    border: 'none',
    width: '250px',
    fontSize:"1.2em",
    padding: '10px',  // Applies to the entire button, including text
    display: 'flex',  // Ensures button contents align properly
    justifyContent: 'center',  // Centers the text horizontally
    alignItems: 'center',  // Centers the text vertically
  }}
>
  Schedule a Meeting
</Button>


      {/* Modal for scheduling/editing meetings */}
      <Modal
        title={editingMeeting ? "Edit Meeting" : "Schedule Meeting"}
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          initialValues={formData}
          onFinish={handleFormSubmit}  // Use onFinish instead of onSubmit
        >
          <Form.Item label="Title" name="title"  rules={[{ required: true, message: 'Please enter the title!' }]}>
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

          <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCancel} style={{ width: '48%', backgroundColor: '#f5f5f5', color: '#2D6A4F', border: 'none' }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '48%',
                backgroundColor: '#2D6A4F',
                color: 'white',
                border: 'none'
              }}
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
              <div className="meeting-actions" style={{ display: 'flex', justifyContent: 'center' , gap:"10px" }}>
              <Button
  type="primary"
  icon={<PlayCircleOutlined />}
  onClick={() => handleJoin(meeting._id)}
  style={{
    backgroundColor: '#2D6A4F',
    color: 'white',
    border: 'none',
    width: '120px',
    transition: 'background-color 0.3s, color 0.3s',  // Smooth transition for both background and color
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#1E4A3B';  // Darker shade on hover
    e.target.style.color = 'white';  // Text color remains white for readability
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = '#2D6A4F';  // Original color
    e.target.style.color = 'white';  // Text color remains white
  }}
>
  Start
</Button>

<Button
  icon={<EditOutlined />}
  onClick={() => handleEdit(meeting)}
  style={{
    backgroundColor: '#f5f5f5',
    color: '#2D6A4F',
    border: 'none',
    width: '120px',
    transition: 'background-color 0.3s, color 0.3s',  // Smooth transition for both background and color
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#e0e0e0';  // Slight darkening on hover
    e.target.style.color = '#2D6A4F';  // Text remains dark green
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = '#f5f5f5';  // Original color
    e.target.style.color = '#2D6A4F';  // Text remains dark green
  }}
>
  Edit
</Button>

<Button
  type="danger"
  icon={<DeleteOutlined />}
  onClick={() => handleDelete(meeting._id)}
  style={{
    backgroundColor: '#f5f5f5',
    color: '#2D6A4F',
    border: 'none',
    width: '120px',
    transition: 'background-color 0.3s, color 0.3s',  // Smooth transition for both background and color
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#ff4d4f';  // Red on hover
    e.target.style.color = 'white';  // White text for contrast
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = '#f5f5f5';  // Original color
    e.target.style.color = '#2D6A4F';  // Dark green text for readability
  }}
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
