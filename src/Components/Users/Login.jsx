import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "../../assets/Styles/Login.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  setSessionData,
  getSessionData,
} from "../../Service/SharedSessionData";
import { ControlCameraSharp } from "@mui/icons-material";
import { LoginFormValidation } from "../Admin/Pages/LoginFormValidation";
import { getotpValidation } from "./getotpValidation";
import loginLogo from "../../../src/assets/Images/loginbg1.png";
import Login2 from "../../../src/assets/Images/Login2.png";
import archetslogo from "../../../src/assets/Images/primary-logo.png";
import LoginImage from "../../../src/assets/Images/loginbg1.png";
import rememeberme from "../../assets/Images/checkbox.svg";
import { useEffect } from "react";
import userService from "../../Service/UserService/userService";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disibleloginbuttons, setDisibleloginbuttons] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const [valuess, setValuess] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const navigatetoforgotpasswordpage = async () => {
    navigate("/user/forgotpassword");
  };
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setValuess({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, [tempToken]);
  const onLoginButtonClick = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: LoginFormValidation("email", valuess.email),
      password: LoginFormValidation("password", valuess.password),
    };
    setError(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      var obj = {
        Email: valuess.email,
        Password: valuess.password,
      };
      var responses = await userService.FcnLogin(obj);
      var result = await responses.data;
      localStorage.setItem("sessionData", JSON.stringify(result.item));
      setLoggedIn(true);
      if (result.isSuccess === true) {
        localStorage.setItem("sessionData", JSON.stringify(result.item));
        setLoggedIn(true);
        setSessionData(result.item.token);
        setTempToken(result.item.token);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", valuess.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        if (result.item.employee.isFirstTimeLogin === true) {
          localStorage.setItem("Email", valuess.email);
          navigate("/user/CreateNewPassword");
        } else {
          const currentTime = new Date().toISOString();
          localStorage.setItem("sessionData", JSON.stringify(result.item));
          localStorage.setItem("lastSignInTime", currentTime);
          if (result.item.employee.role.name === "US-finance") {
            navigate("/Dashboard/FinanceDashboard");
          } else if (result.item.employee.role.name === "Admin") {
            navigate("/dashboard/AdminDashboard");
          } else if (result.item.employee.role.name === "Indian-finance") {
            navigate("/Dashboard/Dashboard");
          } else if (result.item.employee.role.name === "Project Manager") {
            navigate("/dashboard/Employeeslist");
          }
        }
      } else {
        if (result.error.code === "AUTH001") {
          toast.error("Email not found. Please check your email address.", {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (result.error.code === "AUTH002") {
          toast.error(
            "Incorrect password. Please check your password and try again.",
            { position: "top-right", autoClose: 4000 },
          );
        } else if (result.error.code === "AUTH003") {
          toast.error("Employee has no access to login.", {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          toast.error("Check your email and password.", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }
    }
  };

  const [values, setValues] = useState({
    Email: "",
  });

  const [otpValues, setOtpValues] = useState({
    Otp: "",
  });
  const [otpErrors, setOtpErrors] = useState({
    Otp: "",
  });

  const [passwordValues, setPasswordValues] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setValuess({
      ...valuess,
      [name]: value,
    });

    setError({
      ...error,
      [name]: LoginFormValidation(name, value),
    });
  };

  return (
    <div className="row m-0 p-0">
      <div className="imagediv col-6 p-0">
        <img src={LoginImage} alt="" className="Loginimagelogo" />
      </div>
      <div className="formdiv col-6 ">
        <div className="">
          <img src={archetslogo} alt="" className="archentslogo" />
        </div>
        <div className="formdiv1">
          <div className="logincontent">Login Nagaraju</div>
          <div className="financecontent">Welcome to Finance Management!</div>
          <div className="pleaseLoginContent">
            Please login using email id and password
          </div>
          <form onSubmit={onLoginButtonClick}>
            <div className="inputdiv">
              <div>
                <div>
                  <label>
                    Email ID <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="enter your username"
                  className="emailandpassword"
                  name="email"
                  value={valuess.email}
                  onChange={handleChange}
                />
                {error.email && (
                  <span
                    className="error ms-1 emailrequirederrormessage "
                    style={{
                      color: "red",
                      textAlign: "start",
                      display: "flex",
                    }}
                  >
                    {error.email}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <div className="password-container">
                  <label>
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="emailandpassword"
                      placeholder="Enter your password"
                      name="password"
                      value={valuess.password}
                      onChange={handleChange}
                    />
                    <div
                      className="eyeIcon LogineyeIcon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer", marginLeft: "-35px" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>
              </div>
              {error.password && (
                <span
                  className="ms-1 emailrequirederrormessage"
                  style={{ color: "red", textAlign: "start", display: "flex" }}
                >
                  {error.password}
                </span>
              )}
            </div>
            <div
              className="forgotpasswordtag mt-1"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex" }} className="ms-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  style={{ width: "18px" }}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <p className="remembermecontent m-2">Remember me</p>
              </div>
              <div className="mt-1">
                <a
                  className="forgotpasswordatag"
                  onClick={navigatetoforgotpasswordpage}
                  style={{ color: "#0071FF", cursor: "pointer" }}
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <div className="loginbutton">
              <button className="buttonlogin1" onClick={onLoginButtonClick}>
                Login
              </button>
            </div>
          </form>
          <div className="forcontect">
            if you are a new user, please contact archents support team.
          </div>
        </div>
      </div>
      <ToastContainer position="top-end" autoClose={5000} />
    </div>
  );
};

export default Home;
