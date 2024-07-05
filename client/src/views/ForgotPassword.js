import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft } from "react-feather";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { sendResetPasswordEmail } from "../services/agent";
import { checkUser } from "../services/agent"; // Import checkUser function
import { CardText, Form, Label, Input, Button, Spinner } from "reactstrap";
import { statusCode } from "../utility/constants/utilObject";

const ForgotPassword = () => {
  const { skin } = useSkin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");

  const onSendOtp = async () => {
    if (!email) {
      showErrorToast("Please provide your email to proceed");
      return;
    }

    setLoader(true);

    try {
      const userCheckRes = await checkUser({ email });

      if (userCheckRes.status == statusCode.HTTP_200_OK) {
        const res = await sendResetPasswordEmail({ email });
        setLoader(false);

        if (res.status == 200) {
          console.log("OTP email sent successfully.");
          console.log(email, res.data.otp);
          setOtp(res.data.otp);
          showSuccessToast("OTP has been sent to " + email);
          navigate("/otpe-verification", {
            state: { userData: email, otp: res.data.otp },
          });
        } else {
          showErrorToast("OTP could not be sent, please try again later");
        }
      } else {
        setLoader(false);
        showErrorToast("User check failed, please try again later");
      }
    } catch (error) {
      setLoader(false);
      showErrorToast("An error occurred, please try again later");
    }
  };

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    maxWidth: "400px",
    margin: "auto",
    marginTop: "150px",
  };

  const formRowStyle = {
    marginBottom: "1.5rem",
  };

  const buttonStyle = {
    backgroundColor: "#7367f0",
    borderColor: "#7367f0",
    padding: "0.75rem",
    fontSize: "1rem",
  };

  const linkStyle = {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    color: "#7367f0",
  };

  const textCardStyle = {
    marginBottom: "1.5rem",
    fontSize: "1rem",
    color: "#6c757d",
    textAlign: "center",
  };

  return (
    <div className="auth-wrapper auth-forgot-password">
      <div className="auth-inner">
        <div style={cardStyle}>
          <div className="card-body">
            <CardText style={textCardStyle}>
              Enter your email and we’ll send you an OTP to reset your password.
            </CardText>
            <Form
              className="auth-forgot-password-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div style={formRowStyle}>
                <Label for="login-email">Email*</Label>
                <Input
                  type="email"
                  id="login-email"
                  placeholder="Please provide your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <Button
                onClick={onSendOtp}
                style={buttonStyle}
                className="submitButton btn-size"
                block
                disabled={loader}
              >
                {loader ? <Spinner size={"sm"} /> : "Send OTP"}
              </Button>
            </Form>

            <Link to="/login" style={linkStyle}>
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
