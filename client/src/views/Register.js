import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import InputPasswordToggle from "@components/input-password-toggle";
import { statusCode } from "../utility/constants/utilObject";
import { Col, CardText, Form, Label, Input, Button, Spinner } from "reactstrap";
import "@styles/react/pages/page-authentication.scss";
import toast from "react-hot-toast";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { getUserNameFromEmail } from "../utility/helper";
import { otpHandler } from "../services/agent";
import { ReactComponent as EmailVerify } from "../assets/images/pages/Email-Verify.svg";
import { ChevronLeft } from "react-feather";
import { Message } from "../utility/constants/message";
import OtpVerification from "./OtpVerification"; // Import your otpVerification component here

const Register = () => {
  const { skin } = useSkin();

  const [data, setData] = useState({
    full_name: "",
    contact: "",
    password: "",
    ConfirmPassword: "",
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const isEmail = /\S+@\S+\.\S+/.test(data.contact);
  //   const payload = {
  //     ...data,
  //     role: 1,
  //     username: isEmail ? getUserNameFromEmail(data.contact) : data.contact,
  //     phone: isEmail ? null : data.contact,
  //     email: isEmail ? data.contact : null,
  //   };
  //   setLoader(true);
  //   setPayload(payload);

  //   otpHandler(payload.username)
  //     .then((res) => {
  //       setLoader(false);
  //       console.log("OTP Handler Response:", res);
  //       if (res.status == statusCode.HTTP_200_OK) {
  //         setStatus(true);
  //         showSuccessToast("OTP sent successfully. Please verify!");
  //         setShowVerificationPage(true);
  //         setOtp(res.data.otp);
  //       } else if (res.request.status === statusCode.HTTP_400_BAD_REQUEST) {
  //         showErrorToast(res.response.data.message);
  //       }
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //       showErrorToast("Something went wrong. Please try again later.");
  //       console.error("Error:", err);
  //     });
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmail = /\S+@\S+\.\S+/.test(data.contact);
    const payload = {
      full_name: data.full_name,
      contact: data.contact,
      password: data.password,
      ConfirmPassword: data.ConfirmPassword,
      role: 1,
      username: isEmail ? getUserNameFromEmail(data.contact) : data.contact,
      phone: isEmail ? null : data.contact,
      email: isEmail ? data.contact : null,
    };
    setLoader(true);
    setPayload(payload);

    otpHandler(payload.username)
      .then((res) => {
        setLoader(false);
        if (res.status == statusCode.HTTP_200_OK) {
          setStatus(true);
          showSuccessToast("OTP sent successfully. Please verify!");
          setShowVerificationPage(true);
          setOtp(res.data.otp);
        } else if (res.request.status == statusCode.HTTP_400_BAD_REQUEST) {
          showErrorToast(res.response.data.message);
        } else if (res.request.status == statusCode.HTTP_401_UNAUTHORIZED) {
          showErrorToast("Unauthorized request. User Already registered.");
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
                      for="register-full-name"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Enter Full Name *
                    </Label>
                    <Input
                      type="text"
                      id="register-full-name"
                      placeholder="Full Name"
                      name="full_name"
                      autoFocus
                      value={data.full_name}
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
                      for="contact"
                      style={{
                        marginBottom: "5px",
                        display: "block",
                        fontWeight: "bold",
                      }}
                    >
                      Phone Number / Email *
                    </Label>
                    <Input
                      className="input-group-merge"
                      id="contact"
                      name="contact"
                      placeholder="Mobile number / E-mail"
                      value={data.contact}
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
                    <CardText
                      style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "5px",
                      }}
                    >
                      Password must be 8 characters long
                    </CardText>
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
                    <CardText
                      style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginTop: "5px",
                      }}
                    >
                      Password must be 8 characters long
                    </CardText>
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
