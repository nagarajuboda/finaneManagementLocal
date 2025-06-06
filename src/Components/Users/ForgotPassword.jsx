import forgotpasswordsideImaage from "../../assets/Images/forgotpasswordimage.png";
import "../../assets/Styles/ForgotPassword.css";
import archetslogo from "../../../src/assets/Images/primary-logo.png";
import { useNavigate } from "react-router-dom";
import { getotpValidation } from "./getotpValidation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import userService from "../../Service/UserService/userService";
export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailvalues, setEmialValuess] = useState({
    email: "",
  });
  const [emailerror, setEmialerror] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const backtoLogin = async () => {
    navigate("/");
  };
  const handleChange22 = async (e) => {
    const { name, value } = e.target;

    setEmialValuess({
      ...emailvalues,
      [name]: value,
    });

    setEmialerror({
      ...emailerror,
      [name]: getotpValidation(name, value),
    });
  };
  async function getotpfunction(e) {
    e.preventDefault();
    const newErrors = {
      email: getotpValidation("email", emailvalues.email),
    };
    setEmialerror(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      var obj = {
        Email: emailvalues.email,
      };
      setLoading(true);
      var responses = await userService.FcnGetOTP(obj);
      var result = await responses.data;
      if (result.isSuccess) {
        setLoading(false);
        localStorage.setItem("Email", emailvalues.email);
        localStorage.setItem("OTP", result.item.otp);
        toast.success("OTP sent successfully to Your Email.", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => navigate("/user/VerifyOtp"),
        });
      } else {
        setLoading(false);
        toast.error("Please enter a valid email.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  }
  return (
    <div
      className="fogotpasswordpagemaindiv "
      style={{ height: "100vh", display: "flex" }}
    >
      <div className="" style={{ width: "50%" }}>
        <img
          src={forgotpasswordsideImaage}
          alt=""
          className="forgotpasswordImage"
        />
      </div>
      <div
        className="formdiv3"
        style={{ backgroundColor: "#FAFFFB", width: "50%" }}
      >
        <div className="formdiv2">
          <div className="">
            <img
              src={archetslogo}
              alt=""
              className="forgotpassword_Archents_Logo"
            />
          </div>
          <div style={{ margin: "30px " }}>
            <div
              className="forgotpasswordcontent"
              style={{ marginTop: " 100px " }}
            >
              Forgot your password?
            </div>
            <div className="enetremailid mt-2">
              Enter your email id, we will reset your passward.
            </div>
            <form onSubmit={getotpfunction}>
              <div className="forgotform mt-3">
                <div className="mb-1">
                  <label className="inputlable">Email ID</label>
                </div>
                <input
                  type="text"
                  placeholder="enter your email "
                  className="emailinput form-control w-100"
                  onChange={handleChange22}
                  name="email"
                  value={emailvalues.email}
                />
                <div className="backtologin mt-2">
                  <div>
                    {emailerror.email && (
                      <span className=" ms-1 emailrequirederrormessage">
                        {emailerror.email}
                      </span>
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
                    Back to login
                  </a>
                </div>

                <div className="loginbutton">
                  {loading === false ? (
                    <button className="buttonlogin w-100">Submit</button>
                  ) : (
                    loading && (
                      <button class="buttonlogin w-100" type="button" disabled>
                        <span
                          class="spinner-border spinner-border-sm "
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </button>
                    )
                  )}
                </div>
                <div className="forcontect1">
                  if you are a new user, please contact archents support team.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
