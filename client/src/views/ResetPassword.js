import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft, Feather } from "react-feather";
import { statusCode } from "../utility/constants/utilObject";
import {
  renderLogoText,
  getQueryVariables,
  showErrorToast,
  showSuccessToast,
} from "../utility/helper";
import { resetPasswordHandler } from "../services/agent";
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
import InputPasswordToggle from "@components/input-password-toggle";
import { ReactComponent as LockIcon } from "../assets/icons/lockIcon.svg";
import { Message } from "../utility/constants/message";

const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);

  const fetchTokenFromString = () => {
    let queries = window.location.search.substring(1).split("&");
    return queries[0].substring(12);
  };

  const onSubmitResetPassword = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email");
    const token = queryParams.get("reset-token");
    if (!password) {
      showErrorToast(Message.MANDATORY_FIELDS);
    } else if (password.length < 6) {
      showErrorToast("Password length must be greator than 5 characters");
    } else if (password != confirmPassword) {
      showErrorToast("Passwords do not match. Please check again");
    } else {
      setLoader(true);
      resetPasswordHandler({
        password: password,
        token: token,
        email: email,
      })
        .then((res) => {
          setLoader(false);
          if (res.status == statusCode.HTTP_200_OK) {
            showSuccessToast("Your password has been successfully changes");
            window.location.replace("/login");
          } else {
            showErrorToast(res.message);
          }
        })
        .catch(() => {
          setLoader(false);
          showErrorToast(
            "Password could not be updated, please try again later"
          );
        });
    }
  };

  const fetchContainer = () => {
    return (
      <>
        <CardText className="textCard">
          Please provide the details bloew
        </CardText>
        <Form
          className="auth-forgot-password-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <Label className="label-text-password">New Password*</Label>
            <InputPasswordToggle
              className="input-group-merge"
              id="Enter your password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="form-group m-b-20">
            <Label className="label-text-password">Confirm Password*</Label>
            <InputPasswordToggle
              className="input-group-merge"
              id="Enter your password"
              name="confirmpassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          <Button
            onClick={onSubmitResetPassword}
            className="submitButton btn btn-secondary btn-size"
            block
            disabled={loader}
          >
            {loader ? <Spinner size={"sm"} /> : "Reset"}
          </Button>
        </Form>
      </>
    );
  };

  return (
    <div className="registerWrapper">
      <div className="topLeft"></div>
      <div className="forgetPassDetail">
        <Link className="brand-logo" to="/login">
          <img src={"/assets/images/logo/logoColor.png"} width="100%"></img>
        </Link>
        <div className="formDetail">
          <CardTitle>
            Reset Password <LockIcon />
          </CardTitle>
          {fetchContainer()}

          <div className="receivedContent">
            <div></div>
            <Link to="/login" className="justify-content-center">
              <ChevronLeft className="rotate-rtl me-25" size={14} />
              <span className="align-middle">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottomRight"></div>
    </div>
  );
};

export default ForgotPassword;
