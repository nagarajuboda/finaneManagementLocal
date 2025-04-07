import "../../../src/assets/Styles/TimeSheet.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import TimeSheetService from "../../Service/ManagerService/TimeSheetService";
import ellips from "../../../src/assets/Images/Ellipse.png";
import checkimage from "../../../src/assets/Images/check.png";
import calenderImage from "../../assets/Images/calendar_11919171.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import NotificationService from "../../Service/AdminService/NotificationService";
import { useTable } from "react-table";
import { data } from "jquery";
import { apiurl } from "../../Service/createAxiosInstance";
export default function TimeSheet() {
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var id = userDetails.employee.id;
  var senderemail = userDetails.employee.email;
  const [selectedProject, setSelectedProject] = useState();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const [formattedDate, setFormattedDate] = useState("");
  const [projectOptions, setProjects] = useState([]);
  const [department, setDepartment] = useState("");
  const [getTimeSheet, setGetTimesheet] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(false);
  const [disibleRequestbuttons, setDisiblerequestbuttons] = useState(false);
  const [hours, setHours] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitOpen, setIssubmitOpen] = useState(false);
  const [ProjectEmployees, setProjectemployess] = useState([]);
  const [requestnotification, setRequestNotification] = useState({});
  const [timesheetids, settimesheetids] = useState([]);
  const [NotificationPopup, setnotificationPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [NotificationData, setNotificationData] = useState({});
  const [flag, setflag] = useState(false);
  useEffect(() => {
    const checkIsSubmitted =
      getTimeSheet.length > 0 && getTimeSheet[0].isSubmited === true;
    setflag(checkIsSubmitted);
    FetchData();
    const year = selectedDate.getFullYear();
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const result = `${month} ${year}`;
    setFormattedDate(result);
  }, [ProjectEmployees, department, selectedDate, selectedProject]);
  useEffect(() => {
    if (projectOptions.length > 0 && !selectedProject) {
      setSelectedProject(projectOptions[0]);
      handleProjectChange(projectOptions[0]);
    }
  }, [projectOptions, formattedDate, selectedProject]);
  const monthMap = {
    January: "1",
    February: "2",
    March: "3",
    April: "4",
    May: "5",
    June: "6",
    July: "7",
    August: "8",
    September: "9",
    October: "10",
    November: "11",
    December: "12",
  };

  async function FetchData() {
    debugger;
    const response = await EmployeeService.GetProjectInfo(id);
    const projects = response.item;
    const options = projects.map((p, index) => ({
      value: p.project.id,
      label: p.project.projectName,
    }));
    setProjects(options);

    const Timesheetresponse = await TimeSheetService.GetTimeSheetDeatils(
      formattedDate,
      selectedProject?.value
    );
    var checkIsSubmitted = await Timesheetresponse.item.map(
      (data) => data.isSubmited
    );

    if (Timesheetresponse.isSuccess && Timesheetresponse.item.length > 0) {
      var timesheetid = await Timesheetresponse.item.map(
        (data) => data.timesheetId
      );
      var result = await NotificationService.GetNotificationsByTimesheetId(
        timesheetid[0]
      );

      var checkNotificationReplay = await result.item.map((data) => data.reply);
      const hasZero = checkNotificationReplay.some((value) => value === 0);

      if (
        checkIsSubmitted[0] === true &&
        result.item.length > 0 &&
        hasZero === true
      ) {
        setDisiblerequestbuttons(true);
      } else {
        setDisiblerequestbuttons(false);
      }
    }

    setGetTimesheet(Timesheetresponse.item);
    if (Timesheetresponse.item.length > 0) {
      if (Timesheetresponse.item.every((el) => el.isSubmited === true)) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }
    } else {
      setDisiblebuttons(false);
    }
    const newHours = {};
    Timesheetresponse.item.forEach((each) => {
      newHours[each.employeeId] = each.workingHourse;
    });
    setHours(newHours);
  }
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const formattedDate = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
    const ProjectEmployeess = await apiurl.get(
      `/Timesheets/GetProjectEmployee?projectID=${selectedProject.value}&date=${formattedDate}`
    );
    setHours({});
    var result = ProjectEmployeess.data;
    if (result.isSuccess) {
      setProjectemployess(result.item.item1);
      setDepartment(result.item.item2);
    }
  };
  const handleProjectChange = async (option) => {
    setSelectedProject(option);
    const ProjectEmployeess = await apiurl.get(
      `/Timesheets/GetProjectEmployee?projectID=${option.value}&date=${formattedDate}`
    );
    var result = ProjectEmployeess.data;
    setProjectemployess(result.item.item1);
    setDepartment(result.item.item2);
  };
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    control: (provided) => ({
      ...provided,
      height: "32px",
      minHeight: "32px",
    }),
    option: (provided) => ({
      ...provided,
      padding: "10px",
    }),
  };
  const handleHoursChange = (employeeId, value) => {
    setHours((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const SubmitFormFunction = async () => {
    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    var projectId = selectedProject.value;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
    const response = await TimeSheetService.AddNewTimeSheet(data, id, true);
    if (response.isSuccess) {
      setIssubmitOpen(true);
      FetchData();
    } else {
      debugger;
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };
  const Resetfunction = (e) => {
    setHours({});
  };
  const SaveForm = async () => {
    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    var projectId = selectedProject.value;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
    const response = await TimeSheetService.AddNewTimeSheet(data, id, false);
    if (response.isSuccess) {
      setIsOpen(true);
    } else {
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };
  const RequestForUpdateTimeSheet = async () => {
    var timesheetid = getTimeSheet.map((data) => data.timesheetId);
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const year = selectedDate.getFullYear();
    const monthNumber = monthMap[month];
    var obj = {
      senderId: id,
      senderEmail: senderemail,
      timesheetId: timesheetid[0],
      projectId: selectedProject.value,
      projectName: selectedProject.label,
      selectedMonth: monthNumber,
      selectedYear: year,
      createdAt: new Date(),
    };
    setLoading(true);
    var response = await apiurl.post("/Notifications/CreateNotification", obj);
    var result = response.data;
    if (result !== null) {
      setLoading(false);
      FetchData();
      setnotificationPopup(true);
    } else {
      setnotificationPopup(false);
    }
    setRequestNotification(result);
  };

  return (
    <div>
      <div className="timeSheet_content">TimeSheet</div>
      <div className="TimeSheetMainDiv">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ paddingTop: "20px" }}>
            <span
              className="billing_hours_content "
              style={{ marginLeft: "10px" }}
            >
              Billing Hours
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              justifyContent: "end",
              marginRight: "25px",
              paddingTop: "20px",
            }}
          >
            <div className="">
              <Select
                options={projectOptions}
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={selectedProject}
                className="drop_down_list"
                styles={customStyles}
              />
            </div>

            <div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                maxDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    1
                  )
                }
                className="timesheet-datepicker"
                customInput={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      <img
                        src={calenderImage}
                        alt=""
                        height="20px"
                        width="20px"
                      />
                    </span>
                    <span>
                      {selectedDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                }
              />
            </div>
          </div>
        </div>
        <div className="TimeSheet_Table" style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ fontSize: "14px" }}>Name</th>
                <th style={{ fontSize: "14px" }}>Email</th>
                <th style={{ fontSize: "14px" }}>Department</th>
                <th style={{ fontSize: "14px" }}>Status</th>
                <th style={{ textAlign: "center", fontSize: "14px" }}>Role</th>
                <th style={{ textAlign: "center", fontSize: "14px" }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {ProjectEmployees.length > 0 ? (
                ProjectEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ fontSize: "14px" }}>
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td style={{ fontSize: "14px" }}>{employee.email}</td>
                    <td style={{ fontSize: "14px" }}>{department}</td>
                    <td>
                      <span
                        className="activeInactive"
                        style={{ fontSize: "14px" }}
                      >
                        {employee.employeeStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", fontSize: "14px" }}>
                      {employee.role.name}
                    </td>
                    <td>
                      {getTimeSheet.length > 0 ? (
                        getTimeSheet
                          .filter((obj) => obj.employeeId === employee.id)
                          .map((filteredEmployee) => (
                            <div key={filteredEmployee.employeeId}>
                              {filteredEmployee.isSubmited === true ? (
                                <span
                                  style={{
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                  }}
                                >
                                  {filteredEmployee.workingHourse}
                                </span>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <input
                                    type="text"
                                    className="timesheet_input form-control  "
                                    value={hours[employee.id] || ""}
                                    placeholder="00:00  Hrs"
                                    onChange={(e) =>
                                      handleHoursChange(
                                        employee.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            type="text"
                            className="timesheet_input form-control "
                            d
                            placeholder="00:00  Hrs"
                            value={hours[employee.id] || ""}
                            onChange={(e) =>
                              handleHoursChange(employee.id, e.target.value)
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>

                  <td></td>
                  <td>No Records Found</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingBottom: "15px",
          }}
        >
          {!disiblebuttons && ProjectEmployees.length !== 0 && (
            <div>
              <button
                type="button"
                className="MakeARequestbutton me-2"
                onClick={Resetfunction}
              >
                <span className="make_a_request_span"> reset</span>
              </button>

              <button
                type="button"
                className="save_button me-2"
                onClick={SaveForm}
              >
                <span className="make_a_request_span"> save</span>
              </button>

              <button
                type="button"
                className="submit_button me-2"
                onClick={SubmitFormFunction}
              >
                <span className="make_a_request_span"> Submit</span>
              </button>
            </div>
          )}
        </div>
        {disiblebuttons && (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingBottom: "15px",
            }}
          >
            {loading === false ? (
              <button
                type="button"
                className="submitbutton  make-a-request-button"
                disabled={disibleRequestbuttons}
                style={{ marginRight: "10px", height: "36px" }}
                onClick={RequestForUpdateTimeSheet}
              >
                <span
                  className="make_a_request_span"
                  style={{ fontSize: "14px", width: "141px" }}
                >
                  Make a request
                </span>
              </button>
            ) : (
              loading && (
                <button
                  class="btn btn-primary"
                  type="button"
                  disabled
                  style={{ marginRight: "10px", height: "36px" }}
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </button>
              )
            )}
          </div>
        )}
      </div>
      {isOpen && (
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
              TimeSheet Saved Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIsOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isSubmitOpen && (
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
              TimeSheet Submitted Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIssubmitOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {NotificationPopup && (
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
              Your request has been successfully sent to the Indian Finance Team
              for timesheet editing.
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setnotificationPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-end" autoClose={5000} />
    </div>
  );
}
