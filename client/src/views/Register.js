import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import { statusCode } from "../utility/constants/utilObject";
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
import {
  toastStyle,
  blogTitleFormat,
  showErrorToast,
  showSuccessToast,
} from "../utility/helper";
import {
  getUserNameFromEmail,
  isValidEmail,
  isValidPassword,
  isValidMobile,
} from "../utility/helper";
import { signUpHandler, sendEmailVerification } from "../services/agent";
import { ReactComponent as EmailVerify } from "../assets/images/pages/Email-Verify.svg";
import { ChevronLeft } from "react-feather";
import { Message } from "../utility/constants/message";

const Register = () => {
  const { skin } = useSkin();

  const illustration =
    skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg";

  const [data, setData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    username: "",
    designation: "",
    company: "",
    mobile: "",
    purpose: "",
    iAgree: false,
  });
  const [loader, setLoader] = React.useState(false);

  const [status, setStatus] = React.useState(false);

  const [iAgree, SetIAgree] = React.useState(false);

  const [showVerificationPage, setShowVerificationPage] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const resetData = () => {
    setData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      username: "",
      designation: "",
      company: "",
      mobile: "",
      purpose: "",
      name: "",
    });
  };

  const sendVerificationLink = () => {
    const payload = {
      email: data.email,
      origin: "",
    };
    setLoader(true);
    sendEmailVerification(payload)
      .then((res) => {
        setLoader(false);
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
        toast.success("Sending failed: " + err.message, {
          ...toastStyle.error,
        });
      });
  };

  const handleSubmit = (e) => {
    // if(!data.first_name || !data.last_name || !data.email || !data.password || !data.designation || !data.purpose || !data.company){
    //   toast.error(Message.MANDATORY_FIELDS,{...toastStyle.error});
    // }else if(!iAgree){
    //   toast.error("Please accept the terms and conditions to signup",{...toastStyle.error});
    // }else if(!isValidEmail(data.email)){
    //   toast.error("Invalid email address",{...toastStyle.error});
    // }else if(!isValidPassword(data.password)){
    //   toast.error("Password length should be greater than 6",{...toastStyle.error});
    // }else if(data.mobile && !isValidMobile(data.mobile)){
    //   toast.error("Invalid phone number",{...toastStyle.error});
    {
      const payload = {
        ...data,
        role: 1,
        name: data.first_name,
        username: getUserNameFromEmail(data.email),
      };
      setLoader(true);
      signUpHandler(payload)
        .then((res) => {
          console.log("Res :", res);
          setLoader(false);
          if (res.status == statusCode.HTTP_200_OK) {
            setStatus(true);
            showSuccessToast(
              "Your account is successfully created.Please go back and login!!"
            );
            //setShowVerificationPage(true);
            // window.location.replace('/login');

            let seconds = 5;
            let foo = setInterval(function () {
              document.getElementById("seconds").innerHTML = seconds;
              seconds--;
              if (seconds == -1) {
                clearInterval(foo);
                //setShowVerificationPage(true);
                window.location.replace("/login");
              }
            }, 1000);
          } else if (res.request.status == statusCode.HTTP_400_BAD_REQUEST) {
            {
              showErrorToast(res.response.data.message);
            }
          }
        })
        .catch((err) => {
          setLoader(false);
          showErrorToast("Something went wrong, Please try after some time");
        });
    }
  };

  const onChecked = () => {
    SetIAgree(iAgree ? false : true);
  };

  return (
    <div className="registerWrapper">
      {!showVerificationPage ? (
        <div className="forgotPassSection">
          <div className="formDetail">
            <Col className="formCard">
              <CardTitle>
                <div className="text-center">Sign Up</div>
              </CardTitle>
              {status == true && (
                <CardText className="mb-2">
                  You should be automatically redirected to the login page in{" "}
                  <span id="seconds">5</span> seconds.
                </CardText>
              )}
              <Form
                className="formSection"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="cardRow">
                  <div className="w-50">
                    <Label for="register-username">First Name *</Label>
                    <Input
                      type="text"
                      id="register-username"
                      placeholder="First Name"
                      name="first_name"
                      autoFocus
                      value={data.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-50">
                    <Label for="register-username">Last Name *</Label>
                    <Input
                      type="text"
                      id="register-username"
                      placeholder="Last Name"
                      name="last_name"
                      value={data.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="cardRow">
                  <div className="w-50">
                    <Label for="designation">Email *</Label>
                    <Input
                      className="input-group-merge"
                      id="designation"
                      name="email"
                      placeholder="john@example.com"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-50">
                    <Label for="phone-number">Password</Label>
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="register-password"
                      placeholder="password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="cardRow">
                  <div className="w-100">
                    <Label for="register-password">Phone Number *</Label>
                    <Input
                      className="input-group-merge"
                      id="phone-number"
                      name="mobile"
                      placeholder="Phone number"
                      value={data.mobile}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* <div className="cardRow">
                  <div className="w-100">
                    <Label for="register-email">
                      Designation *
                    </Label>
                    <Input
                      type="email"
                      id="register-email"
                      placeholder="Designation"
                      name="email"
                      value={data.email}                   
                      onChange={handleChange}
                    />
                  </div>
                </div> */}

                <div className="policyCheckBox">
                  <Input
                    type="checkbox"
                    id="terms"
                    checked={iAgree}
                    onChange={() => onChecked()}
                  />
                  <Label for="terms">
                    I agree to
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      privacy policy & terms
                    </a>
                  </Label>
                </div>
                {
                  <div className="submitButtonRow">
                    <div className="buttonCard">
                      <Button className="submit" onClick={handleSubmit}>
                        {loader ? (
                          <Spinner color="#1761fd" size="sm" />
                        ) : (
                          "Sign up"
                        )}
                      </Button>
                      {!loader && (
                        <p>
                          Already have an account,
                          <Link to="/login">
                            <span>Sign In</span>
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                }
              </Form>
            </Col>
          </div>
        </div>
      ) : (
        <div className="verificationDetail">
          <Link className="brand-logo" to="/login">
            <img src={"/assets/images/logo/logoColor.png"} width="80%"></img>
          </Link>
          <div className="forgetPass align-items-center">
            <p className="titleCard">Verify your email</p>
            <div className="imgBox">
              <EmailVerify />
            </div>
            <p className="textArea">{Message.SENT_EMAIL_VERIFICATION_LINK} </p>
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
