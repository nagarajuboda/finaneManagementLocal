import { useState, useEffect } from "react";
import "../../../assets/Styles/AddProject.css";
import { Link, useNavigate } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import axios from "axios";
import { Textarea } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../../../assets/Images/plus.png";
import Modal from "react-bootstrap/Modal";
import { AddClientValidation } from "./AddClientValidation";
import AdminDashboardServices from "../../../Service/AdminService/AdminDashboardServices";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import withReactContent from "sweetalert2-react-content";
import { IoArrowBackCircle } from "react-icons/io5";
import { AddProjectFormValidation } from "./AddProjectFormValidation";
import { Description } from "@mui/icons-material";
import "select2/dist/css/select2.min.css";

import "select2/dist/js/select2.full.min.js";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
} from "@mui/material";
import ellips from "../../../assets/Images/Ellipse.png";
import checkimage from "../../../assets/Images/check.png";
import ProjectService from "../../../Service/AdminService/ProjectService";

export default function AddProject() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [AllCurrency, SetAllCurrency] = useState([]);
  const [AllDepartments, SetAllDepartments] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [AddClientpopup, setAddclientPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [isopen, setisOpen] = useState(false);
  useEffect(() => {
    fetchData();
    FetchCurrency();
  }, [selectedDate]);
  const [values, setValues] = useState({
    ClientName: "",
    ClientEmailId: "",
    ClientLocation: "",
    ReferenceName: "",
    ProjectID: "",
    ProjectName: "",
    currencyType: "",
    StartDate: "",
    ClientEmail: "",
    id: "",
    Description: "",
    EndDate: "",
    ProjectRefId: "",
    ProjectType: "",
    Progress: 0,
    departmentTeam: "",
    ProjectManager: "",
  });
  const [errors, setErrors] = useState({
    ClientName: "",
    ClientEmailId: "",
    ClientLocation: "",
  });
  const [errorss, setErrorss] = useState({
    ProjectID: "",
    ProjectName: "",
    Department: "",
    currencyType: "",
    ProjectType: "",
    departmentTeam: "",
    ProjectManager: "",
    Description: "",
    ClientEmail: "",
    EndDate: "",
    StartDate: "",
  });
  const handleSelectedDate = (newDate) => {
    setValues({
      ...values,
      StartDate: newDate ? newDate.format("MM/DD/YYYY") : "",
    });
  };
  const handleSelectedEndDate = (newDate) => {
    setValues({
      ...values,
      EndDate: newDate ? newDate.format("MM/DD/YYYY") : "",
    });
  };

  async function FetchCurrency() {
    var CurrencyResponse = await AdminDashboardServices.GetAllCurrency();
    SetAllCurrency(CurrencyResponse.item);

    var getallDepartments = await AdminDashboardServices.GetAllDepartments();
    SetAllDepartments(getallDepartments.item);
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "Department") {
      if (value === "") {
        setFilteredTeams([]);
      } else {
        const selectedDepartment = AllDepartments.find(
          (dept) => dept.deptName === value
        );

        const response = await ProjectService.FcnAddSelectedDept(
          selectedDepartment.id
        );
        setFilteredTeams(response.item);
      }
    }

    setValues({
      ...values,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: AddClientValidation(name, value),
    });

    setErrorss({
      ...errorss,
      [name]: AddProjectFormValidation(name, value),
    });
  };

  async function formSubmit(e) {
    e.preventDefault();
    const newErrors = {
      ProjectID: AddProjectFormValidation(
        "ProjectID",
        values.ProjectID,
        values
      ),
      ProjectName: AddProjectFormValidation(
        "ProjectName",
        values.ProjectName,
        values
      ),
      currencyType: AddProjectFormValidation(
        "currencyType",
        values.currencyType,
        values
      ),
      Description: AddProjectFormValidation(
        "Description",
        values.Description,
        values
      ),
      Department: AddProjectFormValidation(
        "Department",
        values.Department,
        values
      ),
      departmentTeam: AddProjectFormValidation(
        "departmentTeam",
        values.departmentTeam,
        values
      ),
      ClientEmail: AddProjectFormValidation(
        "ClientEmail",
        values.ClientEmail,
        values
      ),
      ProjectManager: AddProjectFormValidation(
        "ProjectManager",
        values.ProjectManager,
        values
      ),
      StartDate: AddProjectFormValidation(
        "StartDate",
        values.StartDate,
        values
      ),
      EndDate: AddProjectFormValidation("EndDate", values.EndDate, values),
    };
    setErrorss(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      var obj = {
        project: {
          ProjectID: values.ProjectID,
          ProjectName: values.ProjectName,
          currencyType: values.currencyType,
          Description: values.Description,
          clientId: null,
          departmentTeam: null,
          StartDate: values.StartDate,
          EndDate: values.EndDate,
          ProjectRefId: values.ProjectRefId,
          ProjectType: values.ProjectType,
          Progress: values.Progress,
        },
        clientemail: values.ClientEmail,

        ProjectManager: values.ProjectManager,
        DepartmentTeam: values.departmentTeam,
        Department: values.Department,
      };

      var response = await AdminDashboardServices.fcnAddProject(obj);

      if (response.isSuccess === true) {
        setisOpen(true);
      } else {
        toast.error(response.error.message, {
          position: "top-right",
          autoClose: "4000",
        });
      }
    }
  }
  const navigantetoAllProjects = () => {
    setisOpen(false);
    navigate("/Dashboard/All/Projects/");
  };
  const ClientPopup = () => {
    setAddclientPopup(true);
  };
  async function fetchData() {
    try {
      var response1 = await AdminDashboardServices.fcngetEmployees();
      setEmployees(response1.item);
      var response = await AdminDashboardServices.FcnGetAllClients();
      var result = response.item;
      setClients(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const closeModal = () => {
    setValues({
      ClientName: "",
      ClientEmailId: "",
      file: "",
      ClientLocation: "",
      ReferenceName: "",
    });
    setAddclientPopup(false);
  };
  const clearprojectvalues = () => {
    setValues({
      ProjectID: "",
      ProjectName: "",
      currencyType: "",
      StartDate: "",
      ClientEmail: "",

      Description: "",
      EndDate: "",

      departmentTeam: "",
      ProjectManager: "",
    });
  };
  async function AddClientFormSubmit(e) {
    e.preventDefault();
    const newErrors = {
      ClientName: AddClientValidation("ClientName", values.ClientName),
      ClientEmailId: AddClientValidation("ClientEmailId", values.ClientEmailId),

      ClientLocation: AddClientValidation(
        "ClientLocation",
        values.ClientLocation
      ),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      const obj = {
        ClientName: values.ClientName,
        ClientEmailId: values.ClientEmailId,
        ClientLocation: values.ClientLocation,
        ReferenceName: values.ReferenceName,
      };

      var response = await AdminDashboardServices.fcnAddClientAsync(obj);

      if (response.isSuccess === true) {
        setValues({
          ClientName: "",
          ClientEmailId: "",
          file: "",
          ClientLocation: "",
          ReferenceName: "",
        });

        fetchData();
        setAddclientPopup(false);
      } else {
        toast.error(response.error.message, {
          position: "top-right",
          autoClose: "4000",
        });
      }
    }
  }
  const [message, setMessage] = useState("");
  return (
    <div className="addProjectMainDiv">
      <div>
        <p className="addNewProjectHeader">add New Project</p>
      </div>
      <div className="carddiv">
        <form onSubmit={formSubmit}>
          <div className="row m-0" style={{ paddingTop: "30px" }}>
            <div className="col-3 col-12 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Project ID"
                placeholder="12"
                variant="outlined"
                name="ProjectID"
                value={values.ProjectID}
                onChange={handleChange}
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
                className="custom-text-field"
              />
              {errorss.ProjectID && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.ProjectID}
                </span>
              )}
            </div>
            <div className="col-3 col-12 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Project Name"
                placeholder="loreum ipsum"
                variant="outlined"
                name="ProjectName"
                value={values.ProjectName}
                onChange={handleChange}
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
                className="custom-text-field"
              />
              {errorss.ProjectName && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.ProjectName}
                </span>
              )}
            </div>
            <div className="col-3 col-12 col-md-12 col-lg-3 mb-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Project Start date & Time"
                  className="datepicker-custom"
                  onChange={handleSelectedDate}
                  value={selectedDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={"01/16/2024 04:00 AM"}
                      variant="outlined"
                      className="DatePicker-placeholder"
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
                  )}
                />
              </LocalizationProvider>
              {errorss.StartDate && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.StartDate}
                </span>
              )}
            </div>
            <div className="col-3 col-12 col-md-12 col-lg-3 mb-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Project End date & Time"
                  className="datepicker-custom"
                  onChange={handleSelectedEndDate}
                  value={selectedDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="MM/DD/YYYY"
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
                  )}
                />
              </LocalizationProvider>
              {errorss.EndDate && (
                <span
                  className="error "
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.EndDate}
                </span>
              )}
            </div>
          </div>
          <div className="row m-0" style={{ paddingTop: "33px" }}>
            <div
              className="row m-0 col-2 col-10 col-md-12 col-lg-2 mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <TextField
                label="Client"
                variant="outlined"
                name="ClientEmail"
                value={values.clientEmailId}
                onChange={handleChange}
                fullWidth
                select
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
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
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select/Add Client</em>
                </MenuItem>
                {clients && clients.length > 0 ? (
                  clients.map((client, index) => (
                    <MenuItem key={client.id} value={client.clientEmailId}>
                      <span style={{ fontSize: "14px" }}>
                        {client.clientName}
                      </span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Client Found</MenuItem>
                )}
              </TextField>

              {errorss.ClientEmail && (
                <span
                  className="error  "
                  style={{
                    color: "red",
                    fontSize: "13px",
                    padding: " 0px 1px",
                  }}
                >
                  {errorss.ClientEmail}
                </span>
              )}
            </div>
            <div className="col-1 ">
              <img
                src={image}
                className=""
                alt=""
                width="40px"
                height="40px"
                style={{ cursor: "pointer" }}
                onClick={ClientPopup}
              />
            </div>
            <div className="col-3  col-10 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Project Manager"
                variant="outlined"
                name="ProjectManager"
                value={values.ProjectManager}
                onChange={handleChange}
                fullWidth
                select
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
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
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {employees && employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <MenuItem key={emp.employee.id} value={emp.employee.email}>
                      <span style={{ fontSize: "14px" }}>
                        {emp.employee.firstName}
                        {emp.employee.lastName}
                      </span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Employees Found</MenuItem>
                )}
              </TextField>
              {errorss.ProjectManager && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.ProjectManager}
                </span>
              )}
            </div>
            <div className="col-3 col-3 col-10 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Department"
                placeholder="Enter your Role"
                variant="outlined"
                name="Department"
                value={values.Department}
                onChange={handleChange}
                fullWidth
                select
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
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
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {AllDepartments && AllDepartments.length > 0 ? (
                  AllDepartments.map((dept, index) => (
                    <MenuItem key={dept.id} value={dept.deptName}>
                      <span style={{ fontSize: "14px" }}> {dept.deptName}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Departments Found</MenuItem>
                )}
              </TextField>
              {errorss.Department && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.Department}
                </span>
              )}
            </div>
            <div className="col-3  col-10 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Team"
                placeholder="Enter your Role"
                variant="outlined"
                name="departmentTeam"
                value={values.Team}
                onChange={handleChange}
                fullWidth
                select
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
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
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {filteredTeams && filteredTeams.length > 0 ? (
                  filteredTeams.map((team, index) => (
                    <MenuItem key={team.id} value={team.teamName}>
                      <span style={{ fontSize: "14px" }}> {team.teamName}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Teams Found</MenuItem>
                )}
              </TextField>
              {errorss.departmentTeam && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.departmentTeam}
                </span>
              )}
            </div>
          </div>
          <div className="row m-0" style={{ paddingTop: "33px" }}>
            <div className="col-3  col-10 col-md-12 col-lg-3 mb-3">
              <TextField
                label="Currency"
                variant="outlined"
                name="currencyType"
                value={values.currencyType}
                onChange={handleChange}
                fullWidth
                select
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
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
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {AllCurrency && AllCurrency.length > 0 ? (
                  AllCurrency.map((currency, index) => (
                    <MenuItem key={currency.id} value={currency.type}>
                      <span style={{ fontSize: "14px" }}>{currency.type}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Currency Found</MenuItem>
                )}
              </TextField>
              {errorss.currencyType && (
                <span
                  className="error ms-1"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.currencyType}
                </span>
              )}
            </div>
          </div>
          <div className="row m-0" style={{ paddingTop: "33px" }}>
            <div className="col-12">
              <TextField
                label="Description"
                variant="outlined"
                name="Description"
                value={values.Description}
                onChange={handleChange}
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

                    transform: "translate(10px, 9px)",
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

              {errorss.Description && (
                <span
                  className="error "
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errorss.Description}
                </span>
              )}
            </div>
          </div>
          <div
            className="row m-0"
            style={{
              paddingTop: "50px",
              paddingBottom: "25px",
            }}
          >
            <div className="col-10"></div>
            <div
              className="col-2  col-10 col-md-6 col-lg-3 mb-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "35px",
              }}
            >
              <button className="addEmployeeSubmitbutton me-1 ">
                <span className="addemployeespan ">submit</span>
              </button>
              <button
                className="addemployeeResetbutton  "
                onClick={clearprojectvalues}
              >
                <span className="resetspan">reset</span>
              </button>
            </div>
          </div>
        </form>
        {AddClientpopup && (
          <div className="client-modal-overlay">
            <div className="client-modal-box">
              <div className="client-modal-header">
                <h2 className="headercontent" style={{ fontSize: "14px" }}>
                  Add Client Details
                </h2>
                <sapn className="cancelicon1">
                  <i
                    class="bi bi-x-lg"
                    onClick={closeModal}
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  ></i>
                </sapn>
              </div>
              <form onSubmit={AddClientFormSubmit}>
                <div className="client-modal-content">
                  <div className="row m-0 w-100" style={{ paddingTop: "5px" }}>
                    <div className="col-6">
                      <TextField
                        label="Client Name"
                        variant="outlined"
                        fullWidth
                        name="ClientName"
                        value={values.clientName}
                        onChange={handleChange}
                        className="custom-text-field"
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
                      {errors.ClientName && (
                        <span
                          className="error ms-1"
                          style={{ color: "red", fontSize: "13px" }}
                        >
                          {errors.ClientName}
                        </span>
                      )}
                    </div>
                    <div className="col-6">
                      <TextField
                        label="Client Email ID"
                        variant="outlined"
                        fullWidth
                        className="custom-text-field"
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
                        name="ClientEmailId"
                        value={values.ClientEmailId}
                        onChange={handleChange}
                      />

                      {errors.ClientEmailId && (
                        <span
                          className="error ms-1"
                          style={{ color: "red", fontSize: "13px" }}
                        >
                          {errors.ClientEmailId}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="row m-0 w-100" style={{ paddingTop: "18px" }}>
                    <div className="col-6">
                      <TextField
                        label="Client Referance"
                        variant="outlined"
                        name="ReferenceName"
                        value={values.ReferenceName}
                        onChange={handleChange}
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
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value="John">
                          <span style={{ fontSize: "14px" }}>John</span>
                        </MenuItem>
                        <MenuItem value="Sonu">
                          <span style={{ fontSize: "14px" }}>Sonu</span>
                        </MenuItem>
                      </TextField>
                    </div>
                    <div className="col-6">
                      <TextField
                        label="Client Location"
                        variant="outlined"
                        name="ClientLocation"
                        value={values.ClientLocation}
                        onChange={handleChange}
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
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value="USA">
                          <span style={{ fontSize: "14px" }}>USA</span>
                        </MenuItem>
                        <MenuItem value="UK">
                          <span style={{ fontSize: "14px" }}>UK</span>
                        </MenuItem>
                      </TextField>
                      {errors.ClientLocation && (
                        <span
                          className="error ms-1"
                          style={{ color: "red", fontSize: "13px" }}
                        >
                          {errors.ClientLocation}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="row m-0 w-100"
                    style={{ paddingTop: "5px", paddingBottom: "12px" }}
                  >
                    <div
                      className="col-4"
                      style={{ display: "flex", alignContent: "center" }}
                    >
                      <button
                        className="addclient-popup-submit-button"
                        style={{ height: "36px" }}
                      >
                        <span
                          className="addclient-popup-submit-button-span"
                          style={{ fontSize: "14px" }}
                        >
                          Add
                        </span>
                      </button>
                      <button
                        className="addclient-popup-Cancel-button ms-3 "
                        onClick={closeModal}
                        style={{ height: "36px" }}
                      >
                        <span
                          className="addclient-popup-Cancel-button-span"
                          style={{ fontSize: "14px" }}
                        >
                          cancel
                        </span>
                      </button>
                    </div>
                    <div className="col-8"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {isopen && (
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
            <h2 className="unique-popup-title">Added Project Successfully!</h2>
            <p className="unique-popup-message">
              Click OK to view added project
            </p>
            <button
              className="unique-popup-button"
              onClick={navigantetoAllProjects}
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
