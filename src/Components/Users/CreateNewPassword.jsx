import forgotpasswordsideImaage from "../../assets/Images/forgotpasswordimage.png";
import "../../assets/Styles/ForgotPassword.css";
import archetslogo from "../../../src/assets/Images/primary-logo.png";
import { useNavigate } from "react-router-dom";
import { getotpValidation } from "./getotpValidation";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import userService from "../../Service/UserService/userService";
export default function CreateNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword11, setShowPassword11] = useState(false);
  const [confirmPassword1, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  var email1 = localStorage.getItem("Email");
  const navigate = useNavigate();
  const backtoLogin = async () => {
    navigate("/");
  };
  const [passwordValues, setPasswordValues] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
    setPasswordErrors({
      ...passwordErrors,
      [name]: validatePassword(name, value),
    });
  };

  async function onSetNewPasswordClick(e) {
    e.preventDefault();

    const newErrors = {
      NewPassword: validatePassword("NewPassword", passwordValues.NewPassword),
      ConfirmPassword: validatePassword(
        "ConfirmPassword",
        passwordValues.ConfirmPassword
      ),
    };
    setPasswordErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (!isValid) {
      var obj = {
        Email: email1,

        NewPassword: passwordValues.NewPassword,
      };

      var responses = await userService.FcnCreateNewPassword(obj);
      var result = responses.data;
      if (result.isSuccess) {
        toast.success("Password updated successfully.", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => navigate("/"),
        });
      } else {
        if (result.error.code === "AUTH003") {
          toast.error(
            "New password cannot be the same as the existing password.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
        if (result.error.code === "AUTH005") {
          toast.error(
            "Please do the otp verification to update the password.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
      }
    }
  }

  function validatePassword(name, value) {
    if (name === "NewPassword") {
      if (!value) return "New password is required";
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
      )
        return "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character";
    }
    if (name === "ConfirmPassword") {
      if (!value) return "Confirm password is required";
      if (value !== passwordValues.NewPassword) return "Passwords should match";
    }
  }
  return (
    <div className="fogotpasswordpagemaindiv  row ">
      <div className="col-6">
        <img src={forgotpasswordsideImaage} alt="" className="Loginimagelogo" />
      </div>
      <div className="formdiv col-6">
        <div className="">
          <img src={archetslogo} alt="" className="archentslogo" />
        </div>
        <div className="formdiv1">
          <div className="logincontent">Set New Password</div>
          <div className="pleaseLoginContent">
            Enter and confirm your new password to complete the reset process.
          </div>
          <form onSubmit={onSetNewPasswordClick}>
            <div className="inputdiv">
              <div>
                <div>
                  <label className="inputlable">New Password</label>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="emailinput1 form-control w-100"
                  name="NewPassword"
                  value={passwordValues.NewPassword}
                  onChange={handlePasswordChange}
                />
                <div
                  className="eyeIcon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    cursor: "pointer",
                    right: "56px",
                    top: "198px",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {passwordErrors.NewPassword && (
                  <p
                    className="validationError m-1"
                    style={{ color: "red", fontSize: "12px" }}
                  >
                    {passwordErrors.NewPassword}
                  </p>
                )}
              </div>
              <div className="mt-1">
                <div className="password-container">
                  <label className="inputlable">Confirm Password</label>
                  <div className="password-field1">
                    <input
                      type={showPassword11 ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="emailinput1 form-control w-100"
                      name="ConfirmPassword"
                      value={passwordValues.ConfirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <div
                      className="eyeIcon1"
                      onClick={() => setShowPassword11(!showPassword11)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword11 ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="backtologin1 mt-1">
                  <div>
                    {passwordErrors.ConfirmPassword && (
                      <p
                        className="validationError m-1"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        {passwordErrors.ConfirmPassword}
                      </p>
                    )}
                  </div>

                  <a
                    style={{
                      color: "#0071FF",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={backtoLogin}
                    className=""
                  >
                    Back to login?
                  </a>
                </div>
              </div>
            </div>
            <div className="loginbutton">
              <button className="buttonlogin1">Set New Password</button>
            </div>
          </form>

          <div className="createPassword_contact" style={{ margin: "50px" }}>
            if you are a new user, please contact archents support team.
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
