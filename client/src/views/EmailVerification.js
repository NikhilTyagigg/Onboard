import React, { Fragment, Component } from 'react'
import { Link, useSearchParams } from "react-router-dom"
import { useSkin } from "@hooks/useSkin"
import { statusCode } from "../utility/constants/utilObject"
import { renderLogoText, getQueryVariables, showErrorToast, showSuccessToast } from "../utility/helper"
import { sendEmailVerification, verifyEmail  } from "../services/agent"
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap"

import {ReactComponent as Logo} from "../assets/icons/logo.svg"
import {ReactComponent as EmailVerify} from "../assets/images/pages/Email-Verify.svg"
import { ChevronLeft } from "react-feather"

class EmailVerification extends Component {
    constructor(props) {
      super(props)
      const queryParams = new URLSearchParams(window.location.search)
      const email = queryParams.get("email");
      const token = queryParams.get("auth-token");
      this.state = {
        email: email,
        token: token,
        status: false,
        loader: true,
        showSendVefificationLink: false
      }
    }

    componentDidMount(){
      this.onEmailVerification()
    }

    sendVerificationLink = () => {
      const payload = {
        email: this.state.email,
        origin: ''
      }
      this.setState({loader: true, message: ""});
      sendEmailVerification(payload).then((res)=>{
            if (res.status == statusCode.HTTP_200_OK) {    
              this.setState({
                loader: false,
                status: true,
                message: "We have shared a verification link to your email. Please check your inbox for the same!"
              });
            } else {
              let key = Object.keys(res.response.data);
              key = key[0];
              this.setState({status:false, loader: false, message: "Sending failed: "+res.response.data.detail});
             
            }
          }).catch((err)=>{
            this.setState({
              loader: false,
              status: false,
              message: err.message
            });
          })
    }
  
    onEmailVerification = () => {
      const payload = {
          email: this.state.email,
          verify_token: this.state.token,
        }
      if(this.state.email && this.state.token){
          verifyEmail(payload).then((res)=>{
              if (res.status == statusCode.HTTP_200_OK) {
                this.setState({status:true, loader: false, message: "Your email verification is successful!"});
                let seconds = 15;
                let foo = setInterval(function () {
                  document.getElementById("seconds").innerHTML = seconds;
                  seconds--;
                  if (seconds == -1) {
                      clearInterval(foo);
                      window.location.replace('/login');
                  }
                }, 1000);
              } else {
                this.setState({status:false, showSendVefificationLink: res.response.data.detail == "User email verification link has expired" ? true : false, loader: false, message: res.response.data.detail});
              }
            }).catch((err)=>{
              this.setState({status:false, loader: false, message: err.message});
          })
      }else{
        this.setState({status:false, loader: false, message: "Email verification failed, please try again later"});
      }
    }

    render(){
      return (
        <div className="registerWrapper">
          <div className="topLeft"></div>
            <div className="verificationDetail">
                <Link className="brand-logo " to="/login">
                  <Logo />
                </Link>
               <div className="forgetPass align-items-center">
              <p className={`${this.state.loader ? '': 'titleCard'}  ${this.state.status ? 'primary' : 'text-danger'}`}>
                {
                    this.state.loader ? <Spinner size={'12px'} color="primary" /> : this.state.status ? 'Email verified successfully' : 'Email verification failed'
                }
              </p>
              <div className="imgBox">
                <EmailVerify />
              </div>
              <p className={`textArea ${this.state.status ? 'primary' : 'text-danger'}`}>{this.state.message}</p>              
              {
                this.state.status === true && <p>
                  You should be automatically redirected in <span id="seconds">7</span> seconds.
                </p>
              }
              {
                this.state.showSendVefificationLink === true &&
                <CardText className="mb-2">
                  Your verification link has expired. 
                  Click <a onClick={()=>this.sendVerificationLink()} href="javascript:void(0)" style={{fontStyle: 'italic', fontWeight: 'bold'}} > here </a> to resend the verification link!
                </CardText>
              }
              <Link to="/login" className="backToHome">
                <ChevronLeft/>
                <span>Back To Home Page</span>
              </Link>
            </div>
            </div>
          <div className="bottomRight"></div>
        </div>
      )
    
    
    }

}

export default EmailVerification
