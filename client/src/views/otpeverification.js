import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { checkUser, verifyOtp, otpHandler } from "../services/agent";
import { statusCode } from "../utility/constants/utilObject";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import "@styles/react/pages/page-authentication.scss";

const otpeverification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, otp } = location.state || {}; // Retrieve state
  const [userOtp, setUserOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleOtpChange = (e) => {
    setUserOtp(e.target.value);
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      let payload;

      if (userData.match(/^\d+$/)) {
        payload = {
          phone: "+91" + userData,
        };
      } else {
        payload = {
          email: userData,
        };
      }
      console.log("*****", payload);

      const userCheckRes = await checkUser(payload);

      if (userCheckRes.status == statusCode.HTTP_200_OK) {
        payload = {
          ...payload,
          userOtp,
          otp,
        };

        const otpRes = await verifyOtp(payload);

        if (otpRes.status == statusCode.HTTP_200_OK) {
          setLoading(false);
          showSuccessToast(
            "OTP verified successfully. Redirecting to reset password page."
          );
          console.log(userData);

          navigate("/reset-password", {
            state: { userD: userData },
          });
        } else {
          setLoading(false);
          showErrorToast("Invalid OTP, please try again.");
        }
      } else {
        setLoading(false);
        showErrorToast("User not found blaha blaha .");
      }
    } catch (err) {
      setLoading(false);
      showErrorToast("An error occurred while verifying OTP.");
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      let payload;

      if (userData.match(/^\d+$/)) {
        payload = {
          phone: "+91" + userData,
        };
      } else {
        payload = {
          email: userData,
        };
      }

      const res = await otpHandler(payload);

      if (res.status === statusCode.HTTP_200_OK) {
        showSuccessToast("OTP has been resent successfully.");
      } else {
        showErrorToast("Failed to resend OTP, please try again.");
      }
    } catch (err) {
      showErrorToast("An error occurred while resending the OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="otp-verification"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Card
        style={{
          width: "400px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">
            Verify OTP
          </CardTitle>
          <Form>
            <FormGroup>
              <Label for="otp">Enter 4-digit OTP</Label>
              <Input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={userOtp}
                onChange={handleOtpChange}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </FormGroup>
            <Button
              color="primary"
              onClick={handleOtpSubmit}
              disabled={loading}
              block
              style={{ padding: "10px", fontSize: "16px" }}
            >
              {loading ? <Spinner size="sm" /> : "Verify OTP"}
            </Button>
          </Form>
          <Button
            color="link"
            onClick={handleResendOtp}
            disabled={resendLoading}
            block
            style={{ marginTop: "10px", fontSize: "16px" }}
          >
            {resendLoading ? <Spinner size="sm" /> : "Resend OTP"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default otpeverification;
