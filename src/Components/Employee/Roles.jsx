import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Styles/EmployeePages/Roles.css";
import editicon from "../../assets/Images/Editicon.png";
import deleteicon from "../../assets/Images/deleteicon.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import images from "../../assets/Images/User.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ImportPopup from "./ImportPopup";
import checkimage from "../../assets/Images/check.png";
import chechimage from "../../assets/Images/check.png";
import elipsimage from "../../assets/Images/Ellipse.png";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { AddRoleFormValidation } from "./AddRoleformValidatons";
import { actions } from "react-table";
import RolesService from "../../Service/AdminService/RolesService";
const priorityMap = {
  1: "High",
  2: "Medium",
  3: "Low",
  4: "Low",
  5: "Low",
};

export default function Roles() {
  const navigate = useNavigate();
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setEditIsPopupOpen] = useState(false);
  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [isUpdateopen, setIsUpdateOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isopen, setisOpen] = useState(false);
  const [RoleName, setRoleName] = useState("");
  const [Deleterolepopup, setDeleterolepopup] = useState(false);
  const [AddRolePopup, setAddRolePopup] = useState(false);
  const [selectedRolesIds, setSelectedRolesIds] = useState([]);
  const [SelectedRolesPopup, setSelectedRolesPopup] = useState(false);
  const [roleToggleState, setRoleToggleState] = useState({});
  const [role, setRole] = useState({
    name: "",
    priority: "",
  });
  useEffect(() => {
    fetchRoles();
  }, []);
  const [values, setValues] = useState({
    RoleName: "",
    Priority: "",
  });
  const [Updatevalues, setUpdateValues] = useState({
    RoleName: "",
    Priority: "",
  });
  const [errors, setErrors] = useState({
    RoleName: "",
    Priority: "",
  });
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const fetchRoles = async () => {
    try {
      const response = await RolesService.FcnGetRoles();
      const sortedRoles = response.data.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return a.priority - b.priority;
      });
      setRoles(sortedRoles);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };
  const closeDeletePopup = () => {
    setDeleterolepopup(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: AddRoleFormValidation(name, value),
    });
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setRole((prevRole) => ({
      ...prevRole,
      [name]: value,
    }));
  };
  const UpdateRole = async () => {
    var UpdateRoleResponse = await RolesService.FcnUpdateRole(role);
    var result = UpdateRoleResponse.data;
    if (result.message != null) {
      setIsUpdateOpen(false);
      fetchRoles();
    }
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const AllRolesIDs = roles
        .filter((role) => role.status === "Active")
        .map((role) => role.id);

      setSelectedRolesIds(AllRolesIDs);
      setDisiblebuttons(false);
    } else {
      setSelectedRolesIds([]);
      setDisiblebuttons(true);
    }
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      if (!checkbox.disabled) {
        checkbox.checked = isChecked;
      }
    });
  };
  const DeleteSelectedRecords = async () => {
    const response = await RolesService.FcnDeleteSelectedRoles(
      selectedRolesIds
    );
    const result = response.data;

    if (result.isSuccess) {
      setSelectedRolesPopup(true);
      setDisiblebuttons(true);
      fetchRoles();
    }
  };

  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.priority.toString().includes(searchQuery.toLowerCase())
    );
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const handleCheckboxChange = (roleId, isChecked) => {
    setSelectedRolesIds((prevSelected) => {
      let updatedSelected;
      if (isChecked) {
        updatedSelected = [...prevSelected, roleId];
      } else {
        updatedSelected = prevSelected.filter((id) => id !== roleId);
      }

      if (updatedSelected.length === 0) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }

      return updatedSelected;
    });
  };
  const AddNewRolePopup = () => {
    setValues({
      RoleName: "",
      Priority: "",
    });
    setErrors({
      RoleName: "",
      Priority: "",
    });
    setisOpen(true);
  };
  const CloseAddNewRolePopup = () => {
    setValues({
      RoleName: "",
      Priority: "",
    });
    setErrors({
      RoleName: "",
      Priority: "",
    });
    setisOpen(false);
  };
  const UpdatePopup = async (roleId) => {
    var getRoleResponse = await RolesService.FcnGetRole(roleId);
    setIsUpdateOpen(true);
    var result = getRoleResponse.data;
    setRole(result);
  };
  const CloseUpdateRolePopup = () => {
    setIsUpdateOpen(false);
  };
  const AddRole = async () => {
    const newErrors = {
      RoleName: AddRoleFormValidation("RoleName", values.RoleName),
      Priority: AddRoleFormValidation("Priority", values.Priority),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      var obj = {
        name: values.RoleName,
        priority: values.Priority,
      };
      var response = await RolesService.FcnCreateRole(obj);
      var result = response.data;
      if (result.isSuccess) {
        setisOpen(false);
        fetchRoles();
        setAddRolePopup(true);
      } else {
        toast.error(result.error.message, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };
  const DeleteRoleFunction = async (roleId) => {
    var response = await RolesService.FcnDeleteRole(roleId);
    var result = response.data;
    if (result.isSuccess) {
      fetchRoles();
      setDeleterolepopup(true);
    } else {
      toast.error(result.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const selectedRolesPopup = () => {
    setSelectedRolesPopup(false);
  };
  const [StatusRoleId, setStatusRoleId] = useState("");
  const [StatusRole, setStatusRole] = useState("");
  useEffect(() => {
    const initialState = {};
    roles.forEach((role) => {
      initialState[role.id] = role.status === "Active";
    });
    setRoleToggleState(initialState);
  }, [roles]);
  const handleToggle = async (checked, roleId, name, priority) => {
    const newStatus = checked ? "Active" : "Inactive";
    setRoleToggleState((prevState) => ({
      ...prevState,
      [roleId]: checked,
    }));
    setStatusRoleId(roleId);
    setStatusRole(newStatus);

    var obj = {
      id: roleId,
      name: name,
      priority: priority,
      status: newStatus,
    };

    var response = await RolesService.FcnChangeRoleStatus(obj);
    var result = response.data;
    if (result.isSuccess) {
      fetchRoles();
    }
  };
  const closePopup = () => {
    setAddRolePopup(false);
  };
  return (
    <div className="Rolemaindiv">
      <div className="roleheader">Role and Access</div>
      <div className="Rolelist">
        <div
          className="row"
          style={{
            paddingTop: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="col-4 ">
            <p className="rolecontent ms-3">Roles list</p>
          </div>
          <div
            className="col-2 "
            style={{ display: "flex", justifyContent: "end" }}
          ></div>
          <div className="col-6 d-flex justify-content-end">
            <div className="me-2">
              <button
                className="btn btn-danger deleteSelected "
                disabled={disiblebuttons}
                onClick={DeleteSelectedRecords}
                style={{
                  fontSize: "14px",
                  height: "36px",
                  display: "flex",
                  justifyContent: "end",
                  cursor: disiblebuttons ? "not-allowed" : "pointer",
                  opacity: disiblebuttons ? 0.65 : 1,
                  pointerEvents: disiblebuttons ? "auto" : "all",
                }}
              >
                Delete Selected
              </button>
            </div>
            <div>
              <button
                className="add-new-role-button me-2 "
                onClick={AddNewRolePopup}
              >
                <span>
                  <img
                    src={images}
                    alt=""
                    height="18px"
                    width="18px"
                    className=""
                  />
                </span>
                <span className="add-new-role-span ms-1">Add New Role</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              border: "1px solid #64646430",
              width: "100%",
            }}
            className=" mt-2"
          ></div>
        </div>

        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ margin: "0", padding: "0px 10px" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="userCheckbox"
                    style={{ height: "15px", width: "15px" }}
                  />
                </th>
                <th className="rolethclass">Role Name</th>
                <th className="rolethclass">Priority level</th>
                <th className="rolethclass">Priority Number</th>
                <th className="rolethclass">Enable/Disable</th>
                <th className="rolethclass">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((role, index) => (
                <tr
                  className="EmployeeListtablelistrow tablebody"
                  key={role.id}
                >
                  <td style={{ margin: "0", padding: "0px 10px" }}>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(role.id, e.target.checked)
                      }
                      className="row-checkbox"
                      disabled={role.status === "Inactive"}
                    />
                  </td>
                  <td
                    style={{
                      pointerEvents:
                        role.status === "Inactive" ? "none" : "auto",
                      opacity: role.status === "Inactive" ? 0.5 : 1,
                      color: role.status === "Inactive" ? "#aaa" : "inherit",
                      fontSize: "14px",
                    }}
                  >
                    {role.name}
                  </td>
                  <td
                    style={{
                      pointerEvents:
                        role.status === "Inactive" ? "none" : "auto",
                      opacity: role.status === "Inactive" ? 0.5 : 1,
                      fontSize: "14px",
                      color: role.status === "Inactive" ? "#aaa" : "inherit",
                    }}
                  >
                    {priorityMap[role.priority]}
                  </td>
                  <td
                    style={{
                      pointerEvents:
                        role.status === "Inactive" ? "none" : "auto",
                      opacity: role.status === "Inactive" ? 0.5 : 1,
                      color: role.status === "Inactive" ? "#aaa" : "inherit",
                      fontSize: "14px",
                    }}
                  >
                    {role.priority}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                      className="ms-3 mt-2"
                    >
                      <label
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "40px",
                          height: "20px !important",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!roleToggleState[role.id]}
                          onChange={(e) =>
                            handleToggle(
                              e.target.checked,
                              role.id,
                              role.name,
                              role.priority
                            )
                          }
                          style={{ display: "none" }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: roleToggleState[role.id]
                              ? "#4CAF50"
                              : "#ccc",
                            borderRadius: "25px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                        ></span>
                        <span
                          style={{
                            position: "absolute",
                            top: "1px",
                            left: roleToggleState[role.id] ? "21px" : "1px",
                            width: "18px",
                            height: "18px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            transition: "left 0.3s",
                          }}
                        ></span>
                      </label>
                    </div>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                      }}
                    >
                      <div>
                        <img
                          src={editicon}
                          onClick={(e) => {
                            if (role.status !== "Inactive") {
                              UpdatePopup(role.id);
                            }
                          }}
                          alt="Edit Role"
                          style={{
                            width: "24px",
                            height: "24px",
                            cursor:
                              role.status === "Inactive"
                                ? "not-allowed"
                                : "pointer",
                            opacity: role.status === "Inactive" ? 0.5 : 1,
                          }}
                        />
                      </div>
                      <div
                        className="ms-3"
                        style={{
                          pointerEvents:
                            role.status === "Inactive" ? "none" : "auto",
                          opacity: role.status === "Inactive" ? 0.5 : 1,
                        }}
                      >
                        <img
                          src={deleteicon}
                          style={{
                            width: "28px",
                            cursor: "pointer",
                            height: "28px",
                          }}
                          onClick={(e) => {
                            if (role.status !== "Inactive") {
                              DeleteRoleFunction(role.id);
                            }
                          }}
                          alt="Delete"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isopen && (
        <div className="overlay-backdrop">
          <div className="overlay-box">
            <div
              className="overlay-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h2 className="overlay-heading">
                <span className="Add_New-role_span ms-1">Add New Role</span>
              </h2>
              <span className="overlay-close-btn">
                <i
                  className="bi bi-x-lg me-1"
                  onClick={CloseAddNewRolePopup}
                  style={{ cursor: "pointer", color: "white" }}
                ></i>
              </span>
            </div>
            <div style={{ padding: "20px" }}>
              <TextField
                label="Role Name"
                placeholder="Enter RoleName"
                variant="outlined"
                name="RoleName"
                value={values.RoleName}
                onChange={handleChange}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1.1rempx",
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
              {errors.RoleName && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.RoleName}
                </span>
              )}
            </div>
            <div
              style={{
                paddingRight: "20px",
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              <TextField
                label="Priority"
                variant="outlined"
                name="Priority"
                value={values.Priority}
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
                <MenuItem value="" style={{ fontSize: "14px" }}>
                  <em>Select</em>
                </MenuItem>

                <MenuItem value={3} style={{ fontSize: "14px" }}>
                  Low
                </MenuItem>
                <MenuItem value={2} style={{ fontSize: "14px" }}>
                  Medium
                </MenuItem>
                <MenuItem value={1} style={{ fontSize: "14px" }}>
                  High
                </MenuItem>
              </TextField>
              {errors.Priority && (
                <span
                  className="error ms-1"
                  style={{ fontSize: "13px", color: "red" }}
                >
                  {errors.Priority}
                </span>
              )}
            </div>
            <div
              className="overlay-content "
              style={{ paddingTop: "20px", display: "flex" }}
            >
              <div className="">
                <button className="overlaysavebtn ms-1" onClick={AddRole}>
                  <span className="overlay-save-label">Save</span>
                </button>
              </div>
              <div className="">
                <button
                  style={{ cursor: "pointer" }}
                  className="ms-3 overlay-cancel-button"
                  onClick={CloseAddNewRolePopup}
                >
                  <span className="overlay-cancel-span">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isUpdateopen && (
        <div className="overlay-backdrop">
          <div className="overlay-box">
            <div
              className="overlay-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h2 className="overlay-heading">
                <span className="Add_New-role_span ms-1">Update Role</span>
              </h2>
              <span className="overlay-close-btn">
                <i
                  className="bi bi-x-lg me-1"
                  onClick={CloseUpdateRolePopup}
                  style={{ cursor: "pointer", color: "white" }}
                ></i>
              </span>
            </div>
            <div style={{ padding: "20px" }}>
              <TextField
                label="Role Name"
                placeholder="Enter RoleName"
                variant="outlined"
                name="name"
                value={role.name}
                onChange={handleChange1}
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
                    fontSize: "14px",
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
                    fontSize: "1rem",
                    transform: "translate(8px, -9px) scale(0.75)",
                  },
                  "& input::placeholder": {
                    fontSize: "14px",
                    color: "#AEAEAE",
                  },
                }}
                className="custom-text-field"
              />
            </div>
            <div
              style={{
                paddingRight: "20px",
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              <TextField
                label="Priority"
                variant="outlined"
                name="priority"
                value={role.priority}
                onChange={handleChange1}
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
                <MenuItem value="" style={{ fontSize: "14px" }}>
                  <em>Select</em>
                </MenuItem>

                <MenuItem value={3} style={{ fontSize: "14px" }}>
                  Low
                </MenuItem>
                <MenuItem value={2} style={{ fontSize: "14px" }}>
                  Medium
                </MenuItem>
                <MenuItem value={1} style={{ fontSize: "14px" }}>
                  High
                </MenuItem>
              </TextField>
            </div>
            <div className="overlay-content row" style={{ paddingTop: "20px" }}>
              <div className=" col-2">
                <button className="overlaysavebtn ms-1" onClick={UpdateRole}>
                  <span
                    className="overlay-save-label"
                    style={{ fontSize: "12px" }}
                  >
                    Update
                  </span>
                </button>
              </div>
              <div className="col-2">
                <button
                  style={{ cursor: "pointer" }}
                  className="ms-4 overlay-cancel-button"
                  onClick={CloseUpdateRolePopup}
                >
                  <span className="overlay-cancel-span">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      {Deleterolepopup && (
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
            <h2 className="unique-popup-title">Role Delete Successfully!</h2>
            <p className="unique-popup-message">Click OK to view result</p>
            <button className="unique-popup-button" onClick={closeDeletePopup}>
              OK
            </button>
          </div>
        </div>
      )}
      {SelectedRolesPopup && (
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
              Selected Roles Delete Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to view result</p>
            <button
              className="unique-popup-button"
              onClick={selectedRolesPopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {AddRolePopup && (
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
            <h2 className="unique-popup-title">New Role Successfully Added!</h2>
            <p className="unique-popup-message">Click OK to view result</p>
            <button className="unique-popup-button" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
