import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { statusCode } from "../utility/constants/utilObject";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { resetPasswordHandler } from "../services/agent";
import {
  Form,
  Label,
  Input,
  Button,
  Spinner,
  FormGroup,
  InputGroup,
  InputGroupText,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import InputPasswordToggle from "@components/input-password-toggle";
import { Message } from "../utility/constants/message";

const ResetPassword = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const location = useLocation();
  const { userD } = location.state || {};
  const [payload, setPayload] = useState({
    // add logic to set this
    email: userD, // add logic to set this
    password: "",
    confirmPassword: "",
  });

  const onSubmitResetPassword = () => {
    if (!password) {
      showErrorToast(Message.MANDATORY_FIELDS);
    } else if (password.length < 8) {
      showErrorToast("Password must be at least 8 characters long");
    } else if (password !== confirmPassword) {
      showErrorToast("Passwords do not match. Please check again");
    } else if (!agreeTerms) {
      showErrorToast("Please agree to the terms and conditions");
    } else {
      setLoader(true);
      console.log(payload);
      resetPasswordHandler(payload)
        .then((res) => {
          setLoader(false);
          if (res.status == statusCode.HTTP_200_OK) {
            showSuccessToast("Your password has been successfully changed");
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.content}>
          <h2 style={styles.title}>Set New Password</h2>
          <Form style={styles.form} onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label for="password">Password*</Label>
              <InputPasswordToggle
                className="input-group-merge"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPayload({ ...payload, password: e.target.value });
                }}
                required
                minLength="8"
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirm-password">Confirm Password*</Label>
              <InputPasswordToggle
                className="input-group-merge"
                id="confirm-password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPayload({ ...payload, confirmPassword: e.target.value });
                }}
                required
              />
            </FormGroup>
            <FormGroup check>
              <Input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <Label for="terms" check>
                I agree with the <Link to="/terms">Terms & Conditions</Link> of
                iWayplus Pvt. Ltd.
              </Label>
            </FormGroup>
            <Button
              color="primary"
              block
              onClick={onSubmitResetPassword}
              disabled={loader}
              style={styles.button}
            >
              {loader ? <Spinner size="sm" /> : "Confirm"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  inner: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "0.375rem",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.1)",
  },
  content: {
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  form: {
    marginTop: "2rem",
  },
  button: {
    marginTop: "2rem",
    backgroundColor: "#7367f0",
    borderColor: "#7367f0",
  },
};

export default ResetPassword;
