import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft, Feather } from "react-feather";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { otpHandler, verifyOTP } from "../services/agent";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { statusCode } from "../utility/constants/utilObject";
import { ReactComponent as LockIcon } from "../assets/icons/lockIcon.svg";

const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const onSendOtp = () => {
    if (!email) {
      showErrorToast("Please provide your email to proceed");
    } else {
      setLoader(true);
      otpHandler({
        email: email,
      })
        .then((res) => {
          setLoader(false);
          if (res.status === statusCode.HTTP_200_OK) {
            setOtpSent(true);
            showSuccessToast("OTP has been sent to " + email);
          } else {
            showErrorToast("OTP could not be sent, please try again later");
          }
        })
        .catch(() => {
          setLoader(false);
          showErrorToast("OTP could not be sent, please try again later");
        });
    }
  };

  const onVerifyOtp = () => {
    if (!otp) {
      showErrorToast("Please enter the OTP");
    } else {
      setLoader(true);
      verifyotp({
        email: email,
        otp: otp,
      })
        .then((res) => {
          setLoader(false);
          if (res.status === statusCode.HTTP_200_OK) {
            // Redirect to new password screen
            window.location.href = "/reset-password";
          } else {
            showErrorToast("Invalid OTP, please try again");
          }
        })
        .catch(() => {
          setLoader(false);
          showErrorToast("Invalid OTP, please try again");
        });
    }
  };

  const fetchContainer = () => {
    if (!otpSent) {
      return (
        <>
          <CardText className="textCard">
            Enter your email and we’ll send you an OTP to reset your password.
          </CardText>
          <Form
            className="auth-forgot-password-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="formRow">
              <Label for="login-email">Email*</Label>
              <Input
                type="email"
                id="login-email"
                placeholder="Please provide your email"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoFocus
                required
              />
            </div>

            <Button
              onClick={onSendOtp}
              className="submitButton btn-size"
              block
              disabled={loader}
            >
              {loader ? <Spinner size={"sm"} /> : "Send OTP"}
            </Button>
          </Form>
        </>
      );
    } else {
      return (
        <>
          <CardText className="textCard">
            Enter the OTP sent to your email to reset your password.
          </CardText>
          <Form
            className="auth-forgot-password-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="formRow">
              <Label for="otp">OTP*</Label>
              <Input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                name="otp"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                required
              />
            </div>

            <Button
              onClick={onVerifyOtp}
              className="submitButton btn-size"
              block
              disabled={loader}
            >
              {loader ? <Spinner size={"sm"} /> : "Verify OTP"}
            </Button>
          </Form>
        </>
      );
    }
  };

  return (
    <div className="registerWrapper">
      <div className="forgetPassDetail">
        <div className="formDetail">
          <CardTitle>
            Forgot Password <LockIcon />
          </CardTitle>
          {fetchContainer()}
          <div className="receivedContent">
            <div>
              {otpSent && (
                <>
                  {" "}
                  <span className="txtb">Didn't receive the OTP?</span>
                  <br />
                  <span
                    style={{ cursor: "pointer" }}
                    className="text-link"
                    onClick={onSendOtp}
                  >
                    {loader ? (
                      <Spinner size={"sm"} color="primary" />
                    ) : (
                      "Resend OTP"
                    )}
                  </span>
                </>
              )}
            </div>
            <Link to="/login" className="justify-content-center">
              <ChevronLeft className="rotate-rtl me-25" size={14} />
              <span className="align-middle">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
