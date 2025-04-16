import { useEffect, useState } from "react";
import IndianFinanceService from "../../../Service/IndianFinance/IndianFinanceService";
import AdminDashboardServices from "../../../Service/AdminService/AdminDashboardServices";
import "../../../assets/Styles/RecentActivities.css";
import { RecentActors } from "@mui/icons-material";
import RecentEmployeeImage from "../../../assets/Images/AddEmployeeimage.png";
import TeamMemberAddedImage from "../../../assets/Images/TeamMemberAdded.png";
import teamMemberAdded from "../../../assets/Images/TeamMemberAdded.png";
import UpdateProjectImahe from "../../../assets/Images/ProjectUpdateBackUp.png";
export default function AllRecnetActivities() {
  const [activityLogs, setActivitylogs] = useState([]);
  useEffect(() => {
    FetchData();
  }, []);
  const FetchData = async () => {
    var ActivityLogResponse = await AdminDashboardServices.FcnActivityLogs();
    setActivitylogs(ActivityLogResponse);
  };
  const sortedRecentActivities = activityLogs
    .filter((notif) => {
      const notifDate = new Date(notif.timestamp);
      const today = new Date();

      return notifDate >= notifDate <= today;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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

  return (
    <div>
      <div className="recent-activity-content">recentActivities</div>
      <div className="recent-activities-all mt-2">
        {sortedRecentActivities.length > 0 && (
          <div className="latest_updatesImage row ">
            {sortedRecentActivities.map((activity, index) => {
              let title = "";
              let actionText = "";
              let imageSrc = "";
              let performedBy = activity.performedBy;
              const action = activity.action;
              const actionType = action.split(":")[0];
              if (activity.entityName === "Project") {
                title = "Project Updated";
                actionText = actionType + " " + "Project";
                imageSrc = UpdateProjectImahe;
              } else if (activity.entityName === "Employee") {
                if (actionType === "Added") {
                  title = "Employee Updated";
                  actionText = actionType + " " + "new employee";
                } else if (actionType === "Updated") {
                  actionText = actionType + " " + "employee";
                } else {
                  actionText = actionType + " " + "employee";
                }

                imageSrc = RecentEmployeeImage;
              } else if (activity.entityName === "Role") {
                title = "Role Modified";
                actionText = actionType + " " + "role";
              } else if (activity.entityName === "ProjectEmployee") {
                if (actionType == "Added") {
                  actionText = "Team member added";
                  imageSrc = teamMemberAdded;
                } else {
                  actionText = "Team member removed";
                  imageSrc = teamMemberAdded;
                }
              } else {
                return null;
              }

              return (
                <div
                  className="pb-1 mt-4 Activityrow "
                  key={index}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="ms-3 " style={{ display: "flex" }}>
                    {activity.entityName === "Project" ? (
                      <div
                        style={{
                          height: "38px",
                          width: "38px",
                          backgroundColor: "#875fc0",
                          borderRadius: "100px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={UpdateProjectImahe}
                          alt=""
                          style={{
                            position: "absolute",
                            top: "25%",
                            left: "25%",
                          }}
                        />
                      </div>
                    ) : activity.entityName === "Employee" ? (
                      <div>
                        <img
                          src={RecentEmployeeImage}
                          alt=""
                          height="38px"
                          width="38px"
                        />
                      </div>
                    ) : activity.entityName === "ProjectEmployee" ? (
                      <div>
                        <div
                          style={{
                            height: "40px",
                            width: "40px",
                            backgroundColor: "#45C4F4",
                            borderRadius: "100px",
                            position: "relative",
                          }}
                        >
                          <img
                            src={TeamMemberAddedImage}
                            alt=""
                            style={{
                              position: "absolute",
                              top: "25%",
                              left: "25%",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <img
                            src={RecentEmployeeImage}
                            alt=""
                            height="38px"
                            width="38px"
                          />
                        </div>
                      </div>
                    )}
                    <div className="ms-3">
                      <span className="Project_Updated_Span">{actionText}</span>
                      <div style={{ display: "flex" }}>
                        <span
                          className="project_updated_name"
                          style={{ fontSize: "14px" }}
                        >
                          {performedBy}
                        </span>
                        <span
                          className="updated_task_content ms-3 "
                          style={{ fontSize: "14px" }}
                        >
                          Updated a task
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className=" me-2 ">
                    <span
                      className="updated_time timeStamp"
                      style={{ fontSize: "14px" }}
                    >
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
