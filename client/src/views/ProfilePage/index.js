import React from "react";
import { Card, CardBody } from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import LocalStorageService from "../../services/localstorage.service";
import {
  verifyToken,
  updateUserPassword,
  updateUserProfile,
  getUserProfile,
} from "../../services/agent";
import "./index.scss";
import toast from "react-hot-toast";
import { toastStyle } from "../../utility/helper";
import { statusCode } from "../../utility/constants/utilObject";
import BarLoader from "react-spinners/BarLoader";
import { Edit2 } from "react-feather";

const override = {
  borderColor: "#1761fd",
  width: "100%",
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("first_name");
    const phone = localStorage.getItem("phone");
    const userInfo = LocalStorageService.getUserInfo();
    this.state = {
      id: userInfo?.userid,
      name: name,
      email: email,
      phone: phone,
      gender: "",
      oldPass: "",
      newPass: "",
      retypeNewPass: "",
      updatePassword: false,
      userInfo: LocalStorageService.getUserInfo(),
      loader: true,
      edit: false,
      avatar: null,
    };
  }

  componentDidMount() {
    localStorage.removeItem("active_doc");
    const token = LocalStorageService.getAccessToken();
    verifyToken({ token: token });
    this.getUserDetails();
  }

  onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("refresh");
  };

  getUserDetails = () => {
    const payload = {
      id: this.state.userInfo?.userid,
    };
    getUserProfile(payload)
      .then((res) => {
        this.setState({ loader: false });
        if (res.status === statusCode.HTTP_200_OK) {
          const data = res.data?.data;
          this.setState({
            name: data.name,
            phone: data.phone,
            email: data.email,
            gender: data.gender,
          });
        } else {
          toast.success("Something went wrong", { ...toastStyle.error });
        }
      })
      .catch((error) => {
        this.setState({ loader: false });
        toast.error("Something went wrong", { ...toastStyle.error });
      });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ avatar: e.target.files[0] });
  };

  resetClick = () => {
    this.setState({
      name: "",
      email: "",
      phone: "",
      gender: "",
      oldPass: "",
      newPass: "",
      retypeNewPass: "",
    });
  };

  showResetPassword = (status) => {
    this.setState({ updatePassword: status });
    this.resetClick();
  };

  updatePassword = () => {
    const { newPass, retypeNewPass, oldPass } = this.state;
    if (newPass.trim() && retypeNewPass.trim() && oldPass.trim()) {
      if (newPass === retypeNewPass) {
        let payload = {
          password: oldPass.trim(),
          new_password: retypeNewPass.trim(),
        };
        updateUserPassword(payload)
          .then((res) => {
            if (res.status === statusCode.HTTP_200_OK) {
              toast.success("Password updated successfully", {
                ...toastStyle.success,
              });
              this.onLogout();
              setTimeout(() => {
                LocalStorageService.clearToken();
                LocalStorageService.clearLocalStorage();
                window.location = "/";
              }, 1000);
            } else {
              toast.error(JSON.stringify(res.response.data), {
                ...toastStyle.error,
              });
            }
          })
          .catch((error) => {
            toast.error("Could not update user password", {
              ...toastStyle.error,
            });
          });
      } else {
        toast.error(
          "There is a mismatch between the new password and the confirm password",
          { ...toastStyle.error }
        );
      }
    } else {
      toast.error("The * fields are mandatory", { ...toastStyle.error });
    }
  };

  editProfile = (status) => {
    this.setState({ edit: status });
  };

  validateInput = () => {
    const { id, name, email, phone, gender } = this.state;
    return id && name.trim() && email.trim() && phone.trim() && gender.trim();
  };

  updateProfile = () => {
    if (this.validateInput()) {
      let payload = {
        userid: this.state.id,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        gender: this.state.gender,
      };
      updateUserProfile(payload)
        .then((res) => {
          if (res.status === statusCode.HTTP_200_OK) {
            localStorage.setItem("name", this.state.name);
            localStorage.setItem("email", this.state.email);
            localStorage.setItem("phone", this.state.phone);
            this.getUserDetails();
            toast.success("Profile updated successfully", {
              ...toastStyle.success,
            });
          } else {
            toast.error(JSON.stringify(res.response.data), {
              ...toastStyle.error,
            });
          }
        })
        .catch((error) => {
          toast.error("Could not update user profile", { ...toastStyle.error });
        });
    } else {
      toast.error("The * fields are mandatory", { ...toastStyle.error });
    }
  };

  render() {
    return (
      <Card className="card-h center-box">
        <BarLoader
          color={"#1761fd"}
          loading={this.state.loader}
          size={"100%"}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <CardBody>
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="profile-avatar">
                <img
                  src={
                    this.state.avatar
                      ? URL.createObjectURL(this.state.avatar)
                      : "./assets/images/icons/user.png"
                  }
                  alt="avatar"
                  className="rounded-circle img-fluid avatar"
                  width="100px"
                />
                {this.state.edit && (
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleFileChange}
                    />
                  </div>
                )}
              </div>
              <div className="profile-form mt-4">
                <h4 className="mb-4 profile-title">
                  My Profile
                  {!this.state.edit && (
                    <span
                      className="ml-2 edit-icon"
                      onClick={() => this.editProfile(true)}
                    >
                      <Edit2
                        className="action-icon action-icon-mr"
                        size={"16px"}
                        cursor={"pointer"}
                      />
                    </span>
                  )}
                </h4>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    readOnly={!this.state.edit}
                    className="form-control input-box-bg"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    readOnly={!this.state.edit}
                    className="form-control input-box-bg"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="text"
                    readOnly={!this.state.edit}
                    className="form-control input-box-bg"
                    value={this.state.phone}
                    onChange={(e) => this.setState({ phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    className="form-control input-box-bg"
                    readOnly={!this.state.edit}
                    value={this.state.gender}
                    onChange={(e) => this.setState({ gender: e.target.value })}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {this.state.edit && (
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary mt-1 waves-effect waves-light"
                      onClick={() => this.updateProfile()}
                    >
                      Submit
                    </button>
                    <button
                      type="reset"
                      className="btn btn-outline-primary mt-1 waves-effect waves-light"
                      onClick={() => this.editProfile(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default ProfilePage;
