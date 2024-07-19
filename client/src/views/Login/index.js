import { useSkin } from "@hooks/useSkin";
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
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
import "@styles/react/pages/page-authentication.scss";
import toast from "react-hot-toast";
import { toastStyle } from "../../utility/helper";
import {
  isValidEmail,
  isValidPassword,
  isAdmin,
  renderLogoText,
} from "../../utility/helper";
import {
  loginHandler,
  superLoginHandler,
  sendEmailVerification,
} from "../../services/agent";
import { statusCode } from "../../utility/constants/utilObject";
import { checkAuthAdmin } from "../../utility/auth/Routes";
import "./index.scss";
import LocalStorageService from "../../services/localstorage.service";
import { ReactComponent as Logo } from "../../assets/icons/logo.svg";
import { Message } from "../../utility/constants/message";

const Login = () => {
  const { skin } = useSkin();
  const [loader, setLoader] = React.useState(false);
  const [data, setData] = React.useState({
    email: "",
    password: "",
    phone: "",
  });
  const [showVerificationLink, setVerificationLink] = React.useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const setLoggedTime = () => {
    localStorage.setItem("logged", Date.now());
  };
  const [inputType, setInputType] = React.useState("email");
  const [inputName, setInputName] = React.useState("email");

  const handleChange1 = (e) => {
    const value = e.target.value;

    if (isValidEmail(value)) {
      setInputType("email");
      setInputName("email");
      setData({ ...data, email: value, phone: "" });
    } else {
      setInputType("tel");
      setInputName("phone");
      setData({ ...data, email: "", phone: value });
    }
  };

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = (e) => {
    console.log(data);
    e.preventDefault();
    if (!data.email && !data.phone) {
      console.log("yaha ");
      toast.error(Message.MANDATORY_FIELDS, { ...toastStyle.error });
    } else if (!data.password) {
      toast.error(Message.MANDATORY_FIELDS, { ...toastStyle.error });
    } else if (data.email && !isValidEmail(data.email)) {
      toast.error(Message.INVALID_EMAIL_ADDRESS, { ...toastStyle.error });
    } else {
      setLoader(true);
      // superLoginHandler({
      loginHandler({
        email: data.email || null,
        phone: data.phone || null,
        password: data.password,
      })
        .then((res) => {
          setLoader(false);
          if (res.status == statusCode.HTTP_200_OK) {
            setLoggedTime();

            LocalStorageService.setUserInfo(res.data.data);
            const nameArr = res.data.data.name.split(" ");
            localStorage.setItem("id", res.data.data.userId);
            localStorage.setItem("first_name", nameArr[0]);
            localStorage.setItem("last_name", nameArr[1]);
            localStorage.setItem("email", data.email);
            localStorage.setItem("user_role", res.data.data.role);
            localStorage.setItem("refresh_token", res.data.data.refreshToken);
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("city", res.data.data.city);
            toast.success("Welcome back " + nameArr[0], {
              ...toastStyle.success,
            });
            console.log("hey login = ", res.data.data);
            window.location.replace("/bus-list");
          } else {
            setLoader(false);
            let message = res.response.data.message;
            if (message == "USER_NOT_ACTIVE") {
              toast.error(Message.USER_NOT_ACTIVE, {
                ...toastStyle.error,
                duration: toastStyle.duration5,
              });
            } else if (message == "EMAIL_NOT_VERIFIED") {
              setVerificationLink(true);
              toast.error(Message.EMAIL_NOT_VERIFIED, {
                ...toastStyle.error,
                duration: toastStyle.duration5,
              });
            } else if (message == "USER_NOT_APPROVED") {
              toast.error(Message.USER_NOT_APPROVED, {
                ...toastStyle.error,
                duration: toastStyle.duration5,
              });
            } else if (res.response.status == 404) {
              toast.error(Message.INVALID_CREDENTAILS, {
                ...toastStyle.error,
                duration: toastStyle.duration5,
              });
            } else {
              toast.error(message, {
                ...toastStyle.error,
                duration: toastStyle.duration5,
              });
            }
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
          toast.error(err.message, {
            ...toastStyle.error,
            duration: toastStyle.duration5,
          });
        });
    }
  };

  const sendVerificationLink = () => {
    const payload = {
      email: data.email,
      origin: "",
    };
    setLoader(true);
    setVerificationLink(false);
    sendEmailVerification(payload)
      .then((res) => {
        setLoader(false);
        setVerificationLink(false);
        if (res.status == statusCode.HTTP_200_OK) {
          toast.success(Message.SENT_VERIFICATION_LINK, {
            ...toastStyle.success,
          });
        } else {
          let key = Object.keys(res.response.data);
          key = key[0];
          toast.success("Sending failed: " + res.response.data.detail, {
            ...toastStyle.error,
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        setVerificationLink(false);
        toast.success("Sending failed: " + err.message, {
          ...toastStyle.error,
        });
      });
  };

  return (
    <>
      <div className="loginWrapper">
        <div className="rightSection">
          <div className="formSection">
            <p className="loginTitle">Welcome</p>
            {showVerificationLink == true && (
              <CardText
                className="mb-2 alret alert-secondary"
                style={{ padding: "5px" }}
              >
                Haven’t received the verification link yet? Click{" "}
                <span
                  id="seconds"
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => sendVerificationLink()}
                >
                  here
                </span>{" "}
                to resend
              </CardText>
            )}
            <p className="loginText">Please sign-in to your account</p>
            <Form className="formDetail">
              <div className="formRow">
                <Label for="login-email">Email*</Label>
                <Input
                  type={inputType}
                  id="login-email"
                  placeholder="Enter your email/phone number"
                  autoFocus
                  name={inputName}
                  value={inputType === "email" ? data.email : data.phone}
                  onChange={handleChange1}
                />
              </div>
              <div className="formRow">
                <Label for="login-password">Password*</Label>
                <InputPasswordToggle
                  // className="input-group-merge"
                  id="Enter your password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="input-group-merge"
                />
                <Link className="forgotPass" to="/forgot-password">
                  <small>Forgot Password?</small>
                </Link>
                {!isAdmin() ? (
                  <p className="createAccountText">
                    <Link to="/register">
                      <span> Create an account?</span>
                    </Link>
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <Button
                className="submitButton"
                onClick={handleSubmit}
                disabled={loader}
              >
                {loader ? <Spinner color="#fff" size={"sm"} /> : "Sign in"}{" "}
              </Button>
            </Form>
            <p className="createAccountText"></p>
          </div>
        </div>
      </div>
      <div className="mobileDisplayPageContainer">
        <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
          <img
            className="img-fluid appMobileLogo"
            src={"/assets/images/logo/logoColor.png"}
            width="100%"
            alt="Login Cover"
          />
          <CardTitle tag="h2" className="fw-bold mb-1">
            Welcome to Onboard!
          </CardTitle>
          <CardText className="mb-2">Thanks for visiting our page!!</CardText>
          <CardText className="mb-2">{Message.MOBILE_MESSAGE}</CardText>
        </Col>
      </div>
    </>
  );
};

export default Login;
