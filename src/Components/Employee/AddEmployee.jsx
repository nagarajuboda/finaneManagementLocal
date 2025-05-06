import "../../assets/Styles/AddEmployee.css";
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import { Button, Box, Typography } from "@mui/material";
import checkimage1 from "../../assets/Images/cancelbutton.png";
import "react-toastify/dist/ReactToastify.css";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import pulsimage from "../../assets/Images/plus.png";
import calendarimage from "../../assets/Images/calendar.png";
import { addEmployeeFormValidation } from "./addEmployeeFormValidation";
import AdminDashboardServices from "../../Service/AdminService/AdminDashboardServices";
import { ContentPasteSearchOutlined } from "@mui/icons-material";
import "../../assets/Styles/SuccessPopup.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ellips from "../../assets/Images/Ellipse.png";
import checkimage from "../../assets/Images/check.png";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import RolesService from "../../Service/AdminService/RolesService";
export default function AddEmployee() {
  const [isopen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProjectManager, setSelectedProjectManager] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [namesList, setNamesList] = useState([]);
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setName(e.target.value);
  };
  const addName = () => {
    if (name.trim() !== "") {
      setNamesList([...namesList, name]);
      setName("");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addName();
    }
  };
  const cancleSkill = (e, index, skill) => {
    setNamesList((prevLanguages) =>
      prevLanguages.filter((item) => item.trim() !== skill)
    );
  };

  const [values, setValues] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dateOfJoining: "",
    projectManager: "",
    role: "",
    skillSets: "",
  });
  const [errors, setErrors] = useState({
    employeeId: "",
    firstName: "",
    email: "",
    mobileNo: "",
    dateOfJoining: "",
    projectManager: "",
    role: "",
  });
  useEffect(() => {
    FeatchData();
  }, [selectedRole, selectedDate]);
  const formatDateToMMDDYYYY = (date) => {
    if (date && date.$d instanceof Date) {
      date = date.$d;
    } else if (date && date.$d) {
      date = new Date(date.$d);
    }

    if (!date || isNaN(date.getTime())) {
      return "";
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const formattedDate = formatDateToMMDDYYYY(selectedDate);

  const FeatchData = async () => {
    var response = await AdminDashboardServices.fcngetEmployees();
    const Rolesresponse = await RolesService.FcnGetRoles();
    var rolesResult = Rolesresponse.data;
    const activeRoles = rolesResult.filter((role) => role.status === "Active");
    setRoles(activeRoles);
    if (response.isSuccess) {
      setEmployees(response.item);
    }
  };
  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const ProjectManagerhandleChange = (event) => {
    setSelectedProjectManager(event.target.value);
  };

  const Handleonchnage = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: addEmployeeFormValidation(name, value),
    });
  };

  const closeSuccessPopup = () => {
    setIsOpen(false);
    navigate("/dashboard/Employees");
  };
  async function AddEmployeeForm(e) {
    e.preventDefault();

    const newErrors = {
      employeeId: addEmployeeFormValidation("employeeId", values.employeeId),
      firstName: addEmployeeFormValidation("firstName", values.firstName),
      lastName: addEmployeeFormValidation("lastName", values.lastName),
      email: addEmployeeFormValidation("email", values.email),
      mobileNo: addEmployeeFormValidation("mobileNo", values.mobileNo),
      role: addEmployeeFormValidation("role", values.role),
      selectedDate: addEmployeeFormValidation(
        "selectedDate",
        values.selectedDate
      ),
      dateOfJoining: addEmployeeFormValidation(
        "dateOfJoining",
        values.dateOfJoining
      ),
      projectManager: addEmployeeFormValidation(
        "projectManager",
        values.projectManager
      ),
    };
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      var obj = {
        Employee: {
          employeeId: values.employeeId,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobileNo: values.mobileNo,
          dateOfJoining: formattedDate,
          projectManagerId: values.projectManager,
          roleId: values.role,
          EmployeeStatus: "Active",
          skillSets: values.skillSets,
        },
        Skillsetlists: namesList,
      };

      setLoading(true);
      var response = await EmployeeService.AddEmployee(obj);
      if (response.isSuccess == true) {
        setLoading(false);
        setIsOpen(true);
      } else {
        setLoading(false);
        toast.error(response.error.message, {
          position: "top-right",
          autoClose: "4000",
        });
      }
    }
  }
  const ClearValues = () => {
    setValues({});
  };
  return (
    <div className="addemployeemaindiv">
      <div className="addemployeecontent">Add new Employee</div>
      <form onSubmit={AddEmployeeForm}>
        <div className="employeeformdiv">
          <div className="row  m-0" style={{ paddingTop: "15px" }}>
            <div className="col-3">
              <TextField
                label="Employee ID"
                placeholder="IARCXXXX"
                variant="outlined"
                name="employeeId"
                onChange={Handleonchnage}
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
                    transform: "translate(20px, 9px)",
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
                    transform: "translate(9px, -9px) scale(0.75)",
                  },
                  "& input::placeholder": {
                    fontSize: "13px",
                    color: "#AEAEAE",
                  },
                }}
              />

              {errors.employeeId && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "12px", color: "red" }}
                >
                  {errors.employeeId}
                </span>
              )}
            </div>
            <div className="col-3">
              <TextField
                label="FirstName"
                placeholder="loreum ipsum"
                variant="outlined"
                name="firstName"
                onChange={Handleonchnage}
                fullWidth
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
              />
              {errors.firstName && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="col-3">
              <TextField
                label="LastName"
                placeholder="loreum ipsum"
                variant="outlined"
                name="lastName"
                onChange={Handleonchnage}
                fullWidth
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
              />
            </div>
            <div className="col-3">
              <TextField
                label="Email ID"
                placeholder="name.surename@archents.com"
                variant="outlined"
                name="email"
                onChange={Handleonchnage}
                fullWidth
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
              />
              {errors.email && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.email}
                </span>
              )}
            </div>
          </div>
          <div className="row  m-0" style={{ paddingTop: "30px" }}>
            <div className="col-3">
              <TextField
                label="Mobile Number"
                placeholder="+91 XXXXXXXXXX"
                name="mobileNo"
                onChange={Handleonchnage}
                variant="outlined"
                fullWidth
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
              />

              {errors.mobileNo && (
                <span
                  className="error"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.mobileNo}
                </span>
              )}
            </div>
            <div className="col-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Joining"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    Handleonchnage({
                      target: { name: "dateOfJoining", value: newValue },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="MM/DD/YYYY"
                      variant="outlined"
                      // type="date"
                      fullWidth
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
                    />
                  )}
                />
              </LocalizationProvider>

              {errors.dateOfJoining && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.dateOfJoining}
                </span>
              )}
            </div>
            <div className="col-3">
              <TextField
                label="Role"
                placeholder="Enter your Role"
                variant="outlined"
                name="role"
                value={values.role}
                onChange={Handleonchnage}
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
                  <em>None</em>
                </MenuItem>
                {roles && roles.length > 0 ? (
                  roles.map((role, index) => (
                    <MenuItem key={index} value={role.id}>
                      <span style={{ fontSize: "14px" }}> {role.name}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Employees Found</MenuItem>
                )}
              </TextField>
              {errors.role && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.role}
                </span>
              )}
            </div>
            <div className="col-3">
              <TextField
                name="projectManager"
                value={values.projectManager}
                onChange={Handleonchnage}
                label="Reporting Manager"
                placeholder="Enter your Role"
                variant="outlined"
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
                  <em>None</em>
                </MenuItem>
                {employees && employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <MenuItem key={index} value={emp.employee.id}>
                      <span style={{ fontSize: "14px" }}>
                        {emp.employee.firstName} {emp.employee.lastName}
                      </span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Employees Found</MenuItem>
                )}
              </TextField>
              {/* {errors.projectManager && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.projectManager}
                </span>
              )} */}
            </div>
          </div>
          <div className="row m-0" style={{ paddingTop: "30px" }}>
            <div className="col-3" style={{ display: "flex" }}>
              <div>
                <TextField
                  label="Add Skill"
                  placeholder="Add Skills"
                  variant="outlined"
                  value={name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  width="245px"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      width: "245px",
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
                />
              </div>
              <div className=" col-1">
                <img
                  src={pulsimage}
                  alt=""
                  width="40px"
                  height="40px"
                  onClick={addName}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          <div
            className="row m-0"
            style={{
              paddingTop: "30px",
            }}
          >
            <div className="col-12">
              <div
                className="skillsetdiv"
                style={{
                  overflowY: "scroll",

                  resize: "none",
                  width: "100%",
                  border: "1px solid #ccc",
                  padding: "5px",
                  gap: "2px",

                  height: "70px",

                  borderRadius: "4px",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {namesList.map((name, index) => (
                  <div
                    key={index}
                    className="skillsetbox"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      className="ms-2 mt-3  "
                      style={{ fontSize: "14px", width: "auto" }}
                    >
                      {name}
                    </p>
                    <img
                      src={checkimage1}
                      alt=""
                      height="15px"
                      width="15px"
                      style={{ cursor: "pointer" }}
                      className="m-2"
                      onClick={(e) => cancleSkill(e, index, name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className=" m-0"
            style={{
              paddingTop: "25px ",
              paddingBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="col-10"></div>
            <div
              className="col-2"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {loading === false ? (
                <button
                  className=" addEmployeeSubmitbutton me-2 "
                  onSubmit={AddEmployeeForm}
                >
                  <span className="addemployeespan ">submit</span>
                </button>
              ) : (
                loading &&
                loading && (
                  <button
                    class="addEmployeeSubmitbutton1 me-2"
                    type="button"
                    disabled
                    style={{ color: "white" }}
                  >
                    <span
                      class="spinner-border spinner-border-sm "
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </button>
                )
              )}
              <button
                className="addemployeeResetbutton  "
                onClick={ClearValues}
              >
                <span className="resetspan">reset</span>
              </button>
            </div>
          </div>
        </div>
      </form>
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
            <h2 className="unique-popup-title">Employee Added Successfully</h2>
            <p className="unique-popup-message">Click OK to see the results</p>
            <button className="unique-popup-button" onClick={closeSuccessPopup}>
              OK
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-end" autoClose={5000} />
    </div>
  );
}
