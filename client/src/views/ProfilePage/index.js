import React from "react";
import {
  Card,
  CardBody
} from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import LocalStorageService from "../../services/localstorage.service";
import { verifyToken, updateUserPassword, updateUserProfile, getUserProfile } from "../../services/agent";
import "./index.scss"
import toast from 'react-hot-toast'
import { toastStyle } from "../../utility/helper"
import { statusCode } from "../../utility/constants/utilObject";
import BarLoader from "react-spinners/BarLoader";
import { Edit2 } from 'react-feather'

const override = {
  borderColor: "#1761fd",
  width: '100%'
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    const email = localStorage.getItem('email');
    const userInfo = LocalStorageService.getUserInfo();
    this.state = {
      id: userInfo?._id,
      username: "",
      firstName: "",
      lastName: "",
      email: email,
      mobile: '',
      company: "",
      designation: "",
      purpose: "",
      cname: "",
      oldPass:"",
      newPass:"",
      retypeNewPass:"",
      confirmPassword: "",
      updatePassword: false,
      showProjects: false,
      userInfo: LocalStorageService.getUserInfo(),
      userPlanDetails: "",
      loader: true,
      edit: false
    };
    
  }

  componentDidMount (){
    localStorage.removeItem('active_doc')
    const token = LocalStorageService.getAccessToken();
    verifyToken({token: token});
    this.getUserPlan();
    this.getUserDetails();
  }

  onLogout = () => {
    // Remove Auth Details
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    localStorage.removeItem('first_name')
    localStorage.removeItem('last_name')
    localStorage.removeItem('email')
    localStorage.removeItem('refresh')
  }

  getUserDetails = () => {
    const payload = {
      id: this.state.userInfo?._id
    }
    getUserProfile(payload).then(res => {
        this.setState({loader: false})
        if(res.status == statusCode.HTTP_200_OK){
          const data = res.data?.data;
          this.setState({
            firstName: data.first_name,
            lastName: data.last_name,
            designation: data.designation,
            company: data.company,
            mobile: data.mobile,
            purpose: data.purpose,
          })
        }else{
          toast.success(Message.SOME_THING_WRONG,{...toastStyle.error});
        }
      }
    ).catch(error => {
      this.setState({loader: false})
      toast.error(Message.SOME_THING_WRONG, {
        ...toastStyle.error,
      });
    })
  }

  handleChange=(e)=>{
    this.setState({ [e.target.name]:e.target.value})
  }
  resetClick=()=>{
    this.setState({
      username: "",
      name: "",
      email: "",
      cname: "",
      oldPass:"",
      newPass:"",
      confirmPassword: "",
      retypeNewPass:""
    });
  }

  showResetPassword = (status) => {
    this.setState({updatePassword: status});
    this.resetClick();
  }

  updatePassword = () => {
    if(this.state.newPass.trim() && this.state.confirmPassword.trim() && this.state.oldPass.trim()){
      if(this.state.newPass == this.state.confirmPassword){ 
        let payload = {
          password: this.state.oldPass.trim(),
          new_password: this.state.confirmPassword.trim()
        }     
          updateUserPassword(payload).then(res=>{

            if(res.status == statusCode.HTTP_200_OK){
              toast.success('Password updated successfully', {...toastStyle.success});
              onLogout()
              setTimeout(()=>{
                LocalStorageService.clearToken();
                LocalStorageService.clearLocalStorage();
                window.location = '/';
              }, 1000)
              
            }else{
                toast.error(JSON.stringify(res.response.data), {...toastStyle.error});
            }
          }).catch(error=> {
            toast.error('Could not updated user password', {...toastStyle.error});
          })
      }else{
        toast.error("There is a mismatch between the new password and the confirm password", {
          ...toastStyle.error,
        })
      }
    }else{
      toast.error("The * fields are mandatory", {
        ...toastStyle.error,
      })
    }
  }

  editProfile = (status) => {
    this.setState({edit: status})
  }

  validateInput = () => {
    if(this.state.id && this.state.firstName?.trim() &&
      this.state.lastName.trim() && this.state.designation?.trim() &&
      this.state.company?.trim() &&
      this.state.purpose?.trim()
    ){
      return true
    }else{
      return false
    }
  }

  updateProfile = () => {
    if(this.validateInput()){      
        let payload = {
          "user": this.state.id,
          "first_name": this.state.firstName,
          "last_name": this.state.lastName,
          "designation": this.state.designation,
          "company": this.state.company,
          "mobile": this.state.mobile,
          "purpose": this.state.purpose,
        }
        updateUserProfile(payload).then(res=>{
          if(res.status == statusCode.HTTP_200_OK){
            localStorage.setItem('first_name', this.state.firstName)
            localStorage.setItem('last_name', this.state.lastName)
            this.getUserDetails();
            toast.success('Profile updated successfully', {...toastStyle.success});              
          }else{
              toast.error(JSON.stringify(res.response.data), {...toastStyle.error});
          }
        }).catch(error=> {
          toast.error('Could not updated user profile', {...toastStyle.error});
        })
    }else{
      toast.error("The * fields are mandatory", {
        ...toastStyle.error,
      })
    }
  }

  render() {
    return (
      <Card className="card-h">
        <BarLoader
            color={"#1761fd"}
            loading={this.state.loader}                        
            size={'100%'}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
        <div className="row row-h">
          {!this.state.edit && <div className="col-sm-2"></div>}
          <div className="col-sm-7">
              <div className='container-fluid innerContainerPadding'>
                <CardBody>
                  <div className="row">
                    <div className="col-lg-12">
                        <div className="card-body">
                          <img src="./assets/images/icons/user.png" alt="avatar"
                            className="rounded-circle img-fluid" width="60px" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="card mb-4">
                        <div className="card-body">
                          <h4 className="mb-1">
                            My Profile 
                              {!this.state.edit && <span className="ml-10 edit-icon" onClick={()=>this.editProfile(true)} >
                                  <Edit2 
                                      className="action-icon action-icon-mr" 
                                      size={"16px"}                                         
                                      cursor={'pointer'} 
                                      />
                              </span>}
                          </h4>
                          <div className="row form-group">
                            <div className="col-sm-6">
                              <label className="mb-1">First Name {this.state.edit? '*' : ''}</label>
                              <input type="text" required readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.firstName} onChange={(e)=>this.setState({'firstName': e.target.value})}></input>
                            </div>
                            <div className="col-sm-6">
                            <label className="mb-1">Last Name {this.state.edit? '*' : ''}</label>
                              <input type="text" readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.lastName} onChange={(e)=>this.setState({'lastName': e.target.value})}></input>
                            </div>
                          </div>
                          
                          <div className="row form-group">
                            <div className="col-sm-8">
                              <label className="mb-1">Email {this.state.edit? '*' : ''}</label>
                              <input type="text" readOnly={true} className="form-control input-box-bg" value={this.state.userInfo.email}></input>
                            </div>
                          </div>
                          
                          <div className="row form-group">
                            <div className="col-sm-8">
                              <label className="mb-1">Mobile</label>
                              <input type="text" readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.mobile} onChange={(e)=>this.setState({'mobile': e.target.value})}></input>
                            </div>
                          </div>
                          
                          <div className="row form-group">
                            <div className="col-sm-8">
                              <label className="mb-1">Company Name {this.state.edit? '*' : ''}</label>
                              <input type="text" readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.company} onChange={(e)=>this.setState({'company': e.target.value})}></input>
                            </div>
                          </div>
                        
                          <div className="row form-group">
                            <div className="col-sm-8">
                              <label className="mb-1">Designation {this.state.edit? '*' : ''}</label>
                              <input type="text" readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.designation} onChange={(e)=>this.setState({'designation': e.target.value})}></input>
                            </div>
                          </div>

                          <div className="row form-group">              
                            <div className="col-sm-8">
                              <label className="mb-1">Purpose Of Use {this.state.edit? '*' : ''}</label>
                              <input type="text" readOnly={!this.state.edit} className="form-control input-box-bg" value={this.state.purpose} onChange={(e)=>this.setState({'purpose': e.target.value})}></input>
                            </div>
                          </div>
                          {this.state.edit && <div className="d-flex mb-2">
                            <button className="btn btn-primary btn-sm update-button " style={{marginRight: '10px'}} onClick={()=>{
                                  this.updateProfile()   
                                }}>Update</button>

                            <button className="btn btn-seconday" onClick={()=>this.editProfile(false)}>
                              Cancel
                            </button>
                          </div>}
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </CardBody>
              </div>
          </div>
          {this.state.edit && <div className="col-sm-5 update-password-bg">
          <div className='container-fluid innerContainerPadding'>
                <CardBody>
                  <div className="row">
                    <div className="col-lg-12">
                        <div className="card-body" style={{color: '#000000', opacity: '0.9', height: '96px'}}>
                          
                        </div>
                    </div>
                  </div>
                  <div className="card mb-4 update-password-bg">        
                    <div className="card-body" style={{color: '#000000', opacity: '0.9'}}>
                      <h4 className="mb-1" style={{color: '#000000', opacity: '0.9'}}>Change Password</h4>
                    <div className="row">
                    <div className="col-lg-12">
                      <label>
                        Verify Current password *
                      </label>
                      <p className=" mb-1">              
                      <InputPasswordToggle
                        className="input-group-merge"
                        id="old-password"
                        placeholder="Old Password"
                        name="oldPass"
                        value={this.state.oldPass}
                        onChange={this.handleChange}
                      />
                      </p>
                    </div>
                    <div className="col-lg-12">
                      <label>
                      New password *
                      </label>
                      <p className=" mb-1">
                        <InputPasswordToggle
                          className="input-group-merge"
                          id="new-password"
                          placeholder="New password"
                          name="newPass"
                          value={this.state.newPass}
                          onChange={this.handleChange}
                        />
                      </p>
                    </div>
                    <div className="col-lg-12">
                      <label>
                        Confirm new password *
                      </label>
                      <p className=" mb-1">
                        <InputPasswordToggle
                          className="input-group-merge"
                          id="confirm-password"
                          placeholder="Confirm password"
                          name="confirmPassword"
                          value={this.state.confirmPassword}
                          onChange={this.handleChange}
                        />          
                      </p>
                    </div>
                    </div>
                    <div className="d-flex mb-2">
                      <button className="btn btn-primary btn-sm update-button " style={{marginRight: '10px'}} onClick={()=>{
                            this.updatePassword()   
                          }}>Update</button>

                      <button className="btn btn-seconday" onClick={()=>this.editProfile(false)}>
                        Cancel
                      </button>
                    </div>
                    </div>
                  </div>
                </CardBody>
              </div>
          </div>}
        </div>
        
      </Card>
    );
  }
}

