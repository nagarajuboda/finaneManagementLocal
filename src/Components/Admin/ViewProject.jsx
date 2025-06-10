import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "../../assets/Styles/ViewProject.css";
import $, { data } from "jquery";
import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import withReactContent from "sweetalert2-react-content";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "datatables.net";
import { IoArrowBackCircle } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import { IoMdAddCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import AdminDashboardServices from "../../Service/AdminService/AdminDashboardServices";
import { getSessionData } from "../../Service/SharedSessionData";
import ImportPopup from "../Employee/ImportPopup";
import userimage from "../../assets/Images/User.png";
import deleteImage from "../../assets/Images/deleteicon.png";
import pulusimage from "../../assets/Images/plus.png";
import chechimage from "../../assets/Images/check.png";
import elipsimage from "../../assets/Images/Ellipse.png";
import Dropdown from "react-bootstrap/Dropdown";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import ImportProjectEmployees from "../Employee/ImportProjectEmployees";
import ProjectService from "../../Service/AdminService/ProjectService";
export function ViewProject() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
  const [Projectresponse, setresponse] = useState({});
  const [projectEmployess, setProjectEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [showw, setShoww] = useState(false);
  const handleClose = () => setShow(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [Employeeids, setIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [ProjectValues, setProjectValues] = useState({});
  const [clientvalues, setClientValues] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [GetAllemployees, setEmployees] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [projectManagerEmail, setProjectMangerEmail] = useState("");
  const [projectManagerName, setProjectMangerName] = useState("");
  const [sessiondata, setSessiondata] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);
  const [projectManagername, setProjectManagerName] = useState("");
  const navigate = useNavigate();
  const [sessionData, setSessionDataState] = useState(null);
  const [projectStartDate1, setprojectStartDate] = useState("");
  const [projectDeadline1, setprojectDeadline] = useState("");
  const [searchText, setSearchText] = useState("");
  const ProjectID = sessionStorage.getItem("id");
  const [isOpen, setisOpen] = useState(false);
  const [Projects, setProjects] = useState([]);
  const [status, setStatus] = useState("InActive");
  const [ProjectProgress, setProjectprogress] = useState(0);
  const [employeelist, setEmployeelist] = useState([]);
  const [ReportingManagerId, setReportingManagerId] = useState("");
  const [open, setopen] = useState(false);
  const [clients, setClients] = useState([]);
  const [deleteemployeepopup, setdeleteEmployeepopup] = useState(false);
  const [assignedNewEmployeePopup, setassignedNewEmployeePopup] =
    useState(false);
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  useEffect(() => {
    FetchData();
    filteredEmployees;
  }, [ProjectID]);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  useEffect(() => {
    setProgressPercentage(calculateProgressPercentage());
  }, [projectDeadline1]);
  const currentDate = new Date();
  const calculateProgressPercentage = () => {
    const projectStartDate = new Date(projectStartDate1);
    const projectDeadline = new Date(projectDeadline1);

    if (currentDate < projectStartDate) {
      return 0;
    } else if (currentDate > projectDeadline) {
      return 100;
    } else {
      const totalDuration = projectDeadline - projectStartDate;
      const remainingTime = projectDeadline - currentDate;
      const progressPercentage =
        ((totalDuration - remainingTime) / totalDuration) * 100;
      return Math.min(Math.max(progressPercentage, 0), 100);
    }
  };
  async function FetchData() {
    const Projects = await ProjectService.FcnGetAllProjects();
    const Projectsresult = Projects.data;
    setProjects(Projectsresult.item);
    var projectManagerResponse =
      await AdminDashboardServices.GetProjectManager();
    setProjectManagers(projectManagerResponse.item);

    const userDetails = JSON.parse(localStorage.getItem("sessionData"));
    setSessiondata(userDetails.employee.role.name);
    var response1 = await AdminDashboardServices.fcngetEmployees();
    setEmployees(response1.item);
    var response = await ProjectService.FcnProjectInfo(ProjectID);
    var result = response.data;
    if (result.isSuccess === true) {
      setClientValues(result.item.client);
      setProjectValues(result.item.project);
      setStatus(result.item.project.status);
      setProjectprogress(result.item.project.progress);
      setReportingManagerId(result.item.project.projectManager);
      setProjectEmployees(result.item.employeeProject);
      setProjectManagerName(result.item.projectMangerName);
      setprojectStartDate(result.item.project.startDate);
      setprojectDeadline(result.item.project.endDate);
    }
    var response = await AdminDashboardServices.fcngetEmployees();
    setEmployeelist(response.item);
    var response = await AdminDashboardServices.FcnGetAllClients();
    var result = response.item;
    setClients(result);
  }

  const handleManagerOnChange = (event) => {
    const selectedManagerId = event.target.value;
    setReportingManagerId(selectedManagerId);
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const setIsImportPopupOpenfunction = () => {
    setIsImportPopupOpen(!ImportPopup);
  };
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
  };
  const handleProgressChange = (event) => {
    const selectedProgress = event.target.value;
    setProjectprogress(selectedProgress);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = projectEmployess.filter((project) => {
    return (
      project.employee.employeeId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const updateEmployee = () => {
    setisOpen(true);
  };
  const handleEditClose = () => {
    setisOpen(false);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setProjectValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const UpdateProjectDetails = async () => {
    var response = await AdminDashboardServices.fcnUpdateProject(ProjectValues);
    if (response.isSuccess) {
      setisOpen(false);
      FetchData();
    }
  };

  const handleClosePopup = () => {
    setopen(false);
  };

  const toggleIcon = (e, index, id) => {
    setSelectedRowIds((prevSelectedRowIds) => {
      let newSelectedRowIds;
      if (id) {
        if (!prevSelectedRowIds.includes(id)) {
          newSelectedRowIds = [...prevSelectedRowIds, id];
        } else {
          newSelectedRowIds = prevSelectedRowIds.filter(
            (selectedId) => selectedId !== id
          );
        }
      } else {
        const rowId = obj[index].id;
        newSelectedRowIds = prevSelectedRowIds.filter(
          (selectedId) => selectedId !== rowId
        );
      }

      setIds(
        newSelectedRowIds.map((selectedId) => ({ employeeid: selectedId }))
      );

      return newSelectedRowIds;
    });
  };

  const addNewemployee = async () => {
    if (!Employeeids || Employeeids.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    const requestBody = [
      {
        employeeids: Employeeids,
        id: ProjectValues.id,
      },
    ];
    console.log(requestBody, "request body");
    var response = await ProjectService.fcnAssignEmployee(requestBody);
    if (response.isSuccess) {
      setassignedNewEmployeePopup(true);
      FetchData();
      setopen(false);
      setIds([]);
    }
  };
  const filteredEmployees1 = GetAllemployees.filter(
    (obj) =>
      obj.employee &&
      (obj.employee.firstName.toLowerCase().includes(searchQuery1) ||
        obj.employee.lastName.toLowerCase().includes(searchQuery1) ||
        obj.employee.employeeId.toString().includes(searchQuery1) ||
        obj.role.name.toLowerCase().includes(searchQuery1))
  );
  const Addemployeefunction = () => {
    setopen(true);
    filteredEmployees1.filter((el) => {
      if (
        projectEmployess.filter((proj) => proj.employee.id === el.employee.id)
          .length > 0
      ) {
        el.employee.isAlreadyAdded = true;
      } else {
        el.employee.isAlreadyAdded = false;
      }
    });
  };

  const handleSearchChange1 = (e) => {
    setSearchQuery1(e.target.value.toLowerCase());
  };
  async function handleDelete(id, projectid) {
    var response = await AdminDashboardServices.DeleteEmployeefcn(
      id,
      projectid
    );

    if (response.isSuccess) {
      setdeleteEmployeepopup(true);
    }
  }
  const closeDeletePopup = () => {
    setdeleteEmployeepopup(false);
    FetchData();
  };
  const closeAssignedPopup = () => {
    setassignedNewEmployeePopup(false);
  };
  const DownloadExcel = async (listtype, filetype, projectId) => {
    let response;
    try {
      response = await ProjectService.FcnExportProjectEmployees(
        listtype,
        filetype,
        projectId
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      const fileName = `${listtype}_data.${
        filetype === "pdf" ? "pdf" : "xlsx"
      }`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <div className="viewProject-Main-div">
      <div className="view-Project">Project Details</div>
      <div className="view-project-div" style={{ paddingTop: "0" }}>
        <div className="row update-button-row">
          <div className="col-10"></div>
          <div className="col-2 button-col">
            {(userDetails.employee.role.name === "Admin" ||
              userDetails.employee.role.name === "Project Manager") && (
              <button
                className="update-button"
                onClick={(e) => updateEmployee()}
              >
                Update
              </button>
            )}
          </div>
        </div>
        <div className="row m-0 project-view-row text-center text-md-start align-items-start">
          <div className="col-12 col-md-4 mb-3">
            <p
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Project Outline
            </p>
            <div
              style={{ position: "relative", width: "100%", height: "36px" }}
            >
              <span
                className="Progress_percentage"
                style={{
                  position: "absolute",
                  left: `${Math.round(progressPercentage)}%`,
                  top: "-6px",
                  transform: "translateX(-50%)",
                  color: progressPercentage === 100 ? "white" : "black",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginLeft: "18px",
                }}
              >
                {Math.round(progressPercentage)}%
              </span>
              <input
                style={{
                  width: "100%",
                  marginTop: "10px",
                  pointerEvents: "none",
                  backgroundColor: "#00CC1B",
                }}
                type="range"
                value={progressPercentage}
                readOnly
                max="100"
                min="0"
              />
            </div>
          </div>
          <div className="col-6 col-md-2 mb-3">
            <p
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Start Date
            </p>
            <p style={{ fontSize: "14px", margin: 0, color: "black" }}>
              {ProjectValues.startDate}
            </p>
          </div>
          <div className="col-6 col-md-2 mb-3">
            <p
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              End Date
            </p>
            <p style={{ fontSize: "14px", margin: 0, color: "black" }}>
              {ProjectValues.endDate}
            </p>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <p
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Project Manager
            </p>
            <p style={{ fontSize: "14px", margin: 0, color: "black" }}>
              {projectManagername}
            </p>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <p
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Project Lead
            </p>
            <p style={{ fontSize: "14px", margin: 0, color: "black" }}>
              {projectManagername}
            </p>
          </div>
        </div>

        <div
          className="row m-0 project-view-row"
          style={{ paddingTop: "45px" }}
        >
          <div className="col-6 col-md-2 mb-2 mb-md-0">
            <p style={{ fontSize: "14px", textTransform: "uppercase" }}>
              Client
            </p>
            <p
              style={{
                fontWeight: "500",
                fontSize: "14px",
                margin: 0,
                color: "black",
              }}
            >
              {clientvalues.clientName}
            </p>
          </div>
          <div className="col-6 col-md-2 mb-2 mb-md-0">
            <p style={{ fontSize: "14px", textTransform: "uppercase" }}>
              Client Email
            </p>
            <p
              style={{
                fontWeight: "500",
                fontSize: "14px",
                margin: 0,
                color: "black",
              }}
            >
              {clientvalues.clientEmailId}
            </p>
          </div>
          <div className="col-6 col-md-2 mb-2 mb-md-0 ">
            <p
              style={{ fontSize: "14px", textTransform: "uppercase" }}
              className="ms-5"
            >
              Project Name
            </p>
            <p
              className="ms-5"
              style={{
                fontWeight: "500",
                fontSize: "14px",
                margin: 0,
                color: "black",
              }}
            >
              {ProjectValues.projectName}
            </p>
          </div>
        </div>
        <div
          className="row project-view-row m-0 "
          style={{ paddingTop: "70px" }}
        >
          <div className="col-12">
            <p style={{ fontSize: "14px", textTransform: "uppercase" }}>
              Description
            </p>
          </div>
        </div>
        <div className="row m-0  pe-3" style={{ paddingTop: "45px" }}>
          <div
            className="col-12"
            style={{ fontWeight: "500", fontSize: "14px" }}
          >
            {ProjectValues.description}
          </div>
        </div>
        <div className="row underline-button-row"></div>
        <div className="row m-0" style={{ paddingTop: "15px" }}>
          <div className="col-2 col-md-6 col-lg-3">
            <p className="projectPrpgress"> Project Team Members</p>
          </div>

          <div
            className="col-3 col-md-6 col-lg-4"
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                className="searchinput"
                placeholder="Search employee"
                onChange={handleSearchChange}
                value={searchQuery}
                style={{
                  width: "100%",
                  padding: "5px 30px 5px 5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              <i
                className="bi bi-search"
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  right: "10px",
                  color: "#888",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
          </div>
          {/* {userDetails.employee.role.name === "Admin" ||
          userDetails.employee.role.name === "Project Manager" ? (
            <div className="col-3 col-md-3 col-lg-1"></div>
          ) : (
            <div className="col-5 col-md-4 col-lg-2"></div>
          )} */}
          {userDetails.employee.role.name !== "Admin" &&
            userDetails.employee.role.name !== "Project Manager" && (
              <div className="col-5 col-md-4 col-lg-1"></div>
            )}

          {(userDetails.employee.role.name === "Admin" ||
            userDetails.employee.role.name === "Project Manager") && (
            <div
              className="col-1 col-md-2 col-lg-1"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <button
                style={{ fontSize: "14px", height: "36px" }}
                className="btn btn-primary btn-import"
                onClick={() => setIsImportPopupOpen(true)}
              >
                Import
              </button>
            </div>
          )}
          <div
            className="col-2 col-md-2 col-lg-1"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="importdropdown btn btn-primary"
                style={{ fontSize: "14px", height: "36px" }}
              >
                Export To
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ paddingTop: "10px" }}>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "excel", ProjectID)}
                >
                  <p
                    className=""
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    MS Excel
                  </p>
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ marginTop: "5px" }}
                  onClick={() => DownloadExcel("employees", "pdf", ProjectID)}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {(userDetails.employee.role.name === "Admin" ||
            userDetails.employee.role.name === "Project Manager") && (
            <div
              className="col-2 col-md-3 col-lg-3"
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                style={{
                  display: "flex",
                  width: "auto",
                  alignContent: "center",
                  justifyContent: "center",
                  padding: "2px",
                  height: "36px",
                }}
                className="add-new-project-button"
                onClick={Addemployeefunction}
              >
                <span>
                  <img
                    src={userimage}
                    alt=""
                    height="18px"
                    width="18px"
                    className="mb-1"
                  />
                </span>
                <span
                  className=" ms-1"
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Add Employee
                </span>
              </button>
            </div>
          )}
        </div>
        {/* <div className="row m-0 py-2 gx-2 gy-2 flex-wrap align-items-center">
          <div className="col-12 col-md-3 col-lg-2">
            <p className="projectPrpgress mb-0">Project Team Members</p>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="position-relative d-flex align-items-center">
              <input
                type="text"
                className="searchinput form-control"
                placeholder="Search employee"
                onChange={handleSearchChange}
                value={searchQuery}
                style={{
                  padding: "5px 30px 5px 10px",
                  fontSize: "14px",
                }}
              />
              <i
                className="bi bi-search position-absolute"
                style={{
                  right: "10px",
                  fontSize: "18px",
                  color: "#888",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
          </div>

          {(userDetails.employee.role.name === "Admin" ||
            userDetails.employee.role.name === "Project Manager") && (
            <div className="col-6 col-md-4 col-lg-1 d-flex justify-content-md-end">
              <button
                className="btn btn-primary w-100"
                style={{ fontSize: "14px", height: "36px" }}
                onClick={() => setIsImportPopupOpen(true)}
              >
                Import
              </button>
            </div>
          )}

          <div className="col-6 col-md-4 col-lg-2 d-flex justify-content-md-start">
            <Dropdown className="w-100">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="btn btn-primary"
                style={{ fontSize: "14px", height: "36px" }}
              >
                Export To
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "excel", ProjectID)}
                >
                  MS Excel
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "pdf", ProjectID)}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {(userDetails.employee.role.name === "Admin" ||
            userDetails.employee.role.name === "Project Manager") && (
            <div className="col-12 col-md-4 col-lg-2 d-flex justify-content-md-center">
              <button
                className="add-new-project-button btn btn-light w-100 d-flex align-items-center justify-content-center"
                style={{ height: "36px", fontSize: "14px", fontWeight: "bold" }}
                onClick={Addemployeefunction}
              >
                <img
                  src={userimage}
                  alt=""
                  height="18px"
                  width="18px"
                  className="me-2"
                />
                Add Employee
              </button>
            </div>
          )}
        </div> */}

        <div style={{ padding: "10px", paddingBottom: "35px" }}>
          <table
            id="example"
            className="employeeTable m-0 p-0"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ fontSize: "14px", fontWeight: "500" }}>
                  Employee ID
                </th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>Name</th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>Email</th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>
                  Mobile Number
                </th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>Role</th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>
                  Project Manager
                </th>
                <th style={{ fontSize: "14px", fontWeight: "500" }}>
                  Assigned Date
                </th>
                {(userDetails.employee.role.name === "Admin" ||
                  userDetails.employee.role.name === "Project Manager") && (
                  <th style={{ fontSize: "14px", fontWeight: "500" }}>
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ fontSize: "14px" }}>
                      {employee.employee.employeeId}
                    </td>
                    <td
                      style={{ fontSize: "14px" }}
                    >{`${employee.employee.firstName} ${employee.employee.lastName} `}</td>
                    <td style={{ fontSize: "14px" }}>
                      {employee.employee.email}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      {employee.employee.mobileNo}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      {employee.employee.role.name}
                    </td>
                    <td style={{ fontSize: "14px" }}>{projectManagername}</td>
                    <td style={{ fontSize: "14px" }}>
                      {new Date(employee.assignedDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    {(userDetails.employee.role.name === "Admin" ||
                      userDetails.employee.role.name === "Project Manager") && (
                      <td>
                        <img
                          src={deleteImage}
                          alt=""
                          style={{
                            width: "28px",
                            height: "28px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleDelete(
                              employee.employee.id,
                              employee.project.id
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>No Records Found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ImportPopup isOpen={isPopupOpen} handleClose={togglePopup} />
        <ImportProjectEmployees
          IsProjectOpen1={isImportPopupOpen}
          handleClose1={setIsImportPopupOpenfunction}
        />
      </div>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modalheader">
              <h2
                className="employeeDetailsContent"
                style={{ fontSize: "14px" }}
              >
                Update Project Details
              </h2>
              <span className="cancelicon1">
                <i
                  className="bi bi-x-lg"
                  onClick={handleEditClose}
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                ></i>
              </span>
            </div>

            <div
              className="row  "
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="Project ID"
                  variant="outlined"
                  name="projectID"
                  onChange={handleOnChange}
                  value={ProjectValues.projectID || ""}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Projects && Projects.length > 0 ? (
                    Projects.map((project, index) => (
                      <MenuItem key={index} value={project.project.projectID}>
                        <span style={{ fontSize: "14px" }}>
                          {project.project.projectID}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Employees Found</MenuItem>
                  )}
                </TextField>
              </div>

              <div className="col-4">
                <TextField
                  label="Start Date"
                  variant="outlined"
                  type="date"
                  name="startDate"
                  value={
                    ProjectValues.startDate
                      ? new Date(ProjectValues.startDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleOnChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
              <div className="col-4">
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={
                    ProjectValues.endDate
                      ? new Date(ProjectValues.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleOnChange}
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="ProjectName"
                  value={ProjectValues.projectName || ""}
                  onChange={handleOnChange}
                  variant="outlined"
                  name="projectName"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
              <div className="col-4">
                <TextField
                  label="Project Referance ID"
                  variant="outlined"
                  name="projectRefId"
                  value={ProjectValues.projectRefId || ""}
                  onChange={handleOnChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>

              <div className="col-4">
                <TextField
                  label="Client Email"
                  variant="outlined"
                  name="clientId"
                  value={ProjectValues.clientId}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select/Add Client</em>
                  </MenuItem>
                  {clients && clients.length > 0 ? (
                    clients.map((client, index) => (
                      <MenuItem key={client.id} value={client.id}>
                        <span style={{ fontSize: "14px" }}>
                          {" "}
                          {client.clientEmailId}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Client Found</MenuItem>
                  )}
                </TextField>
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="Project Manager"
                  variant="outlined"
                  name="projectManager"
                  onChange={handleOnChange}
                  value={ProjectValues.projectManager || ""}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {employeelist && employeelist.length > 0 ? (
                    employeelist.map((emp) => (
                      <MenuItem key={emp.employee.id} value={emp.employee.id}>
                        <span style={{ fontSize: "14px" }}>
                          {emp.employee.firstName} {emp.employee.lastName}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Employees Found</MenuItem>
                  )}
                </TextField>
              </div>
              <div className="col-4">
                <TextField
                  label="Status"
                  variant="outlined"
                  name="status"
                  value={ProjectValues.status}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value={1} style={{ fontSize: "14px" }}>
                    Active
                  </MenuItem>
                  <MenuItem value={0} style={{ fontSize: "14px" }}>
                    InActive
                  </MenuItem>
                </TextField>
              </div>
              <div className="col-4">
                <TextField
                  label="Progress"
                  variant="outlined"
                  name="progress"
                  value={ProjectValues.progress}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "36px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value={10} style={{ fontSize: "14px" }}>
                    10%
                  </MenuItem>
                  <MenuItem value={20} style={{ fontSize: "14px" }}>
                    20%
                  </MenuItem>
                  <MenuItem value={30} style={{ fontSize: "14px" }}>
                    30%
                  </MenuItem>
                  <MenuItem value={40} style={{ fontSize: "14px" }}>
                    40%
                  </MenuItem>
                  <MenuItem value={50} style={{ fontSize: "14px" }}>
                    50%
                  </MenuItem>
                  <MenuItem value={60} style={{ fontSize: "14px" }}>
                    60%
                  </MenuItem>
                  <MenuItem value={70} style={{ fontSize: "14px" }}>
                    70%
                  </MenuItem>
                  <MenuItem value={80} style={{ fontSize: "14px" }}>
                    80%
                  </MenuItem>
                  <MenuItem value={90} style={{ fontSize: "14px" }}>
                    90%
                  </MenuItem>
                  <MenuItem value={100} style={{ fontSize: "14px" }}>
                    100%
                  </MenuItem>
                </TextField>
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-12">
                <TextField
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={ProjectValues.description || ""}
                  onChange={handleOnChange}
                  className="textareaclass"
                  fullWidth
                  multiline
                  rows={1}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                        height: "80px",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "40px",
                      padding: "10px 12px",
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1.1rem",
                      transform: "translate(8px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "13px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
            </div>
            <div
              className=" row"
              style={{
                marginTop: "50px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <button
                  className="EditformSubmit"
                  onClick={UpdateProjectDetails}
                >
                  <span className="editformspan">Save</span>
                </button>
                <button
                  className="EditformCancel ms-2"
                  onClick={handleEditClose}
                >
                  <span className="editformcacelspan">Cancel</span>
                </button>
              </div>
              <div className="col-8"></div>
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h2 className="dialog-title" style={{ fontSize: "16px" }}>
                Add Employees
              </h2>
              <span className="dialog-close">
                <i
                  className="bi bi-x-lg"
                  onClick={handleClosePopup}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </div>

            <div className="row m-0 pb-3">
              <div className="col-3"></div>
              <div
                className="col-6"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "15px",
                }}
              >
                <input
                  type="text"
                  className="searchinput"
                  placeholder="Search employees"
                  onChange={handleSearchChange1}
                  value={searchQuery1}
                  style={{
                    fontSize: "14px",
                    padding: "0px 10px",
                    height: "36px",
                    width: "100%",
                    paddingRight: "30px",
                    boxSizing: "border-box",
                  }}
                />
                <i
                  className="bi bi-search"
                  style={{
                    fontSize: "18px",
                    position: "absolute",
                    right: "20px",
                    top: "68%",
                    transform: "translateY(-50%)",
                    color: "#888",
                    pointerEvents: "none",
                  }}
                ></i>
              </div>
              <div className="col-3"></div>
            </div>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                overflowX: "hidden",

                padding: "0px 10px",
              }}
            >
              <table
                className="employeeTable1"
                style={{
                  width: "100%",

                  position: "relative",
                }}
              >
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
                      Employee ID
                    </th>
                    <th style={{ fontSize: "14px" }}>Name</th>
                    <th style={{ fontSize: "14px" }}>Role</th>
                    <th className="" style={{ fontSize: "14px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="fixed_header tbody">
                  {filteredEmployees1.map((obj, index) =>
                    !obj.employee.isAlreadyAdded ? (
                      <tr
                        key={obj.employee.id}
                        className={
                          selectedRowIds.includes(obj.employee.id)
                            ? "selected-row  tablebody"
                            : ""
                        }
                      >
                        <td
                          className="data"
                          style={{ padding: "0px 8px", fontSize: "14px" }}
                        >
                          {obj.employee.employeeId}
                        </td>
                        <td
                          className="data"
                          style={{ fontSize: "14px" }}
                        >{`${obj.employee.firstName}   ${obj.employee.lastName}`}</td>
                        <td className="data" style={{ fontSize: "14px" }}>
                          {obj.role.name}
                        </td>
                        <td
                          style={{ width: "20px", fontSize: "14px" }}
                          className="data"
                        >
                          {selectedRowIds.includes(obj.employee.id) ? (
                            <RxCross2
                              onClick={(e) =>
                                toggleIcon(e, index, obj.employee.id)
                              }
                              className="cancleemployee"
                              style={{
                                cursor: "pointer",
                                color: "red",
                                width: "27px",
                                height: "28px",
                              }}
                            />
                          ) : (
                            <img
                              src={pulusimage}
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                toggleIcon(e, index, obj.employee.id)
                              }
                              alt=""
                              width="30px"
                              height="30px"
                            />
                          )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="dialog-footer"
              style={{
                borderTop: "1px solid #ddd",
                padding: "10px 20px",
                textAlign: "right",
              }}
            >
              <button
                className="dialog-submit-btn"
                onClick={addNewemployee}
                style={{ height: "36px" }}
              >
                <span style={{ fontSize: "14px" }}>Add</span>
              </button>
            </div>
          </div>

          <ToastContainer position="top-end" autoClose={5000} />
        </div>
      )}
      {deleteemployeepopup && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={chechimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={elipsimage}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              Employee has been successfully deleted!
            </h2>
            <p className="unique-popup-message">Click OK to view result</p>
            <button className="unique-popup-button" onClick={closeDeletePopup}>
              OK
            </button>
          </div>
        </div>
      )}
      {assignedNewEmployeePopup && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={chechimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={elipsimage}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              Employee has been successfully assigned to the project!
            </h2>
            <p className="unique-popup-message">Click OK to view result</p>
            <button
              className="unique-popup-button"
              onClick={closeAssignedPopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
