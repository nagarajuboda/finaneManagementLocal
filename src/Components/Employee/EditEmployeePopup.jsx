import "../../assets/Styles/EditEmployeepopup.css";
// import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import pulsimage from "../../assets/Images/plus.png";
import AdminDashboardServices from "../../Service/AdminService/AdminDashboardServices";
import { Button, Box, Typography } from "@mui/material";
import checkimage1 from "../../assets/Images/cancelbutton.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { apiurl } from "../../Service/createAxiosInstance";
import RolesService from "../../Service/AdminService/RolesService";
const EditEmployeePopup = () => {
  const [employees, setEmployees] = useState([]);
  const [isopen, setopen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();
  const [empid, setempid] = useState("");
  const [role, setRoleName] = useState("");
  const [roleId, setRoleId] = useState("");
  // const [ReportingManagerid, setReportingManagerid] = useState("");
  const [ReportingManagerId, setReportingManagerId] = useState("");
  const [status, setStatus] = useState("InActive");
  const [namesList, setNamesList] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [employeelist, setEmployeelist] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [name, setName] = useState("");
  const employeeID = sessionStorage.getItem("EmployeeID");
  useEffect(() => {
    FeatchData();
    //setopen(isEditOpen);
  }, [employeeID]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  const [values, setValues] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dateOfJoining: "",
    employeeStatus: "",
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const FeatchData = async () => {
    var response = await AdminDashboardServices.fcngetEmployees();
    const Rolesresponse = await RolesService.FcnGetRoles();

    var rolesResult = Rolesresponse.data;
    const activeRoles = rolesResult.filter((role) => role.status === "Active");
    setRoleList(activeRoles);
    setEmployeelist(response.item);
    var getEmployeeResponse =
      await AdminDashboardServices.fcngetEmployeeDetails(employeeID);
    setEmployeeData(getEmployeeResponse.item.employee);
    setRoleName(getEmployeeResponse.item.getRole.name);
    setRoleId(getEmployeeResponse.item.getRole.id);
    setempid(getEmployeeResponse.item.employee.employeeId);
    setStatus(getEmployeeResponse.item.employee.employeeStatus);
    setReportingManagerId(getEmployeeResponse.item.reportingManager?.id || "");

    setEmployee(getEmployeeResponse.item.employee);
    setNamesList(getEmployeeResponse.item.getSkillsets);
  };

  const handleRoleOnChange = (event) => {
    const selectedRoleName = event.target.value;

    setRoleId(selectedRoleName);
  };
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
  };
  const handleInputChange11 = (e) => {
    setName(e.target.value);
  };
  const addName = () => {
    if (name.trim() !== "") {
      setNamesList([...namesList, { skill: name }]);
      setName("");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addName();
    }
  };

  const cancleSkill = (e, index) => {
    setNamesList((prevNamesList) =>
      prevNamesList.filter((_, i) => i !== index)
    );
  };
  const handleManagerOnChange = (event) => {
    const selectedManagerId = event.target.value;
    setReportingManagerId(selectedManagerId);
  };
  const UpdateEmployeeDetails = async () => {
    var employeeData1 = {
      ...employeeData,
      employeeStatus: status,
      roleId: roleId,
      projectManagerId: ReportingManagerId,
    };
    const payload = {
      emp: employeeData1,
      skillsset: namesList,
    };
    var response = await apiurl.put("/Employees/UpdateEmployee", payload);
    var result = response.data;
    if (result.isSuccess) {
      navigate("/dashboard/Employees");
    }
  };
  const handleEditClose1 = () => {
    navigate("/dashboard/Employees");
  };
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modalheader">
            <h2 className="employeeDetailsContent">Edit Employee Details</h2>
            <span className="cancelicon1">
              <i
                className="bi bi-x-lg"
                onClick={handleEditClose1}
                style={{ cursor: "pointer", fontSize: "1.3rem" }}
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
                label="Employee ID"
                variant="outlined"
                name="employeeId"
                onChange={handleOnChange}
                value={employeeData.employeeId || ""}
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
                  employeelist.map((emp, index) => (
                    <MenuItem key={index} value={emp.employee.employeeId}>
                      <span style={{ fontSize: "14px" }}>
                        {emp.employee.employeeId}
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
                label="First Name"
                name="firstName"
                value={employeeData.firstName || ""}
                variant="outlined"
                onChange={handleInputChange}
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
                label="Last Name"
                name="lastName"
                value={employeeData.lastName || ""}
                onChange={handleInputChange}
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
                label="Email ID"
                value={employeeData.email || ""}
                onChange={handleInputChange}
                variant="outlined"
                name="email"
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
                label="Mobile Number"
                variant="outlined"
                name="mobileNo"
                value={employeeData.mobileNo || ""}
                onChange={handleInputChange}
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
                label="Date of Joining"
                variant="outlined"
                type="date"
                name="dateOfJoining"
                value={
                  employeeData.dateOfJoining
                    ? new Date(employeeData.dateOfJoining)
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
                label="Status"
                variant="outlined"
                name="employeeStatus"
                value={status}
                className="row-checkbox "
                onChange={handleStatusChange}
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
                label="Role"
                name="role"
                onChange={handleRoleOnChange}
                value={roleId}
                variant="outlined"
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
                {roleList && roleList.length > 0 ? (
                  roleList.map((role, index) => (
                    <MenuItem key={role.id} value={role.id}>
                      <span style={{ fontSize: "14px" }}> {role.name}</span>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Roles Found</MenuItem>
                )}
              </TextField>
            </div>
            <div className="col-4">
              <TextField
                label="Reporting Manager"
                variant="outlined"
                onChange={handleManagerOnChange}
                value={ReportingManagerId || ""}
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
          </div>
          <div
            className="row  employeeUpdateSkills"
            style={{
              marginTop: "20px",
              marginLeft: "7px",
              marginRight: "12px",
            }}
          >
            <div
              className="col-4"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <TextField
                  label="Add Skill"
                  variant="outlined"
                  value={name}
                  onChange={handleInputChange11}
                  onKeyPress={handleKeyPress}
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
              <div className="">
                <img
                  src={pulsimage}
                  alt=""
                  width="38px"
                  height="38px"
                  onClick={addName}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="col-8">
              <div
                className="skillsetdiv"
                style={{
                  overflowY: "scroll",

                  resize: "none",
                  width: "100%",
                  border: "1px solid #ccc",
                  padding: "5px",
                  gap: "2px",

                  height: "100px",

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
                      {name.skill}
                    </p>
                    <img
                      src={checkimage1}
                      alt=""
                      height="15px"
                      width="15px"
                      style={{ cursor: "pointer" }}
                      className="m-1"
                      onClick={(e) => cancleSkill(e, index, name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className=" row"
            style={{
              marginTop: "20px",
              marginLeft: "7px",
              marginRight: "12px",
            }}
          >
            <div className="col-4">
              <button
                className="EditformSubmit"
                onClick={UpdateEmployeeDetails}
              >
                <span className="editformspan">Save</span>
              </button>
              <button
                className="EditformCancel ms-2"
                onClick={handleEditClose1}
              >
                <span className="editformcacelspan">Cancel</span>
              </button>
            </div>
            <div className="col-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeePopup;