export default ProfilePage;


        {/* <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-1 row">
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <Label className="form-label" for="login-old-password">
                  Old Password
                </Label>
                <Link to="/forgot-password">
                  <small>Forgot Password?</small>
                </Link>
              </div>
              <InputPasswordToggle
                className="input-group-merge"
                id="Old password"
                name="old-password"
                value={this.state.oldPass}
                onChange={e=>this.setState({oldPass:e.target.value})}
              />
            </div>
          </div>
          <div className="mb-1 row">
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <Label className="form-label" for="login-new-password">
                  New Password
                </Label>
              </div>
              <InputPasswordToggle
                className="input-group-merge"
                id="New password"
                name="new-password"
                value={this.state.newPass}
                onChange={e=>this.setState({newPass:e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <Label className="form-label" for="login-retype-new-password">
                  Retype New Password
                </Label>
              </div>
              <InputPasswordToggle
                className="input-group-merge"
                id="Retype New password"
                name="retype-new-password"
                value={this.state.retypeNewPass}
                onChange={e=>this.setState({retypeNewPass:e.target.value})}
              />
            </div>
            <div className="row mt-1">
              <div>
                <button
                  type="button"
                  className="btn mt-2 mr-1 btn-primary"
                  style={{ marginRight: "14px" }}
                >
                  {" "}
                  Save changes{" "}
                </button>
                <button type="reset" className="btn mt-2 btn-outline-secondary" onClick={this.resetClick}>
                  {" "}
                  Reset{" "}
                </button>
              </div>
            </div>
            <div className="row mt-1">
              <div>
                <button 
                    className="btn mt-2 btn-outline-secondary" 
                    onClick={()=>{
                      onLogout()
                      window.location.reload()
                    }}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </CardBody> */}