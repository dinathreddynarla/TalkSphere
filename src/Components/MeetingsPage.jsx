import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeetings,
  addMeeting,
  editMeeting,
  deleteMeeting
} from "../Redux/meetingsSlice";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  Typography,
  Form,
  Skeleton,
  message,
  Card,
  Popover,
  Menu
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  ScheduleOutlined,
  MoreOutlined,
  CopyOutlined
} from "@ant-design/icons";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import "../Styles/MeetingsPage.css";
import nomeetings from "../assets/nomeetings2.png";

const { Title } = Typography;

const MeetingsPage = () => {
  const dispatch = useDispatch();
  const meetings = useSelector(state => state.meetings.meetings);
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: dayjs()
  });
  const [loading, setLoading] = useState(true); // For skeleton loading
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const cookie = Cookies.get("session");
  const session = cookie ? JSON.parse(cookie) : null;
  const [openPopovers, setOpenPopovers] = useState({});

  const handleOpenChange = (visible, meetingId) => {
    setOpenPopovers(prev => ({ ...prev, [meetingId]: visible }));
  };
  // Redirect to login if no session
  if (!session) {
    navigate("/");
    return null;
  }

  useEffect(
    () => {
      if (sessionStorage.getItem("isReload")) {
        navigate("/dashboard");
        sessionStorage.removeItem("isReload");
      }
    },
    [navigate]
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate data fetching delay
  }, []);

  const handleFormSubmit = async values => {
    const action = editingMeeting ? editMeeting : addMeeting;
    const payload = editingMeeting
      ? { id: editingMeeting._id, formData: values }
      : values;
    dispatch(action(payload));
    message.success(
      editingMeeting
        ? "Meeting updated successfully!"
        : "Meeting scheduled successfully!"
    );
    setShowModal(false);
    setEditingMeeting(null);
    setFormData({ title: "", description: "", date: dayjs() });
    form.resetFields();
  };

  const handleDelete = id => {
    setOpenPopovers(prev => ({ ...prev, [id]: false }));
    Modal.confirm({
      title: "Are you sure you want to delete this meeting?",
      onOk: () => {
        dispatch(deleteMeeting(id));
        message.success("Meeting deleted successfully!");
      }
    });
  };
  const handleNewMeet = () => {
    form.setFieldsValue({
      title: "",
      description: "",
      date: dayjs()
    });
    setShowModal(true);
  };
  const handleEdit = meeting => {
    console.log(formData);

    // Close popover for this meeting
    setOpenPopovers(prev => ({ ...prev, [meeting._id]: false }));

    // Set form values
    form.setFieldsValue({
      title: meeting.title,
      description: meeting.description,
      date: dayjs(meeting.date)
    });

    setEditingMeeting(meeting);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingMeeting(null);

    form.setFieldsValue({
      title: "",
      description: "",
      date: dayjs()
    });
  };

  const handleJoin = roomID => {
    message.success("Redirecting to the room...");
    setTimeout(() => navigate(`/room/${roomID}`), 2000);
  };

  const handleCopyLink = meetingId => {
    const meetingLink = `https://talk-sphere-nine.vercel.app/room/${meetingId}`;
    navigator.clipboard
      .writeText(meetingLink)
      .then(() => message.success("Meeting link copied to clipboard!"))
      .catch(() => message.error("Failed to copy the link"));
  };

  const menu = meeting =>
    <Menu
      items={[
        {
          key: "1",
          label: (
            <span onClick={() => handleEdit(meeting)}>
              <EditOutlined /> Edit
            </span>
          )
        },
        {
          key: "2",
          label: (
            <span
              onClick={() => handleDelete(meeting._id)}
              style={{ color: "red" }}
            >
              <DeleteOutlined /> Delete
            </span>
          ),
          danger: true
        }
      ]}
    />;

  return (
    <div className="meetings-container">
      <div className="meeting-header">
        <Title level={1}>Meetings</Title>
        <Button
          type="primary"
          icon={<ScheduleOutlined />}
          onClick={handleNewMeet}
          style={{
            backgroundColor: "#2D6A4F",
            color: "white",
            border: "none",
            width: "230px",
            fontSize: "1.2em",
            padding: "10px"
          }}
        >
          Schedule a Meeting
        </Button>
      </div>

      <Modal
        title={editingMeeting ? "Edit Meeting" : "Schedule Meeting"}
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} initialValues={formData} onFinish={handleFormSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Date & Time"
            name="date"
            rules={[
              { required: true, message: "Please select a date and time!" }
            ]}
          >
   <DatePicker
  showTime={{ format: "HH:mm", minuteStep: 5, use12Hours: true }}
  format="YYYY-MM-DD hh:mm A"
  style={{
    width: "100%",  // Reduce width
    fontSize: "12px",
    padding: "2px 6px",
    textAlign: "center", // Centers text inside
  }}
  // Adjusts dropdown position
  value={formData.date}
  placeholder="Pick date"
  onChange={(date) => setFormData({ ...formData, date })}
  disabledDate={(current) => current && current < dayjs().startOf("day")}
/>
          </Form.Item>
          <div
            className="modal-buttons"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button onClick={handleCancel} style={{ width: "48%" }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ width: "48%" }}>
              {editingMeeting ? "Update" : "Schedule"}
            </Button>
          </div>
        </Form>
      </Modal>

      <div className="meetings-list">
        {loading
          ? Array(4).fill(null).map((_, index) =>
              <Card key={index} className="skeleton-card">
                <Skeleton loading active paragraph={{ rows: 4 }} />
              </Card>
            )
          : meetings.length === 0
            ? <div className="no-meetings">
                <img src={nomeetings} alt="no meetings scheduled" />
                <h1>No meetings Scheduled</h1>
              </div>
            : meetings.map(meeting =>
                <div key={meeting._id} className="meeting-card">
                  <div className="meeting-card-header">
                    <Title level={3}>
                      {meeting.title}
                    </Title>
                    <Popover
                      content={menu(meeting)}
                      trigger="click"
                      placement="bottomRight"
                      open={openPopovers[meeting._id] || false}
                      onOpenChange={visible =>
                        handleOpenChange(visible, meeting._id)}
                    >
                      <Button
                        icon={<MoreOutlined />}
                        style={{ fontSize: "16px" }}
                      />
                    </Popover>
                  </div>
                  <p>
                    {dayjs(meeting.date).format("dddd, D MMMM, hh:mm A")}
                  </p>
                  <p className="meeting-status">
                    {meeting.isActive
                      ? <span>
                          <CheckCircleOutlined
                            style={{ color: "green", marginRight: "5px" }}
                          />
                          Active
                        </span>
                      : <span>
                          <CloseCircleOutlined
                            style={{ color: "red", marginRight: "5px" }}
                          />
                          Not Active
                        </span>}
                  </p>
                  <p>
                    {meeting.description}
                  </p>
                  <div className="meeting-actions">
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleJoin(meeting._id)}
                      style={{
                        backgroundColor: "#2D6A4F",
                        color: "white",
                        border: "none",
                        width: "120px",
                        transition: "background-color 0.3s, color 0.3s" // Smooth transition for both background and color
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = "#1E4A3B"; // Darker shade on hover
                        e.target.style.color = "white"; // Text color remains white for readability
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = "#2D6A4F"; // Original color
                        e.target.style.color = "white"; // Text color remains white
                      }}
                    >
                      Start
                    </Button>
                    <Button
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyLink(meeting._id)}
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#2D6A4F",
                        border: "none",
                        width: "120px",
                        transition: "background-color 0.3s, color 0.3s" // Smooth transition for both background and color
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = "#e0e0e0"; // Slight darkening on hover
                        e.target.style.color = "#2D6A4F"; // Text remains dark green
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = "#f5f5f5"; // Original color
                        e.target.style.color = "#2D6A4F"; // Text remains dark green
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              )}
      </div>
    </div>
  );
};

export default MeetingsPage;
