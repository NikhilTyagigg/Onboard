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
    dob: "", // Added Date of Birth field
    identity: "", // Added Identity field
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmail = /\S+@\S+\.\S+/.test(data.contact);
    if (data.password.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return;
    }

    // Check if password and confirm password match
    if (data.password !== data.ConfirmPassword) {
      showErrorToast("Password and Confirm Password do not match.");
      return;
    }
    const payload = {
      full_name: data.full_name,
      contact: data.contact,
      password: data.password,
      ConfirmPassword: data.ConfirmPassword,
      dob: data.dob, // Added Date of Birth field to payload
      identity: data.identity, // Added Identity field to payload
      role: 1,
      username: isEmail ? getUserNameFromEmail(data.contact) : data.contact,
      phone: isEmail ? null : data.contact,
      email: isEmail ? data.contact : null,
    };
    setLoader(true);
    setPayload(payload);
    otpHandler({
      email: isEmail ? data.contact : null,
      phone: isEmail ? null : data.contact,
    })
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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {!showVerificationPage ? (
        <div
          style={{
            width: "400px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Sign Up
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <Label
                for="full_name"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                User Name *
              </Label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Enter Full Name"
                value={data.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
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
                type="text"
                id="contact"
                name="contact"
                placeholder="Mobile number / E-mail"
                value={data.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px", position: "relative" }}>
              <Label
                for="password"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Password *
              </Label>
              <InputPasswordToggle
                id="password"
                name="password"
                placeholder="Create a password"
                value={data.password}
                onChange={handleChange}
                required
              />
              <CardText
                style={{ fontSize: "12px", color: "#6c757d", marginTop: "5px" }}
              >
                Password must be 8 characters long
              </CardText>
            </div>

            <div style={{ marginBottom: "15px", position: "relative" }}>
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
                id="ConfirmPassword"
                name="ConfirmPassword"
                placeholder="Create a password"
                value={data.ConfirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <Label
                for="dob"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Date of Birth *
              </Label>
              <Input
                type="date"
                id="dob"
                name="dob"
                placeholder="Select Date of Birth"
                value={data.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <Label
                for="identity"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Identify Yourself *
              </Label>
              <Input
                type="select"
                id="identity"
                name="identity"
                value={data.identity}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Identity
                </option>
                <option value="visually">VISUALLY IMPAIRED</option>
                <option value="wheelchair">WHEELCHAIR</option>
                <option value="ELDERLY">ELDERLY</option>
                <option value="PREGNANT">PREGNANT WOMEN</option>
              </Input>
            </div>

            <div
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
                required
                style={{ marginRight: "10px" }}
              />
              <Label for="terms">
                I agree with the
                <Link
                  to="/terms"
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    marginLeft: "5px",
                  }}
                >
                  Terms & Conditions
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              color="primary"
              block
              style={{
                background: "#007bff",
                borderColor: "#007bff",
                padding: "10px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "4px",
              }}
            >
              {loader && <Spinner size="sm" style={{ marginRight: "5px" }} />}
              Sign Up
            </Button>
          </Form>
          <p
            style={{ marginTop: "20px", textAlign: "center", color: "#6c757d" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      ) : (
        <OtpVerification userData={Payload} otp={otp} />
      )}
    </div>
  );
};

export default Register;
