import "../../assets/Styles/UserProfile.css";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import { ChangePasswordValidation } from "../Admin/Pages/ChangePasswordvalidation";

const EmployeeProfile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [employee, setEmployee] = useState({});
  const [lastSeen, setLastSeen] = useState("");
  const [id, setid] = useState("");
  const [projectManager, setProjectManager] = useState({});
  const openChangePassword = () => setShowChangePassword(true);
  useEffect(() => {
    FetchData();
    const data = JSON.parse(localStorage.getItem("sessionData"));
    setEmployee(data);
  }, []);

  const FetchData = async () => {
    const response = await EmployeeService.GetEmployees();
    var result = response.item;
    setid(employee.employee.projectManagerId);
    const employeeObject = result.find(
      (item) => (item.employeeDetails.id || "N/A") === id
    );
    setProjectManager(employeeObject);
  };

  const handleChangePassword = () => {
    // TODO: Add your API call here to actually change password
    setMessage("Changing password...");
    setTimeout(() => {
      setMessage("Password changed successfully!");
      // Optionally close modal after success
      // closeChangePassword();
    }, 1000);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      employee: {
        ...prev.employee,
        [name]: value,
      },
    }));
  };

  const getLastSignInTimeAgo = () => {
    const lastSignIn = localStorage.getItem("lastSignInTime");
    if (!lastSignIn) return "Unknown";

    const lastDate = new Date(lastSignIn);
    const now = new Date();

    const diffMs = now - lastDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 60000) return "Just now";
    else if (diffMins < 60) return `Last sign-in ${diffMins} minute(s) ago`;
    else if (diffHours < 24) return `Last sign-in ${diffHours} hour(s) ago`;
    else return `Last sign-in ${diffDays} day(s) ago`;
  };
  useEffect(() => {
    setLastSeen(getLastSignInTimeAgo());
  }, []);
  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [values, setValues] = useState({
    id: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  async function ChangePassword(e) {
    e.preventDefault();
    const newErrors = {
      password: ChangePasswordValidation("password", values.password, values),
      newPassword: ChangePasswordValidation(
        "newPassword",
        values.newPassword,
        values
      ),

      confirmPassword: ChangePasswordValidation(
        "confirmPassword",
        values.confirmPassword,
        values
      ),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      const obj = {
        id: employee.employee.id,
        password: values.password,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      console.log(obj, "obj");
      // var response = await AdminDashboardServices.fcnAddClientAsync(obj);
      // if (response.isSuccess === true) {
      //   setValues({
      //     ClientName: "",
      //     ClientEmailId: "",
      //     file: "",
      //     ClientLocation: "",
      //     ReferenceName: "",
      //   });

      //   fetchData();
      //   setAddclientPopup(false);
      // } else {
      //   toast.error(response.error.message, {
      //     position: "top-right",
      //     autoClose: "4000",
      //   });
      // }
      setErrors({
        ...errors,
        [name]: ChangePasswordValidation(name, value, values),
      });
    }
  }
  const closeChangePassword = () => {
    setShowChangePassword(false);
    setValues({
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: ChangePasswordValidation(name, value, values),
    });
    setErrors({
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-left">
        <FaUser size={30} color="#444" style={{ marginBottom: "10px" }} />
        <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="profile-img"
        />

        <div className="profile-email">nagaraju.boda@archents.com</div>
        <div className="profile-meta">{lastSeen}</div>
        <div className="user-id">
          Employee ID: <span className="faded">IARC0282</span>
        </div>
        <div className="profile-actions">
          <button className="action-btn" onClick={openChangePassword}>
            Change Password
          </button>
        </div>
      </div>

      <div className="profile-right">
        <div className="section">
          <h3>Personal Information</h3>

          <div className="row">
            <div className="form-group col-6">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={employee.employee?.firstName || ""}
                readOnly
              />
            </div>
            <div className="form-group col-6">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={employee.employee?.lastName}
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-verified">
              <input
                type="text"
                name="email"
                value={employee.employee?.email}
                readOnly
                className="w-75"
              />
              <span className="verified">Verified</span>
            </div>
          </div>

          <div className="row ">
            <div className="form-group col-6">
              <label>Phone Number</label>
              <input
                type="text"
                name="mobileNo"
                value={employee.employee?.mobileNo}
                onChange={handleInputChange}
                className="w-100"
                readOnly
              />
            </div>
            <div className="form-group col-6">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={employee.employee?.employeeId}
                readOnly
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label>Date of Joining</label>
              <input
                type="text"
                name="dateOfJoining"
                value={new Date(
                  employee.employee?.dateOfJoining
                ).toLocaleDateString("en-GB")}
                readOnly
              />
            </div>
            <div className="form-group col-6">
              <label>Project Manager</label>
              <input
                type="text"
                name="projectManager"
                value={
                  employee.employee?.projectManagerId
                    ? `${projectManager?.employeeDetails?.firstName || ""} ${
                        projectManager?.employeeDetails?.lastName || ""
                      }`
                    : "N/A"
                }
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label>Employee Status</label>
            <input
              type="text"
              name="employeeStatus"
              value={
                employee.employee?.employeeStatus === 0 ? "InActive" : "Active"
              }
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Skill Sets</label>
            <textarea
              type="text"
              name="skillSets"
              value={employee.employee?.skillSets}
              onChange={handleInputChange}
            />
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={employee.employee?.role.name}
                readOnly
              />
            </div>
            <div className="form-group col-6">
              <label>Created On</label>
              <input
                type="text"
                name="createdOn"
                value={new Date(
                  employee.employee?.creationDate
                ).toLocaleDateString("en-GB")}
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label>Last Modified</label>
            <input
              type="text"
              name="lastModified"
              value={new Date(
                employee.employee?.modifiedDate
              ).toLocaleDateString("en-GB")}
              readOnly
            />
          </div>
        </div>
      </div>

      {showChangePassword && (
        <div className="change-password-overlay" onClick={closeChangePassword}>
          <form onSubmit={ChangePassword}>
            <div
              className="change-password-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Change Password</h3>
              <div className="change-password-group">
                <label>
                  Old Password{" "}
                  <span style={{ color: "red", fontSize: "px" }}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter old password"
                />
                {errors.password && (
                  <span
                    className="error ms-1"
                    style={{ color: "red", fontSize: "13px" }}
                  >
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="change-password-group">
                <label>
                  New Password{" "}
                  <span style={{ color: "red", fontSize: "px" }}>*</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <span
                    className="error ms-1"
                    style={{ color: "red", fontSize: "13px" }}
                  >
                    {errors.newPassword}
                  </span>
                )}
              </div>
              <div className="change-password-group">
                <label>
                  Confirm New Password{" "}
                  <span style={{ color: "red", fontSize: "px" }}>*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <span
                    className="error ms-1"
                    style={{ color: "red", fontSize: "13px" }}
                  >
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="change-password-actions">
                <button
                  className="change-password-btn"
                  onClick={handleChangePassword}
                >
                  Submit
                </button>
                <button
                  className="change-password-btn red"
                  onClick={closeChangePassword}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
