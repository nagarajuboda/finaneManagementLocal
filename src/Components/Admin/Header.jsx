import React, { useState, useEffect, useRef } from "react";
import "../../assets/Styles/Header.css";
import { json, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/ArchentsLogo.png";
import profile from "../../assets/Images/adminprofile.png";
import Swal from "sweetalert2";
import v from "../../assets/Images/v.png";
import { getSessionData } from "../../Service/SharedSessionData";
import myprofile from "../../../src/assets/Images/myprofile.png";
import support from "../../../src/assets/Images/support.png";
import settings from "../../../src/assets/Images/settings.png";
import logout from "../../../src/assets/Images/Logout.png";
import NotificationImage from "../../../src/assets/Images/Notification.png";
import checkimgae1 from "../../assets/Images/check.png";
import elllips1 from "../../assets/Images/Ellipse.png";
import { formatDistanceToNow } from "date-fns";
import {
  FaSearch,
  FaUserCircle,
  FaBell,
  FaCog,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import { apiurl } from "../../Service/createAxiosInstance";
import NotificationService from "../../Service/AdminService/NotificationService";

export default function Header({ isOpen }) {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);
  const popupRef = useRef(null);

  const [isVisibleProfile, setIsVisibleProfile] = useState(false);
  const [sessionData, setSessionDataState] = useState(null);
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState({});
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var employeeID = userDetails.employee.id;
  const [unreadCount, setUnreadCount] = useState(0);
  const [AcceptSuccessMessage, setAcceptSuccessMessage] = useState(false);
  const [singleNotification, setSingleNotification] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [DeclinedPopup, setDeclinedPopup] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  // const [token, setToken] = useState(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen1(false);
    }
  };
  useEffect(() => {}, [notifications]);
  useEffect(() => {
    fetchdata();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const getRelativeTime = (timestamp) => {
    const parsedDate = Date.parse(timestamp);
    if (isNaN(parsedDate)) {
      return "Invalid date";
    }

    const date = new Date(parsedDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) {
      return "Just now";
    }
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const fetchdata = async () => {
    var response = await NotificationService.GetUserNotifications(employeeID);
    var result = response;

    if (result.isSuccess) {
      setAllNotifications(result.item);
      var NotReadNotification = result.item.filter(
        (data) => data.isRead === false
      );
      setNotifications(NotReadNotification);
    }
  };

  useEffect(() => {
    const subscription = getSessionData().subscribe({
      next: (data) => {
        setSessionDataState(data);
      },
      error: (err) => {
        console.error("Error fetching session data: ", err);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        event.target.closest(".profile-popup") === null
      ) {
        setIsVisibleProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleDropdown = () => {
    if (isOpen1) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen1(false);
        setIsClosing(false);
      }, 200);
    } else {
      setIsOpen1(true);
    }
  };

  const Logoutfunction = () => {
    localStorage.removeItem("sessionData");
    navigate("/user/Login");
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };
  const markAsRead = async (idd) => {
    setIsPopupOpen(false);
    const getsingleRecord = notifications.find((record) => record.id === idd);
    setSingleNotification(getsingleRecord);
    var response = await apiurl.put(
      `/Notifications/MarkAsRead?notificationId=${idd}`
    );
    var resultmessage = response.data;
    if (resultmessage.message) {
      fetchdata();
      navigate("/dashboard/Notifications");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeAcceptedorRejectedPopup = () => {
    setAcceptSuccessMessage(false);
  };
  const DelciedClosePopup = () => {
    setDeclinedPopup(false);
  };
  const ViewAllNotification = () => {
    navigate("/dashboard/Notifications");
    setIsPopupOpen(false);
  };
  const sortedNotifications = notifications
    .filter((notif) => {
      const notifDate = new Date(notif.createdAt);
      const today = new Date();

      return notifDate >= notifDate <= today;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const ViewProfile = () => {
    navigate("/dashboard/Profile");
  };
  return (
    <div
      className="Headermaindiv"
      style={{
        width: "100%",
        marginLeft: isOpen ? "" : "",
      }}
    >
      <div
        className="me-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="notification-wrapper">
          <div
            className="notification-icon"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          >
            <img
              src={NotificationImage}
              alt="Notifications"
              height="24"
              width="24"
            />
            {notifications.filter((notif) => !notif.isRead).length > 0 && (
              <span className="badge">
                {notifications.filter((notif) => !notif.isRead).length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ position: "relative", display: "inline-block" }}
        ref={dropdownRef}
      >
        <button onClick={toggleDropdown} style={{ cursor: "pointer" }}>
          <div
            className="profilediv"
            style={{ display: "flex", cursor: "pointer" }}
          >
            <span className="vericalline"></span>
            <div style={{ marginTop: "7px", marginLeft: "10px" }}>
              <img
                className="mt-1"
                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </div>
            <div
              style={{ textAlign: "center", justifyContent: "center" }}
              className="mt-1 ms-2"
            >
              <div>
                <span className="username">
                  {`${userDetails.employee.firstName}   ${userDetails.employee.lastName}`}
                </span>
                <div className="userrole">
                  <span className="me-3">{userDetails.employee.role.name}</span>
                </div>
              </div>
            </div>
            <div className="">
              <img src={v} alt="" className="vimage" />
            </div>
          </div>
        </button>
        <div>
          {(isOpen1 || isClosing) && (
            <div
              className={`${isClosing ? "closeprofilediv" : "openprofilediv"}`}
              style={{
                position: "absolute",
                top: "94%",
                right: "20px",
                background: "white",
                border: "1px solid #ccc",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                zIndex: 1000,
                width: "228px",
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, paddingLeft: "10px" }}>
                <li
                  style={{ padding: "10px 0", cursor: "pointer" }}
                  onClick={ViewProfile}
                >
                  <img src={myprofile} alt="" width="24px" height="24px" />
                  <span style={{ fontSize: "14px" }} className="ms-3">
                    My Profile
                  </span>
                </li>
                <div
                  style={{
                    border: "1px solid #64646430",
                    width: "100%",
                  }}
                ></div>
                <li style={{ padding: "10px 0", cursor: "pointer" }}>
                  <img src={support} alt="" width="24px" height="24px" />
                  <span style={{ fontSize: "12px" }} className="ms-3">
                    Support
                  </span>
                </li>
                <div
                  style={{
                    border: "1px solid #64646430",
                    width: "100%",
                  }}
                ></div>
                <li style={{ padding: "10px 0", cursor: "pointer" }}>
                  <img src={settings} alt="" width="24px" height="24px" />
                  <span style={{ fontSize: "14px" }} className="ms-3">
                    Settings
                  </span>
                </li>
                <div
                  style={{
                    border: "1px solid #64646430",
                    width: "100%",
                  }}
                ></div>
                <li
                  style={{ padding: "10px 0", cursor: "pointer" }}
                  onClick={Logoutfunction}
                >
                  <img src={logout} alt="" width="24px" height="24px" />
                  <span style={{ fontSize: "14px" }} className="ms-3">
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div>
        {DeclinedPopup && (
          <div className="unique-popup-overlay">
            <div className="unique-popup-container">
              <div className="unique-popup-icon">
                <div className="ellipse-container">
                  <img
                    src={checkimgae1}
                    alt="Check"
                    className="check-image"
                    height="40px"
                    width="40px"
                  />
                  <img
                    src={elllips1}
                    alt="Ellipse"
                    className="ellipse-image"
                    height="65px"
                    width="65px"
                  />
                </div>
              </div>
              <h2 className="unique-popup-title">
                TimeSheet Declined Successfully!
              </h2>
              <p className="unique-popup-message">Click OK to view result</p>
              <button
                className="unique-popup-button"
                onClick={DelciedClosePopup}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div ref={popupRef} className="notifications-popup">
          <div className="dropdown-arrow"></div>
          <div
            className="RecentNotificationContent ms-3"
            style={{ paddingTop: "5px" }}
          >
            Recent Notification
          </div>
          {allNotifications.length === 0 ? (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              No notifications
            </span>
          ) : (
            sortedNotifications.map((notif) => (
              <div
                key={notif.id}
                className="notification-item mt-2 pb-2"
                style={{
                  marginBottom: "15px",
                }}
              >
                <div className="notification-content">
                  <div style={{ display: "flex" }}>
                    <div className="boxshowdow"></div>
                    <div className="ms-3">
                      {userDetails.employee.role.name === "Indian-finance" ? (
                        <span className="forwhatrequest">
                          TimeSheet change request approved
                        </span>
                      ) : notif.reply === 1 ? (
                        <span className="forwhatrequest">
                          TimeSheet change request Accepted
                        </span>
                      ) : (
                        notif.reply === 2 && (
                          <span className="forwhatrequest">
                            TimeSheet change request decline
                          </span>
                        )
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          className="meta-info "
                          style={{ display: "flex", fontSize: "14px " }}
                        >
                          {new Date(notif.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                          |
                          <div>
                            <span
                              className="action-link ms-2"
                              onClick={() => markAsRead(notif.id)}
                            >
                              View Info
                            </span>
                          </div>
                        </p>
                        <span className="ms-5 meta-info">
                          {getRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {allNotifications.length > 0 && (
            <div className="">
              <div className="ViewAll-button-div  ">
                <button
                  type="button"
                  className="ViewAll-button"
                  onClick={ViewAllNotification}
                >
                  View All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        {AcceptSuccessMessage && (
          <div className="unique-popup-overlay">
            <div className="unique-popup-container">
              <div className="unique-popup-icon">
                <div className="ellipse-container">
                  <img
                    src={checkimgae1}
                    alt="Check"
                    className="check-image"
                    height="40px"
                    width="40px"
                  />
                  <img
                    src={elllips1}
                    alt="Ellipse"
                    className="ellipse-image"
                    height="65px"
                    width="65px"
                  />
                </div>
              </div>
              <h2 className="unique-popup-title">
                TimeSheet Accepted Successfully!
              </h2>
              <p className="unique-popup-message">Click OK to view result</p>
              <button
                className="unique-popup-button"
                onClick={closeAcceptedorRejectedPopup}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
