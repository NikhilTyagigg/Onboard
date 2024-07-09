import React, { Fragment, Component } from "react";
import {
  getMasterData,
  addRouteConfig,
  getRouteConfig,
} from "../../services/agent";
import { Card, Spinner, Table } from "reactstrap";
import toast from "react-hot-toast";
import { statusCode } from "../../utility/constants/utilObject";
import { toastStyle, utcToLocal } from "../../utility/helper";
import {
  Circle,
  Edit3,
  Plus,
  RefreshCcw,
  Search,
  Square,
  Trash,
  Trash2,
} from "react-feather";
import "./index.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CustomDropdown from "../../component/CustomDropdown";
import CustomInputBox from "../../component/CustomInputBox";
import BarLoader from "react-spinners/BarLoader";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Countdown from "react-countdown";

const override = {
  borderColor: "#1761fd",
  width: "100%",
};

class RouteConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeConfigList: [],
      userListOrg: [],
      loader: false,
      searchFilter: "",
      selectedUserForDocument: null,
      showModePopup: false,
      type: "",
      status: "",
      email: "",
      filterByText: "",
      viewTokenDetails: [],
      tokenDetails: [],
      loading: [],
      updateToken: [],
      months: [],
      credits: [],
      updating: [],
      activePage: 1,
      totalItemsCount: 0,
      pageRangeDisplayed: 10,
      itemsCountPerPage: 12,
      date: new Date(),
      routes: [],
      vehicles: [],
      newConfigInfo: {},
      waitingForAck: null,
      remianingTime: 0,
      refreshTime: null,
    };
  }

  componentDidMount = () => {
    this.getMasterData();
    this.getRouteConfig();
  };

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber }, () => {
      this.loadAllUsers();
    });
  }

  changeTab = (index) => {
    this.setState({ selectedTab: index });
  };

  handleSearch = (e) => {
    this.setState({ searchFilter: e.target.value });
  };

  showPopup = (email, status = "", type) => {
    this.setState({ showModePopup: true });
  };

  hidePopup = () => {
    this.setState({ showModePopup: false });
  };

  getMasterData = () => {
    this.setState({ loader: true });
    const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
    getMasterData(queryParams)
      .then((res) => {
        if (res.status == statusCode.HTTP_200_OK) {
          let vehicles = res.data.data.vehicles;
          let routes = res.data.data.routes;
          routes = routes.map((v) => {
            return {
              label: v.routeNo,
              value: v.routeId,
            };
          });
          vehicles = vehicles.map((v) => {
            return {
              label: v.vehicleNo,
              value: v.vehicleId,
            };
          });
          this.setState({
            vehicles: vehicles,
            routes: routes,
            loader: false,
          });
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({ loader: false, vehicleList: [], userListOrg: [] });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false, vehicleList: [], userListOrg: [] });
      });
  };

  getRouteConfig = () => {
    this.setState({ loader: true });
    const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
    getRouteConfig(queryParams)
      .then((res) => {
        if (res.status == statusCode.HTTP_200_OK) {
          let routes = res.data.data;
          this.setState({
            totalItemsCount: routes.count,
            routeConfigList: routes.rows,
            loader: false,
            waitingForAck: false,
            remianingTime: -1,
            refreshTime: Date.now() + 900000,
          });
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({
            loader: false,
            vehicleList: [],
            userListOrg: [],
            waitingForAck: null,
          });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false, vehicleList: [], userListOrg: [] });
      });
  };

  handleDateChange = (selection) => {
    this.setState({ date: selection });
  };

  addConfig = (isActive = true, index) => {
    let newConfigInfo = this.state.newConfigInfo;
    if (!newConfigInfo.vehicle || !newConfigInfo.route || !this.state.date) {
      toast.error("Please fill all the mandatory fields!!");
      return;
    }

    this.setState({ loader: true });

    let payload = {
      routeId: newConfigInfo.route.value,
      routeNo: newConfigInfo.route.label,
      vehicleNo: newConfigInfo.vehicle.label,
      vehicleId: newConfigInfo.vehicle.value,
      date: this.state.date,
      driver: newConfigInfo.driver,
      type: 3,
    };

    if (newConfigInfo.id) {
      payload = {
        ...payload,
        vehicleRouteDriverId: newConfigInfo.id,
        isActive: isActive,
      };
    }

    addRouteConfig(payload)
      .then((res) => {
        if (res.status == statusCode.HTTP_200_OK) {
          let routes = res.data.data;
          this.setState({
            totalItemsCount: routes.count,
            routeConfigList: routes.rows,
            loader: false,
            showModePopup: false,
            showDeletePopup: false,
            newConfigInfo: {},
            date: new Date(),
            waitingForAck: true,
            remianingTime: 5,
          });
          let seconds = 5;
          let foo = setInterval(() => {
            //   document.getElementById("seconds").innerHTML = seconds;
            seconds--;
            this.setState({ remianingTime: seconds });
            if (seconds == -1) {
              clearInterval(foo);
              this.getRouteConfig();
            }
          }, 1000);
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({ loader: false, vehicleList: [], userListOrg: [] });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false, vehicleList: [], userListOrg: [] });
      });
  };

  retryConfig = (config, retry = false) => {
    let payload = {
      vehicleId: config.Vehicle.vehicleId,
      routeNo: config.Route.routeNo,
      id: config.vehicleRouteDriverMapId,
      retry: retry,
    };
    addRouteConfig(payload)
      .then((res) => {
        if (res.status == statusCode.HTTP_200_OK) {
          let routes = res.data.data;
          this.setState({
            totalItemsCount: routes.count,
            routeConfigList: routes.rows,
            loader: false,
            showModePopup: false,
            showDeletePopup: false,
            newConfigInfo: {},
            date: new Date(),
            waitingForAck: true,
            remianingTime: 5,
          });
          let seconds = 5;
          let foo = setInterval(() => {
            //   document.getElementById("seconds").innerHTML = seconds;
            seconds--;
            this.setState({ remianingTime: seconds });
            if (seconds == -1) {
              clearInterval(foo);
              this.getRouteConfig();
            }
          }, 1000);
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({ loader: false, vehicleList: [], userListOrg: [] });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false, vehicleList: [], userListOrg: [] });
      });
  };

  renderModePopup = () => {
    if (this.state.showModePopup) {
      return (
        <Modal
          size="sm"
          isOpen={this.state.showModePopup}
          style={{ marginTop: "5%" }}
        >
          <ModalHeader>Add New Configuration</ModalHeader>
          <ModalBody>
            <CustomDropdown
              label="Vehicle"
              key={"selection-dropdown"}
              mandatory={true}
              info={""}
              optionHandler={(text) => {
                this.setState({
                  newConfigInfo: { ...this.state.newConfigInfo, vehicle: text },
                });
              }}
              options={this.state.vehicles}
              size={"md"}
              value={this.state.newConfigInfo.vehicle}
            />

            <CustomDropdown
              label="Route"
              key={"selection-dropdown-route"}
              mandatory={true}
              info={""}
              optionHandler={(text) => {
                this.setState({
                  newConfigInfo: { ...this.state.newConfigInfo, route: text },
                });
              }}
              options={this.state.routes}
              size={"md"}
              value={this.state.newConfigInfo.route}
            />

            <CustomInputBox
              label="Driver Name"
              // mandatory={true}
              //mdallBoxEnabled={true}
              //info={"VEHICLE ID"}
              onChange={(text) => {
                this.setState({
                  newConfigInfo: { ...this.state.newConfigInfo, driver: text },
                });
              }}
              value={this.state.newConfigInfo?.driver || ""}
              charCount={false}
              size={"md"}
              placeholderText="Input the driver name"
              maxLength={300}
              customMargin={true}
              //note="Provide a blog topic that will determine the main theme of the blog"
            />
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => {
                this.addConfig();
              }}
              className="btn btn-md btn-primary"
            >
              {" "}
              Add
            </button>
            <button
              onClick={() => {
                this.hidePopup();
              }}
              className="btn btn-md btn-secondary"
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>
      );
    }
  };

  renderUser = () => {
    const userList = [];
    console.log("---------", this.state.tokenDetails);
    let vehiclesAdded = [];
    this.state.routeConfigList.forEach((r, index) => {
      let reqDate = moment.utc(r.dateAndTime).format();
      let isPresent = vehiclesAdded.find((v) => v == r.Vehicle.vehicleNo);
      if (!isPresent) {
        vehiclesAdded.push(r.Vehicle.vehicleNo);
      }
      userList.push(
        <>
          <tr key={index}>
            <th scope="row" style={{ width: "100px" }}>
              {index + 1}
            </th>
            <td
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "50%" }}>{r.Vehicle.vehicleNo}</div>
              {r.isVerified && !isPresent ? (
                moment().diff(reqDate, "minutes") <= "15" ? (
                  <Circle size={12} color="green" fill="green" />
                ) : (
                  <RefreshCcw
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.retryConfig(r, true);
                    }}
                  />
                )
              ) : (
                <></>
              )}
            </td>
            <td>{r.Route.routeNo}</td>
            <td>{r.driver}</td>
            <td>
              {utcToLocal(r.dateAndTime)}
              {/* {new Date(r.dateAndTime + " UTC").toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})}         */}
            </td>
            <td>
              {index == 0 && this.state.waitingForAck ? (
                "Waiting for acknowledgement..." +
                this.state.remianingTime +
                "s"
              ) : r.isVerified ? (
                "Acknowledged"
              ) : (
                <span
                  onClick={() => {
                    this.retryConfig(r);
                  }}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </span>
              )}
            </td>
            {/* <td>
                        <a href=''><Eye size={20} /></a> &nbsp; <a href=''><Edit3 size={20} /></a>
                    </td> */}
          </tr>
        </>
      );
    });
    return userList;
  };

  addRecord = () => {
    this.setState({ showModePopup: true });
  };

  optionHandler = (option, field) => {
    this.setState({
      ...this.state.newConfigInfo,
      [field]: option,
    });
  };

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      this.getRouteConfig();
      this.setState({ refreshTime: null });
    } else {
      // Render a countdown
      return (
        <span>
          Auto refesh in {minutes}:{seconds} minutes
        </span>
      );
    }
  };

  render() {
    return (
      <Card>
        <BarLoader
          color={"#1761fd"}
          loading={this.state.loader}
          size={"100%"}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <div className="container-fluid vh-50">
          <div className="page-header">
            <div className="tab-container" style={{ width: "50%" }}>
              <div className="section-head">Route Configurations</div>
            </div>
            <div className="row">
              <div
                className="col-sm-12 d-flex ml-5"
                style={{
                  textAlign: "right",
                  marginTop: "10px",
                  float: "right",
                  marginLeft: "40%",
                }}
              >
                <div
                  style={{ width: "40%", marginTop: "15px", marginRight: 10 }}
                >
                  {this.state.refreshTime && (
                    <Countdown
                      key={this.state.keyValue}
                      date={this.state.refreshTime}
                      renderer={this.renderer}
                    />
                  )}
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => this.addRecord()}
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>

          <div className="page-container no-scroll-bar">
            {!this.state.loader ? (
              <Table style={{ textAlign: "center", overflow: "auto" }} bordered>
                <thead style={{ position: "sticky", top: 0 }}>
                  <tr>
                    <th>#</th>
                    <th>Vehicle</th>
                    <th>Route</th>
                    <th>Driver</th>
                    <th>Date and Time</th>
                    <th>Is Acknowledged</th>
                  </tr>
                </thead>
                <tbody style={{ height: "20%" }}>{this.renderUser()}</tbody>
              </Table>
            ) : (
              <div className="page-sipnner-container">
                <Spinner size="lg" color="primary" />
                <div className="page-spinner-text">
                  Please wait while we load all users...
                </div>
              </div>
            )}
          </div>
          {this.renderModePopup()}
        </div>
      </Card>
    );
  }
}

export default RouteConfiguration;
