import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft, Feather } from "react-feather";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { sendResetPasswordLinkHandler } from "../services/agent";
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
  const [loader, setLoader] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);

  const onSubmitResetPassword = () => {
    if (!email) {
      showErrorToast("Please provide your email to proceed");
    } else {
      setLoader(true);
      sendResetPasswordLinkHandler({
        origin: window.location.origin,
        email: email,
      })
        .then((res) => {
          setLoader(false);
          if (res.status == statusCode.HTTP_200_OK) {
            setSubmitStatus(true);
            showSuccessToast("Reset email has been sent to " + email);
          } else {
            showErrorToast(
              "Reset email could not be sent, please try again later"
            );
          }
        })
        .catch(() => {
          setLoader(false);
          showErrorToast(
            "Reset email could not be sent, please try again later"
          );
        });
    }
  };

  const fetchContainer = () => {
    if (!submitStatus) {
      return (
        <>
          <CardText className="textCard">
            Enter your email and we’ll send you instructions to reset your
            password.
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
              onClick={onSubmitResetPassword}
              className="submitButton btn-size"
              block
              disabled={loader}
            >
              {loader ? <Spinner size={"sm"} /> : "Send Reset Link"}
            </Button>
          </Form>
        </>
      );
    } else {
      return (
        <CardText className="textCard primary">
          Reset password email has been sent to {email}
        </CardText>
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
          {/* <p>Didn't Received Email?</p> */}
          <div className="receivedContent">
            <div>
              {/* {submitStatus &&<> <span className="">Didn't Received Email?</span><br/> */}
              {submitStatus && (
                <>
                  {" "}
                  <span className="txtb">Didn't receive the email?</span>
                  <br />
                  <span
                    style={{ cursor: "pointer" }}
                    className="text-link"
                    onClick={onSubmitResetPassword}
                  >
                    {loader ? (
                      <Spinner size={"sm"} color="primary" />
                    ) : (
                      "Resend Email"
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
