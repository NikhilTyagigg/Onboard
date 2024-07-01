import React from "react";
import { Card, CardBody, Button, Input, Label } from "reactstrap";
import LocalStorageService from "../../services/localstorage.service";
import {
  verifyToken,
  updateUserPassword,
  updateUserProfile,
  getUserProfile,
  deleteUserProfile,
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
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const name = `${firstName} ${lastName}`;

    const phone = localStorage.getItem("phone");
    const gender = localStorage.getItem("identity");
    const userInfo = LocalStorageService.getUserInfo();
    this.state = {
      id: userInfo?.userid,
      name: name,
      email: email,
      phone: phone,
      gender: gender,
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
    //this.verifyToken(token);
    this.getUserDetails();
  }

  onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("refresh");
    LocalStorageService.clearToken();
    LocalStorageService.clearLocalStorage();
    window.location = "/";
  };

  getUserDetails = () => {
    const payload = {
      id: this.state.userInfo?.userId,
    };

    getUserProfile(payload)
      .then((res) => {
        console.log("Response received:", res); // Log the entire response for debugging

        this.setState({ loader: false });
        if (res.status == statusCode.HTTP_200_OK) {
          const data = res.data?.data;
          this.setState({
            name: data.name,
            phone: data.phone || "", // Handle null or undefined phone
            email: data.email,
            gender: data.gender,
          });
        } else {
          // Handle unexpected response status here if needed
          console.error("Unexpected response:", res);
          toast.error("Failed to fetch user details");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        toast.error("Network error occurred");
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
            localStorage.setItem("gender", this.state.gender);
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

  deleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      const payload = { userid: this.state.id };
      deleteUserProfile(payload)
        .then((res) => {
          if (res.status === statusCode.HTTP_200_OK) {
            toast.success("Account deleted successfully", {
              ...toastStyle.success,
            });
            this.onLogout();
          } else {
            toast.error("Could not delete account", { ...toastStyle.error });
          }
        })
        .catch((error) => {
          toast.error("Could not delete account", { ...toastStyle.error });
        });
    }
  };

  render() {
    const { edit, name, email, phone, gender, avatar, loader, updatePassword } =
      this.state;

    console.log("Render state:", this.state); // Debugging state

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <BarLoader
            color={"#1761fd"}
            loading={loader}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <CardBody>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : "./assets/images/icons/user.png"
                  }
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  width="100px"
                  style={{ border: "2px solid #1761fd" }}
                />
                <Edit2
                  className="edit-avatar-icon"
                  size={"16px"}
                  style={{
                    position: "absolute",
                    top: "75px",
                    right: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => this.setState({ edit: !edit })}
                />
                {edit && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={this.handleFileChange}
                    style={{
                      position: "absolute",
                      top: "100px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      opacity: 0,
                      width: "100px",
                      cursor: "pointer",
                    }}
                  />
                )}
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <Label for="name">First & Last Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={this.handleChange}
                readOnly={!edit}
                style={edit ? { border: "2px solid #1761fd" } : {}}
              />
              <Label for="phone">Phone Number *</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={this.handleChange}
                readOnly={!edit}
                style={edit ? { border: "2px solid #1761fd" } : {}}
              />
              <Label for="email">Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                readOnly={!edit}
                style={edit ? { border: "2px solid #1761fd" } : {}}
              />
              <Label for="gender">Identify Yourself *</Label>
              <Input
                type="select"
                id="gender"
                name="gender"
                value={gender}
                onChange={this.handleChange}
                disabled={!edit}
                style={edit ? { border: "2px solid #1761fd" } : {}}
              >
                <option value="" disabled>
                  Select Identity
                </option>
                <option value="visually">Visually Impaired</option>
                <option value="wheelchair">Wheelchair</option>
                <option value="elderly">Elderly</option>
                <option value="pregnant">Pregnant Women</option>
              </Input>
              {edit && (
                <>
                  <Button
                    color="primary"
                    className="save-button"
                    onClick={this.updateProfile}
                    style={{ marginTop: "20px" }}
                  >
                    Save
                  </Button>
                  <Button
                    color="danger"
                    className="delete-button"
                    onClick={this.deleteAccount}
                    // style={{ marginTop: "10px" }}
                  >
                    Delete Account
                  </Button>
                </>
              )}
            </div>
            {!edit && (
              <Button
                color="danger"
                onClick={this.onLogout}
                className="logout"
                style={{ marginTop: "20px" }}
              >
                Log out
              </Button>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default ProfilePage;
