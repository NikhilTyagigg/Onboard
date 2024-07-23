import React, { Fragment, Component } from "react";
import { getRoutes, addRoute, addMultipleRoutes } from "../../services/agent";
import { Card, Spinner, Table } from "reactstrap";
import toast from "react-hot-toast";
import { statusCode } from "../../utility/constants/utilObject";
import { toastStyle } from "../../utility/helper";
import { Edit3, Trash2 } from "react-feather";
import "./index.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CustomInputBox from "../../component/CustomInputBox";
import BarLoader from "react-spinners/BarLoader";
import Pagination from "react-js-pagination";
import Excel from "exceljs";
import Papa from "papaparse";
import { useState } from "react";

const override = {
  borderColor: "#1761fd",
  width: "100%",
};

class RouteRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeList: [],
      userListOrg: [],
      loader: false,
      searchFilter: "",
      searchRouteNo: "", // Add this line
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
      itemsCountPerPage: 100,
      intermediateStopsPopupData: [], // Initialize as an empty array

      newRouteInfo: {
        number: "",
        startPoint: "",
        endPoint: "",
        depotname: "",
        // sll: "",
        startTime: "",
        endTime: "",
        frequency: "",
        trip_length: "",
        SCH_NO: "",
        SERVICE: "",
        intermediateStops: [],
        id: null,
      },
      showDeletePopup: false,
      isFormVisible: true,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
  }
  handleInputChange(name, value) {
    if (name === "sll") {
      // Extract latitude and longitude
      const [latitude, longitude] = value.split(",");

      const isValidLatitude = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLongitude = (lng) =>
        !isNaN(lng) && lng >= -180 && lng <= 180;

      if (
        latitude &&
        longitude &&
        isValidLatitude(parseFloat(latitude.trim())) &&
        isValidLongitude(parseFloat(longitude.trim()))
      ) {
        this.setState((prevState) => ({
          newRouteInfo: {
            ...prevState.newRouteInfo,
            sll: value.trim(), // Trim the entire value
            latitude: parseFloat(latitude.trim()), // Convert to float
            longitude: parseFloat(longitude.trim()), // Convert to float
          },
        }));
      } else {
        // Handle case where latitude or longitude is missing or invalid
        console.warn("Invalid format for latitude and longitude");
        this.setState((prevState) => ({
          newRouteInfo: {
            ...prevState.newRouteInfo,
            sll: value.trim(), // Trim the entire value
            latitude: null,
            longitude: null,
          },
        }));
        // Optionally, add UI feedback for invalid input
        alert(
          "Please enter a valid latitude and longitude in the format: lat,long"
        );
      }
    } else if (name === "startTime" || name === "endTime") {
      // Validate the time format
      const isValidTime = (time) => {
        // Basic validation for HH:MM format
        const timePattern = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        return timePattern.test(time);
      };

      if (isValidTime(value.trim())) {
        this.setState((prevState) => ({
          newRouteInfo: {
            ...prevState.newRouteInfo,
            [name]: value.trim(),
          },
        }));
      } else {
        // Handle case where time format is invalid
        console.warn("Invalid time format");
        alert("Please enter a valid time in the format: HH:MM");
      }
    } else {
      this.setState((prevState) => ({
        newRouteInfo: {
          ...prevState.newRouteInfo,
          [name]: value,
        },
      }));
    }
  }

  handleSearchChange = (e) => {
    this.setState({ searchRouteNo: e.target.value });
  };

  handleSearchSubmit = () => {
    this.getRoutes();
  };

  componentDidMount = () => {
    localStorage.removeItem("active_doc");
    this.getRoutes();
  };
  handleAddIntermediateStop = () => {
    this.setState((prevState) => ({
      newRouteInfo: {
        ...prevState.newRouteInfo,
        intermediateStops: [
          ...(prevState.newRouteInfo.intermediateStops || []),
          {
            stopName: "",
            arrivalTime: "",
            departureTime: "",
            // frequency: "",
            stopLocation: "",
          },
        ],
      },
    }));
  };

  handleIntermediateStopChange = (event, index, field) => {
    const { value } = event.target;

    this.setState((prevState) => {
      const intermediateStops = [...prevState.newRouteInfo.intermediateStops];
      intermediateStops[index] = {
        ...intermediateStops[index],
        [field]: value,
      };

      // If stopLocation is being updated, validate or process latitude and longitude
      if (field === "stopLocation") {
        // Example: Assume stopLocation is entered as "latitude, longitude"
        const [latitude, longitude] = value.split(",");

        if (latitude && longitude) {
          intermediateStops[index] = {
            ...intermediateStops[index],
            stopLocation: value.trim(), // Trim the entire value
            latitude: parseFloat(latitude.trim()), // Convert to float
            longitude: parseFloat(longitude.trim()), // Convert to float
          };
        } else {
          // Handle case where latitude or longitude is missing
          console.warn("Invalid format for latitude and longitude");
          // Optionally, reset latitude and longitude to empty or default values
          intermediateStops[index] = {
            ...intermediateStops[index],
            stopLocation: value.trim(), // Trim the entire value
            latitude: null,
            longitude: null,
          };
        }
      }

      return {
        newRouteInfo: {
          ...prevState.newRouteInfo,
          intermediateStops,
        },
      };
    });
  };

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber }, () => {
      this.getRoutes();
    });
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      showModePopup: !prevState.showModePopup,
    }));
  };

  changeTab = (index) => {
    this.setState({ selectedTab: index });
  };

  handleSearch = (e) => {
    this.setState({ searchFilter: e.target.value });
  };
  handleClosef = () => {
    this.setState({ isFormVisible: false });
  };

  getRoutes = () => {
    this.setState({ loader: true });
    const { activePage, itemsCountPerPage, searchRouteNo } = this.state;
    const city = localStorage.getItem("city");
    const role = localStorage.getItem("user_role");

    if (role === "1" || role === "0") {
      let queryParams = `?page=${activePage}&records=${itemsCountPerPage}&city=${encodeURIComponent(
        city
      )}`;
      if (searchRouteNo) {
        queryParams += `&routeNo=${encodeURIComponent(searchRouteNo.trim())}`;
      }

      getRoutes(queryParams)
        .then((res) => {
          if (res.status == statusCode.HTTP_200_OK) {
            let routes = res.data.data;
            this.setState({
              totalItemsCount: routes.count,
              routeList: routes.rows,
              loader: false,
            });
          } else {
            toast.error(res.message, { ...toastStyle.error });
            this.setState({ loader: false, routeList: [] });
          }
        })
        .catch((err) => {
          toast.error(err?.message, { ...toastStyle.error });
          this.setState({ loader: false, routeList: [] });
        });
    } else {
      this.setState({ loader: false });
      toast.error("User is not authorized to access this data", {
        ...toastStyle.error,
      });
    }
  };

  addRoute = (isActive = true) => {
    let newRouteInfo = this.state.newRouteInfo;
    if (
      !newRouteInfo.number ||
      !newRouteInfo.startPoint ||
      !newRouteInfo.endPoint
    ) {
      toast.error("Please fill all the mandatory fields!!");
      return;
    }

    this.setState({ loader: true });

    function formatDate(time) {
      if (!time) {
        console.error("No time value provided to formatDate");
        return "Invalid Time"; // Handle the case where time is not provided
      }
      const formattedTime = `${time}`; // Corrected the time format
      console.log(`Formatted Time: ${formattedTime}`);
      return formattedTime;
    }

    const userCity = localStorage.getItem("city"); // Get the user's city from localStorage

    let payload = {
      routeNo: newRouteInfo.number,
      startPoint: newRouteInfo.startPoint,
      endPoint: newRouteInfo.endPoint,
      depotname: newRouteInfo.depotname,
      startTime: formatDate(newRouteInfo.startTime), // Use formatted start time
      endTime: formatDate(newRouteInfo.endTime),
      frequency: newRouteInfo.frequency,
      trip_length: newRouteInfo.trip_length,
      SCH_NO: newRouteInfo.SCH_NO,
      SERVICE: newRouteInfo.SERVICE,
      intermediateStops: newRouteInfo?.intermediateStops || "",
      city: localStorage.getItem("city"), // Add the city to the payload
    };

    if (newRouteInfo.id) {
      payload = {
        ...payload,
        routeId: newRouteInfo.id,
        isActive: isActive,
      };
    }

    const role = localStorage.getItem("user_role");
    if (role == "0" || role == "1") {
      addRoute(payload)
        .then((res) => {
          if (res.status == statusCode.HTTP_200_OK) {
            let routes = res.data.data;
            this.setState({
              totalItemsCount: routes.count,
              routeList: routes.rows,
              loader: false,
              showModePopup: false,
              showDeletePopup: false,
              newRouteInfo: {},
            });
          } else {
            toast.error(res.message, { ...toastStyle.error });
            this.setState({ loader: false, newRouteInfo: {}, userListOrg: [] });
          }
        })
        .catch((err) => {
          toast.error(err?.message, { ...toastStyle.error });
          this.setState({ loader: false, userListOrg: [] });
        });
    } else {
      toast.error("You do not have permission to add routes.");
      this.setState({ loader: false });
    }
  };

  addRoutes = (payload) => {
    const role = localStorage.getItem("user_role");
    const userCity = localStorage.getItem("city"); // Get the user's city from localStorage
    if (role === "0" || role === "1") {
      addMultipleRoutes(payload, userCity) // Include the city in the payload
        .then((res) => {
          if (res.status == statusCode.HTTP_200_OK) {
            let routes = res.data.data;
            this.setState({
              totalItemsCount: routes.count,
              routeList: routes.rows,
              loader: false,
              showModePopup: false,
              showDeletePopup: false,
            });
            toast.success("Records added successfully!!");
          } else {
            toast.error(res.message, { ...toastStyle.error });
            this.setState({ loader: false, newRouteInfo: {}, userListOrg: [] });
          }
        })
        .catch((err) => {
          toast.error(err?.message, { ...toastStyle.error });
          this.setState({ loader: false, userListOrg: [] });
        });
    } else {
      toast.error("You do not have permission to add multiple routes.");
      this.setState({ loader: false });
    }
  };

  showPopup = (email, status = "", type) => {
    this.setState({
      showModePopup: true,
      email: email,
      status: status,
      type: type,
    });
  };

  hidePopup = () => {
    this.setState({
      showModePopup: false,
      email: "",
      status: "",
      type: "",
      showDeletePopup: false,
      newRouteInfo: {},
    });
  };
  handleClose = () => {
    // Add the logic to close the modal, e.g., by calling a parent function to toggle the modal visibility
    this.props.onClose();
  };

  onChangeRouteNo = (text) => {
    // let regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/);
    if (text.length > 6) {
      toast.error("Only 6 digit route number is allowed");
      return;
    }
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    if (regex.test(text) || text == "") {
      this.setState({
        newRouteInfo: {
          ...this.state.newRouteInfo,
          number: text.toUpperCase(),
        },
      });
    }
  };

  renderModePopup = () => {
    if (this.state.showModePopup) {
      return (
        <Modal
          size="lg"
          isOpen={this.state.showModePopup}
          style={{ marginTop: "5%" }}
        >
          <ModalHeader className="d-flex justify-content-between">
            {this.state.isFormVisible && (
              <>
                <span>Add Route</span>
                <div className="form-container">
                  <button
                    type="button"
                    className="close"
                    onClick={this.handleClosef}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-lg-6 custom-input-box">
                <label className="label">Route Number</label>
                <CustomInputBox
                  mandatory={true}
                  onChange={(text) => {
                    this.onChangeRouteNo(text);
                  }}
                  value={this.state.newRouteInfo?.number || ""}
                  size={"md"}
                  placeholderText="Input the route number"
                  maxLength={300}
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">Start Point</label>
                <CustomInputBox
                  mandatory={true}
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        startPoint: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.startPoint || ""}
                  size={"md"}
                  placeholderText="Input the start point"
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">End Point</label>
                <CustomInputBox
                  mandatory={true}
                  size={"md"}
                  placeholderText="Input the end point"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        endPoint: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.endPoint || ""}
                />
              </div>
              {/* <div className="col-lg-6 custom-input-box">
                <label className="label">Starting Point (Lat, Long)</label>
                <CustomInputBox
                  mandatory={true}
                  onChange={(text) => {
                    this.handleInputChange("sll", text);
                  }}
                  value={this.state.newRouteInfo?.sll || ""}
                  size={"md"}
                  placeholderText="Enter Lat Long name"
                />
              </div> */}

              <div className="col-lg-6 custom-input-box">
                <label className="label">Depot Name</label>
                <CustomInputBox
                  mandatory={true}
                  size={"md"}
                  placeholderText="Enter depot name"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        depotname: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.depotname || ""}
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label" htmlFor="start-time">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  name="startTime"
                  placeholder="Enter Start Time"
                  value={this.state.newRouteInfo.startTime}
                  onChange={(e) =>
                    this.handleInputChange("startTime", e.target.value)
                  }
                  size="md"
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label" htmlFor="end-time">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  placeholder="Enter End Time"
                  name="endTime"
                  value={this.state.newRouteInfo.endTime}
                  onChange={(e) =>
                    this.handleInputChange("endTime", e.target.value)
                  }
                  size="md"
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">Frequency</label>
                <CustomInputBox
                  mandatory={false}
                  size={"md"}
                  placeholderText="Enter Frequency"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        frequency: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.frequency || ""}
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">Trip Length</label>
                <CustomInputBox
                  mandatory={true}
                  size={"md"}
                  placeholderText="Enter trip length"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        trip_length: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.trip_length || ""}
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">Schedule Number</label>
                <CustomInputBox
                  mandatory={true}
                  size={"md"}
                  placeholderText="Enter SCH_NO"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        SCH_NO: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.SCH_NO || ""}
                />
              </div>
              <div className="col-lg-6 custom-input-box">
                <label className="label">SERVICE</label>
                <CustomInputBox
                  mandatory={true}
                  size={"md"}
                  placeholderText="Enter SERVICE"
                  onChange={(text) => {
                    this.setState({
                      newRouteInfo: {
                        ...this.state.newRouteInfo,
                        SERVICE: text,
                      },
                    });
                  }}
                  value={this.state.newRouteInfo?.SERVICE || ""}
                />
              </div>
              <div className="col-lg-12 form-group">
                <h3>Add Intermediate Bus Stops</h3>
                <div className="intermediate-stops-container">
                  {this.state.newRouteInfo.intermediateStops &&
                    this.state.newRouteInfo.intermediateStops.map(
                      (stop, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            name="stopName"
                            placeholder="Stop Name"
                            value={stop.stopName}
                            onChange={(e) =>
                              this.handleIntermediateStopChange(
                                e,
                                index,
                                "stopName"
                              )
                            }
                          />
                          <input
                            type="text"
                            name="arrivalTime"
                            placeholder="Arrival Time"
                            value={stop.arrivalTime}
                            onChange={(e) =>
                              this.handleIntermediateStopChange(
                                e,
                                index,
                                "arrivalTime"
                              )
                            }
                          />
                          <input
                            type="text"
                            name="departureTime"
                            placeholder="Departure Time"
                            value={stop.departureTime}
                            onChange={(e) =>
                              this.handleIntermediateStopChange(
                                e,
                                index,
                                "departureTime"
                              )
                            }
                          />
                          {/* <input
                            type="text"
                            name="frequency"
                            placeholder="Frequency"
                            value={stop.frequency}
                            onChange={(e) =>
                              this.handleIntermediateStopChange(
                                e,
                                index,
                                "frequency"
                              )
                            }
                          /> */}
                          <input
                            type="text"
                            name="stopLocation"
                            placeholder="Stop Location (latitude, longitude)"
                            value={stop.stopLocation}
                            onChange={(e) =>
                              this.handleIntermediateStopChange(
                                e,
                                index,
                                "stopLocation"
                              )
                            }
                          />
                        </div>
                      )
                    )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleAddIntermediateStop}
                >
                  Add Intermediate Stop
                </button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={this.addRoute} className="btn btn-primary">
              Add
            </button>
            <button onClick={this.hidePopup} className="btn btn-secondary">
              Cancel
            </button>
          </ModalFooter>
        </Modal>
      );
    }
  };

  // Function to handle closing the modal
  handleClosef = () => {
    this.setState({ showModePopup: false });
  };

  // Function to hide the popup
  hidePopup = () => {
    this.setState({ showModePopup: false });
  };

  renderDeletePopup = () => {
    console.log("Route Number:", this.state.newRouteInfo.number);
    if (this.state.showDeletePopup) {
      return (
        <Modal
          size="sm"
          isOpen={this.state.showDeletePopup}
          style={{ marginTop: "5%" }}
        >
          <ModalHeader>Delete Route Record</ModalHeader>
          <ModalBody>
            <span>
              Are you sure you want to delete the route number{" "}
              <b>{this.state.newRouteInfo.number}</b> ?
            </span>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => {
                this.addRoute(false);
              }}
              className="btn btn-md bg-danger text-white"
            >
              {" "}
              Confirm
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
  renderIntermediateStopsPopup = () => {
    const { isIntermediateStopsPopupOpen, intermediateStopsPopupData } =
      this.state;

    const stopsData = intermediateStopsPopupData || []; // Ensure stopsData is always an array

    return (
      <Modal
        isOpen={isIntermediateStopsPopupOpen}
        toggle={this.closeIntermediateStopsPopup}
      >
        <ModalHeader toggle={this.closeIntermediateStopsPopup}>
          Intermediate Stops
        </ModalHeader>
        <ModalBody>
          {stopsData.length > 0 ? (
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stop Name</th>
                  <th>Arrival Time</th>
                  <th>Departure Time</th>
                  <th>Stop Location (Lat, Long)</th>
                </tr>
              </thead>
              <tbody>
                {stopsData.map((stop, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{stop.stopName}</td>
                    <td>{stop.arrivalTime}</td>
                    <td>{stop.departureTime}</td>
                    <td>{stop.stopLocation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>No Intermediate Stops</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.closeIntermediateStopsPopup}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  onEditClick = (route) => {
    console.log("Route data:", route);
    try {
      this.setState({
        newRouteInfo: {
          number: route.routeNo || "",
          startPoint: route.startPoint || "",
          endPoint: route.endPoint || "",
          depotname: route.depotname || "",
          // sll: route.sll || "",
          startTime: route.startTime || "",
          endTime: route.endTime || "",
          frequency: route.frequency || "",
          trip_length: route.trip_length || "",
          SCH_NO: route.SCH_NO || "",
          SERVICE: route.SERVICE || "",
          intermediateStops: route.intermediateStops || [],
        },
        showModePopup: true,
      });
    } catch (error) {
      console.error("Error while setting state in onEditClick:", error);
    }
  };

  onDeleteClick = (route) => {
    console.log("deleteclick", route.routeNo);
    this.setState({
      newRouteInfo: {
        number: route.routeNo || "",
        startPoint: route.startPoint || "",
        endPoint: route.endPoint || "",
        depotname: route.depotname || "",
        //sll: route.sll || "",
        startTime: route.startTime || "",
        endTime: route.endTime || "",
        frequency: route.frequency || "",
        trip_length: route.trip_length || "",
        SCH_NO: route.SCH_NO || "",
        SERVICE: route.SERVICE || "",
        intermediateStops: route?.intermediateStops || [],
        id: route.routeId,
      },
      showDeletePopup: true,
    });
  };

  renderUser = () => {
    const { activePage, itemsCountPerPage, routeList } = this.state;
    const startIndex = (activePage - 1) * itemsCountPerPage + 1;

    return (
      routeList &&
      routeList.map((route, index) => {
        const intermediateStopsKey = `intermediateStops_${index}`; // Unique key for intermediate stops
        return (
          <tr key={index}>
            <th scope="row" style={{ width: "100px" }}>
              {startIndex + index}
            </th>
            <td>{route.routeNo}</td>
            <td>{route.startPoint}</td>
            <td>{route.endPoint}</td>
            <td>{route.depotname}</td>
            <td>{route.startTime}</td>
            <td>{route.endTime}</td>
            <td>{route.frequency}</td>
            <td>{route.trip_length}</td>
            <td>{route.SCH_NO}</td>
            <td>{route.SERVICE}</td>
            <td key={intermediateStopsKey}>
              <button
                onClick={() =>
                  this.openIntermediateStopsPopup(route.intermediateStops)
                }
              >
                View Stops
              </button>
            </td>

            <td>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => this.onEditClick(route)}
              >
                <Edit3 size={20} />
              </span>{" "}
              &nbsp;{" "}
              <span
                onClick={() => this.onDeleteClick(route)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                <Trash2 size={20} />
              </span>
            </td>
          </tr>
        );
      })
    );
  };
  renderModal() {
    const { newRouteInfo, showModePopup } = this.state;
    if (!showModePopup) return null;

    return (
      <Modal isOpen={showModePopup} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Edit Route</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="routeNumber">Route Number</Label>
              <Input
                type="text"
                name="routeNumber"
                id="routeNumber"
                value={newRouteInfo.number}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            {/* Add other form fields similarly */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.saveChanges}>
            Save
          </Button>
          <Button color="secondary" onClick={this.toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  openIntermediateStopsPopup = (intermediateStops) => {
    this.setState({
      intermediateStopsPopupData: intermediateStops,
      isIntermediateStopsPopupOpen: true,
    });
  };

  closeIntermediateStopsPopup = () => {
    this.setState({ isIntermediateStopsPopupOpen: false });
  };

  addRecord = () => {
    this.setState({ showModePopup: true });
  };

  _handleFileLoad = async (e) => {
    const file = e.target.files[0];
    const extension = e.target.files[0].name.split(".").pop().toLowerCase();
    this.setState({ loader: true });
    let params = [];
    if (extension == "csv") {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          params = [...results.data];
          if (params.length > 0) {
            params.splice(0, 1);
            this.addRoutes(params);
          }
          if (params.length > 2000) {
            this.setState({ loader: false });
            showErrorToast("Upto 2000 records can be added in one go!!");
            return;
          }
          //  console.log("-----------", params);
        },
      });
    } else if (extension == "xlsx") {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then((workbook) => {
          workbook.eachSheet((sheet, id) => {
            sheet.eachRow((row, rowIndex) => {
              if (rowIndex != 1) {
                let temp = [...row.values];
                temp.splice(0, 1);
                params.push(temp);
              }
            });
            if (params.length > 2000) {
              this.setState({ loader: false });
              showErrorToast("Upto 2000 records can be added in one go!!");
              return;
            }
            this.addRoutes(params);
            console.log("-----------", params);
          });
        });
      };
    } else {
      this.setState({ loader: false });
      showErrorToast("We are accepting only csv/xlsx file!");
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
        <div className="container-fluid vh-85">
          <div className="page-header">
            <div className="tab-container" style={{ width: "20%" }}>
              <div className="section-head">Route Records</div>
            </div>
            <div className="row">
              <div className="col-sm-5 d-flex align-items-center">
                <input
                  type="text"
                  placeholder="Search by Route ID/Number"
                  name="filter"
                  value={this.state.searchRouteNo}
                  className="form-control"
                  onChange={this.handleSearchChange}
                  style={{ marginRight: "10px", marginTop: "7px" }} // Add marginRight to create space between input and button
                />
                <button
                  className="btn btn-primary"
                  onClick={this.handleSearchSubmit}
                  style={{ marginTop: "7px" }}
                >
                  Search
                </button>
              </div>

              <div
                className="col-sm-2 text-right"
                style={{ marginTop: "15px", textAlign: "right" }}
              >
                <span> Import File: </span>
              </div>
              <div className="col-lg-2" style={{ marginTop: "12px" }}>
                <input
                  type="file"
                  accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  ref={(ref) => (this.state.fileRef = ref)}
                  onChange={this._handleFileLoad}
                />
              </div>
              <div
                className="col-sm-3"
                style={{ textAlign: "right", marginTop: "12px" }}
              >
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => this.addRecord()}
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
          <div className="page-container no-scroll-bar form-group">
            {!this.state.loader ? (
              <Table style={{ textAlign: "center" }} bordered>
                <thead style={{ position: "sticky", top: 0 }}>
                  <tr>
                    <th style={{ width: "20%" }}>SERIAL NUMBER</th>
                    <th style={{ width: "10%" }}>Route Number</th>
                    <th style={{ width: "10%" }}>Start Point</th>
                    <th style={{ width: "10%" }}>End Point</th>
                    <th style={{ width: "10%" }}>Depot Name</th>
                    <th style={{ width: "10%" }}>Start Time</th>
                    <th style={{ width: "10%" }}>End Time</th>
                    <th style={{ width: "20%" }}>Frequency</th>
                    <th style={{ width: "20%" }}>Trip Length</th>
                    <th style={{ width: "20%" }}>Schedule Number </th>
                    <th style={{ width: "10%" }}>Services</th>
                    <th style={{ width: "20%" }}>Intermediatery stops</th>
                    <th style={{ width: "20%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>{this.renderUser()}</tbody>
              </Table>
            ) : (
              <Spinner color="primary" />
            )}
          </div>
          <div className="pagination-wrapper">
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemsCountPerPage}
              totalItemsCount={this.state.totalItemsCount}
              pageRangeDisplayed={this.state.pageRangeDisplayed}
              onChange={this.handlePageChange.bind(this)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
        {this.renderModePopup()}
        {this.renderDeletePopup()}
        {this.renderIntermediateStopsPopup()}
      </Card>
    );
  }
}

export default RouteRecords;
