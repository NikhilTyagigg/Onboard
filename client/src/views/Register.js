import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import InputPasswordToggle from "@components/input-password-toggle";
import { statusCode } from "../utility/constants/utilObject";
import {
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import "@styles/react/pages/page-authentication.scss";
import toast from "react-hot-toast";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { getUserNameFromEmail } from "../utility/helper";
import { otpHandler, sendEmailVerification } from "../services/agent";

import { ReactComponent as EmailVerify } from "../assets/images/pages/Email-Verify.svg";
import { ChevronLeft } from "react-feather";
import { Message } from "../utility/constants/message";
import OtpVerification from "./OtpVerification"; // Import your otpVerification component here

const Register = () => {
  const { skin } = useSkin();
  const illustration =
    skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg";

  const [data, setData] = useState({
    first_name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    username: "",
    designation: "",
    company: "",
    mobile: "",
    purpose: "",
    iAgree: false,
  });
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState(false);
  const [iAgree, setIAgree] = useState(false);
  const [showVerificationPage, setShowVerificationPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [Payload, setPayload] = useState(""); // State to hold the OTP

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  // const resetData = () => {
  //   setData({
  //     first_name: "",
  //     last_name: "",
  //     email: "",
  //     password: "",
  //     username: "",
  //     designation: "",
  //     company: "",
  //     mobile: "",
  //     purpose: "",
  //     name: "",
  //   });
  // };

  // const sendVerificationLink = () => {
  //   const payload = {
  //     email: data.email,
  //     origin: "",
  //   };
  //   setLoader(true);
  //   sendEmailVerification(payload)
  //     .then((res) => {
  //       setLoader(false);
  //       if (res.status === statusCode.HTTP_200_OK) {
  //         toast.success(Message.SENT_VERIFICATION_LINK, {
  //           ...toastStyle.success,
  //         });
  //       } else {
  //         let key = Object.keys(res.response.data);
  //         key = key[0];
  //         toast.error("Sending failed: " + res.response.data.detail, {
  //           ...toastStyle.error,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //       toast.error("Sending failed: " + err.message, {
  //         ...toastStyle.error,
  //       });
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Check if the form is being submitted
    const payload = {
      ...data,
      role: 1,
      name: data.first_name,
      username: getUserNameFromEmail(data.email),
    };
    setLoader(true);
    setPayload(payload);
    console.log("Payload:", payload); // Check the payload before sending OTP
    otpHandler(payload.username)
      .then((res) => {
        setLoader(false);
        console.log("OTP Response:", res.data.otp);
        console.log("ye rha ", res.status);
        console.log("log=", statusCode.HTTP_200_OK); // Check the response from otpHandler
        if (res.status == statusCode.HTTP_200_OK) {
          console.log(
            "OTP successfully sent, redirecting to verification page."
          );
          setStatus(true);
          showSuccessToast(
            "OTP sent successfully to your gmail account. Please verify!"
          );
          setShowVerificationPage(true);
          setOtp(res.data.otp);
        } else if (res.request.status == statusCode.HTTP_400_BAD_REQUEST) {
          showErrorToast(res.response.data.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorToast("Something went wrong. Please try again later.");
        console.error("Error:", err);
      });
  };

  const onChecked = () => {
    setIAgree(!iAgree);
  };
  // const getotprecord = () => {
  //   this.setState({ loader: true });
  //   const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
  //   getotp(queryParams)
  //     .then((response) => {
  //       console.log("Response Status:", response.status);
  //       // Handle the response data here, if needed
  //       this.setState({ loader: false });
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // Handle the error here, if needed
  //       this.setState({ loader: false });
  //     });
  // };

  return (
    <div
      className="registerWrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {!showVerificationPage ? (
        <div className="forgotPassSection" style={{ width: "100%" }}>
          <div className="formDetail">
            <Col className="formCard">
              {status && (
                <CardText className="mb-2">
                  You should be automatically redirected to the login page in{" "}
                  <span id="seconds">5</span> seconds.
                </CardText>
              )}
              <Form
                className="formSection"
                onSubmit={handleSubmit}
                style={{
                  padding: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  maxHeight: "100%", // Prevent overflow in height
                }}
              >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                  Sign Up
                </h2>
                <div className="cardRow" style={{ marginBottom: "15px" }}>
                  <div className="w-100">
                    <Label
                      for="register-username"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Enter Name *
                    </Label>
                    <Input
                      type="text"
                      id="register-username"
                      placeholder="First Name"
                      name="first_name"
                      autoFocus
                      value={data.first_name}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="cardRow"
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="w-50" style={{ marginRight: "10px" }}>
                    <Label
                      for="designation"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Email *
                    </Label>
                    <Input
                      className="input-group-merge"
                      id="designation"
                      name="email"
                      placeholder="john@example.com"
                      value={data.email}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div className="w-50">
                    <Label
                      for="register-password"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Password *
                    </Label>
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="register-password"
                      placeholder="Password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div className="cardRow" style={{ marginBottom: "15px" }}>
                  <div className="w-100">
                    <Label
                      for="ConfirmPassword"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Confirm Password *
                    </Label>
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="confirmpassword"
                      placeholder="Confirm Password"
                      name="ConfirmPassword"
                      value={data.ConfirmPassword}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div className="cardRow" style={{ marginBottom: "15px" }}>
                  <div className="w-100">
                    <Label
                      for="phone-number"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Phone Number *
                    </Label>
                    <Input
                      className="input-group-merge"
                      id="phone-number"
                      name="mobile"
                      placeholder="Phone number"
                      value={data.mobile}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="policyCheckBox"
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    type="checkbox"
                    id="terms"
                    checked={iAgree}
                    onChange={onChecked}
                    style={{ marginRight: "10px" }}
                  />
                  <Label for="terms">
                    I agree to
                    <a
                      href="/"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        color: "#1761fd",
                        textDecoration: "underline",
                        marginLeft: "5px",
                      }}
                    >
                      privacy policy & terms
                    </a>
                  </Label>
                </div>
                <div
                  className="submitButtonRow"
                  style={{ textAlign: "center" }}
                >
                  <div className="buttonCard">
                    <Button
                      className="submit"
                      type="submit"
                      disabled={loader}
                      style={{
                        backgroundColor: "#1761fd",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loader ? "not-allowed" : "pointer",
                        width: "100%",
                      }}
                    >
                      {loader ? <Spinner color="#fff" size="sm" /> : "Sign up"}
                    </Button>
                    {!loader && (
                      <p style={{ marginTop: "10px" }}>
                        Already have an account,
                        <Link
                          to="/login"
                          style={{
                            color: "#1761fd",
                            textDecoration: "underline",
                            marginLeft: "5px",
                          }}
                        >
                          Sign In
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </Form>
            </Col>
          </div>
        </div>
      ) : (
        <div className="verificationDetail">
          <div className="forgetPass align-items-center">
            <p className="titleCard">Verify your email</p>
            <div className="imgBox">
              <EmailVerify />
            </div>
            <p className="textArea">{Message.SENT_EMAIL_VERIFICATION_LINK} </p>

            <OtpVerification userData={Payload} otp={otp} />

            <Link to="/login" className="backToHome">
              <ChevronLeft />
              <span>Back To Home Page</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
