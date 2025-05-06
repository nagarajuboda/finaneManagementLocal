import "../../assets/Styles/EmployeePages/EmployeeDetails.css";
import userProfile from "../../assets/Images/adminprofile.png";
import { useEffect, useState, React } from "react";
import axios from "axios";
import ellips from "../../assets/Images/Ellipse.png";
import checkimage from "../../assets/Images/check.png";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import { apiurl } from "../../Service/createAxiosInstance";
import { SixtyFps } from "@mui/icons-material";
export default function EmployeeDetails() {
  const employeeID = sessionStorage.getItem("id");

  const [employee, setEmployee] = useState({});
  const [ReportingManager, setReportingManager] = useState({});
  const [Skills, setSkills] = useState([]);
  const [role, setRole] = useState({});
  const [employeeTracking, setemployeeTracking] = useState([]);
  const [isVisible, setisVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [empStatus, setEmpStatus] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [employeeID]);
  const fetchData = async () => {
    const response = await EmployeeService.EmployeeDetailss(employeeID);
    var employeeResponse = response;
    setEmployee(employeeResponse.item.employee);
    setRole(employeeResponse.item.getRole);
    setReportingManager(employeeResponse.item.reportingManager);
    setSkills(employeeResponse.item.getSkillsets);
    const GetProjectsResponse = await EmployeeService.GetEmployeefcn(
      employeeID
    );
    setemployeeTracking(GetProjectsResponse.item);
  };

  const moreskills = () => {
    setisVisible(true);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".dropbtn")) {
      setDropdownOpen(false);
    }
  };
  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
  };
  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);
  const handleStatusChange = async (status) => {
    setEmployee({ ...employee, employeeStatus: status });
    var response = await EmployeeService.UpdateEmployeeStatus(
      employeeID,
      status
    );
    var result = response;
    if (result.isSuccess) {
      if (status === 1) {
        setEmpStatus("activated");
      } else {
        setEmpStatus("deactivated");
      }
      setOpen(true);
    }
  };
  const closeDeletePopup = () => {
    setOpen(false);
  };
  return (
    <div className="">
      <div className="Employee-details-content">employee details</div>
      <div className="view-employee-maindiv row">
        <div className="personal-details col-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "normal",
            }}
            className="mt-4"
          >
            <div className="me-4">
              <img src={userProfile} alt="" height="100px" width="100px" />
            </div>
            <div className="name-id-status pt-2 ">
              <p className="employee-name">
                {`${employee.firstName} ${employee.lastName}`}
              </p>
              <p className="employee-id">{employee.employeeId}</p>
              <div className="dropdown activeorDeactiveDropdownlist">
                <button
                  className="dropdown-toggle dropdowninside"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  <span className="dot"></span>
                  {employee.employeeStatus ? "Active" : "Inactive"}
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange(1)}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange(0)}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row mt-4 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Email
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {employee.email}
            </div>
          </div>
          <div className="row mt-3 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Mobile
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {`${"+91"} ${employee.mobileNo}`}
            </div>
          </div>
          <div className="row mt-3 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Date Of Joining
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {new Date(employee.dateOfJoining).toLocaleDateString("en-GB")}
            </div>
          </div>
          <div className="row mt-3 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Role
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {role.name}
            </div>
          </div>
          <div className="row mt-3 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Reporting Manager
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {ReportingManager
                ? `${ReportingManager?.firstName ?? ""} ${
                    ReportingManager?.lastName ?? ""
                  }`.trim() || "N/A"
                : "N/A"}
            </div>
          </div>
          <div className="row mt-3 ms-1 ">
            <div
              className="col-4 "
              style={{ fontSize: "14px", color: "#918A8A" }}
            >
              Skills
            </div>
            <div
              className="col-8"
              style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}
            >
              {Skills.length > 0 ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {Skills.slice(0, 3).map((empskill, index) => (
                      <p
                        key={index}
                        style={{
                          fontSize: "14px",
                          display: "flex",
                          marginRight: "5px",
                        }}
                      >
                        {empskill.skill}
                        {index < 2 && ","}
                      </p>
                    ))}

                    {Skills.length > 3 && (
                      <button
                        className="tooltip-button "
                        onClick={toggleTooltip}
                        style={{
                          fontSize: "14px",
                          color: "#139BFF",
                          paddingBottom: "15px",
                        }}
                        type="button"
                      >
                        ...more
                      </button>
                    )}
                  </div>

                  {isTooltipVisible && (
                    <div className="tooltip-box" style={{ marginLeft: "35px" }}>
                      <div className="tooltip-header">
                        <span style={{ fontSize: "14px", padding: "0px 7px" }}>
                          Skill Sets
                        </span>
                      </div>
                      <ul
                        className="tooltip-list"
                        style={{
                          overflowY: "scroll",
                          resize: "none",

                          borderRadius: "4px",
                          height: "100px",
                          flexWrap: "wrap",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#000000",
                        }}
                      >
                        {Skills.slice(3).map((empskill, index) => (
                          <li
                            key={index}
                            style={{
                              fontSize: "14px",
                              color: "white",
                              padding: "0px 7px",
                            }}
                          >
                            {empskill.skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ margin: "0" }}>NA</p>
              )}
            </div>
          </div>
        </div>

        <div className="working-details col-8">
          <div className="project-list mt-3">Project list</div>
          <div
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              overflowX: "hidden",

              padding: "0px 10px",
            }}
          >
            <table className="employeeTable" style={{ width: "100%" }}>
              <thead
                className="employee-Details-table"
                style={{
                  position: "sticky",
                  top: "0px",
                  left: "0px",
                  right: "0px",
                }}
              >
                <tr>
                  <th style={{ padding: "0px 8px", fontSize: "14px" }}>
                    Project Name
                  </th>
                  <th style={{ fontSize: "14px" }}>Client Name</th>
                  <th style={{ fontSize: "14px" }}>Project Manager</th>
                  <th style={{ fontSize: "14px" }}>Start Date</th>
                  <th style={{ fontSize: "14px" }}>End Date</th>
                </tr>
              </thead>
              <tbody>
                {employeeTracking.map((obj, index) => {
                  const dates = obj.period.split(" to ");
                  const fromDate = dates[0];
                  const toDate = dates[1];
                  return obj.bench === true ? (
                    <tr key={index}>
                      <td>
                        <p
                          style={{
                            margin: "0",
                            padding: "0px 8px",
                            fontSize: "14px",
                          }}
                        >
                          Bench
                        </p>
                      </td>
                      <td>
                        <p
                          style={{
                            fontWeight: "800",
                            margin: "0",
                            padding: "0px 8px",
                            fontSize: "14px",
                          }}
                        >
                          --
                        </p>
                      </td>
                      <td>
                        <p
                          style={{
                            fontWeight: "800",
                            margin: "0",
                            padding: "0px 8px",
                            fontSize: "14px",
                          }}
                        >
                          --
                        </p>
                      </td>
                      <td style={{ fontSize: "14px" }}> {fromDate}</td>
                      <td style={{ fontSize: "14px" }}> {toDate}</td>
                      <td></td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td
                        style={{ padding: "0px 8px", fontSize: "14px" }}
                        className="viewEmployee-Trace-Data"
                      >
                        {obj.project.projectName}
                      </td>
                      <td
                        className="viewEmployee-Trace-Data"
                        style={{ fontSize: "14px" }}
                      >
                        {obj.client.clientName}
                      </td>
                      <td
                        className="viewEmployee-Trace-Data"
                        style={{ fontSize: "14px" }}
                      >
                        {obj.projectManager.firstName}{" "}
                        {obj.projectManager.lastName}
                      </td>
                      <td
                        className="viewEmployee-Trace-Data"
                        style={{ fontSize: "14px" }}
                      >
                        {fromDate}
                      </td>
                      {toDate == "present" ? (
                        <td>
                          {
                            <p
                              style={{
                                fontWeight: "800",
                                margin: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                fontSize: "14px",
                              }}
                            >
                              --
                            </p>
                          }
                        </td>
                      ) : (
                        <td style={{ fontSize: "14px" }}>{toDate}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {open && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={checkimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={ellips}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              {" "}
              Employee has been {empStatus} successfully.
            </h2>
            <p className="unique-popup-message">Click OK to see the results</p>
            <button className="unique-popup-button" onClick={closeDeletePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
