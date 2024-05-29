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
        intermediateStops: [],
        startTime: "",
        endTime: "",
        SERVICE: "",
        SCH_NO: "",
        trip_length: "",
      },
      showDeletePopup: false,
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    console.log(value);
    this.setState({
      newRouteInfo: {
        ...this.state.newRouteInfo,
        [name]: value,
      },
    });
    // console.log(this.state.newRouteInfo.startTime);
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
          ...prevState.newRouteInfo.intermediateStops,
          {
            stopName: "",
            arrivalTime: "",
            departureTime: "",
            frequency: "",
            stopLocation: "",
          },
        ],
      },
    }));
  };
  handleIntermediateStopChange = (e, index, fieldName) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const intermediateStops = [...prevState.newRouteInfo.intermediateStops];
      intermediateStops[index] = {
        ...intermediateStops[index],
        [fieldName]: value,
      };
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
    this.setState({ activePage: pageNumber }, () => {});
  }

  changeTab = (index) => {
    this.setState({ selectedTab: index });
  };

  handleSearch = (e) => {
    this.setState({ searchFilter: e.target.value });
  };

  getRoutes = () => {
    this.setState({ loader: true });
    const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
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
          this.setState({ loader: false, vehicleList: [], userListOrg: [] });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false, vehicleList: [], userListOrg: [] });
      });
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
      SERVICE: newRouteInfo.SERVICE, // Use formatted end time
      intermediateStops: newRouteInfo?.intermediateStops || "",
    };

    if (newRouteInfo.id) {
      payload = {
        ...payload,
        routeId: newRouteInfo.id,
        isActive: isActive,
      };
    }

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
  };

  addRoutes = (payload) => {
    addMultipleRoutes({ routes: payload })
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
          <ModalHeader>Add Route </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-lg-6 custom-input-box">
                <label className="label">Route Number</label>
                <CustomInputBox
                  //smallBoxEnabled={true}
                  mandatory={true}
                  //info={"Capture what you want this blog to achieve or for what target audience is this being written for. <br/>For example: to encourage working professionals to try meditation as a tool for stress relief, <br/> to promote organic farming, to motivate parents to take mental health seriously."}
                  onChange={(text) => {
                    this.onChangeRouteNo(text);
                  }}
                  value={this.state.newRouteInfo?.number || ""}
                  charCount={false}
                  size={"md"}
                  placeholderText="Input the route number"
                  maxLength={300}
                  //note="Provide information about the blog's goal or objective"
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

              <div className="col-lg-6 custom-input-box">
                <label className="label">Depotname</label>
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

              <div className="col-lg-4 custom-input-box">
                <label className="label" htmlFor="start-time">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  name="startTime"
                  placeholder="Enter Start Time"
                  value={this.state.newRouteInfo.startTime}
                  onChange={this.handleInputChange}
                  size="md"
                />
              </div>

              <div className="col-lg-4 custom-input-box">
                <label className="label" htmlFor="start-time">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  placeholder="Enter End Time"
                  name="endTime"
                  value={this.state.newRouteInfo.endTime}
                  onChange={this.handleInputChange}
                  size="md"
                />
              </div>

              <div className="col-lg-4 custom-input-box">
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
                  placeholderText="Enter trip_length name"
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
                <label className="label">SCH_NO</label>
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

              <div className="col-lg-6 form-group">
                <h3>Add Intermediate Stops</h3>
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
                        <input
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
                        />
                        <input
                          type="text"
                          name="stopLocation"
                          placeholder="Stop Location"
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
                <button type="button" onClick={this.handleAddIntermediateStop}>
                  Add Intermediate Stop
                </button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={this.addRoute} className="btn btn-md btn-primary">
              Add
            </button>
            <button
              onClick={this.hidePopup}
              className="btn btn-md btn-secondary"
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>
      );
    }
  };

  renderDeletePopup = () => {
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
                  <th>Frequency</th>
                  <th>Stop Location</th>
                </tr>
              </thead>
              <tbody>
                {stopsData.map((stop, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{stop.stopName}</td>
                    <td>{stop.arrivalTime}</td>
                    <td>{stop.departureTime}</td>
                    <td>{stop.frequency}</td>
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
    this.setState({
      newRouteInfo: {
        number: route.routeNo,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        depotname: route.depotname,
        startTime: route.startTime,
        endTime: route.endTime,
        frequency: route.frequency,
        intermediateStops: route?.intermediateStops || "",
        id: route.routeId,
      },
      showModePopup: true,
    });
  };

  onDeleteClick = (route) => {
    this.setState({
      newRouteInfo: {
        number: route.routeNo,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        depotname: route.depotname,
        startTime: route.startTime,
        endTime: route.endTime,
        frequency: route.frequency,
        intermediateStops: route?.intermediateStops || "",
        id: route.routeId,
      },
      showDeletePopup: true,
    });
  };

  renderUser = () => {
    return (
      this.state.routeList &&
      this.state.routeList.map((route, index) => {
        const intermediateStopsKey = `intermediateStops_${index}`; // Unique key for intermediate stops
        return (
          <tr key={index}>
            <th scope="row" style={{ width: "100px" }}>
              {index + 1}
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
              <div className="col-sm-5">
                {/* <input type={'text'} placeholder="Search by Route ID/Number" name='filter' value={this.state.filter} className="form-control" onChange={(e)=>{this.onSearchByString(e.target.value)}} style={{marginTop: '7px'}}></input> */}
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
                    <th style={{ width: "20%" }}>#</th>
                    <th style={{ width: "20%" }}>Route Number</th>
                    <th style={{ width: "20%" }}>Start Point</th>
                    <th style={{ width: "20%" }}>End Point</th>
                    <th style={{ width: "40%" }}>Depot Name</th>
                    <th style={{ width: "20%" }}>Start Time</th>
                    <th style={{ width: "20%" }}>End Time</th>
                    <th style={{ width: "20%" }}>Frequency</th>
                    <th style={{ width: "20%" }}>Trip Length</th>
                    <th style={{ width: "20%" }}>Schedule Number </th>
                    <th style={{ width: "20%" }}>Services</th>
                    <th style={{ width: "20%" }}>Intermediatery stops</th>
                    <th style={{ width: "20%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>{this.renderUser()}</tbody>
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
          {this.renderDeletePopup()}
          {this.renderIntermediateStopsPopup()}

          {/* <div className='row'>
 <div className='col-lg-12' >
 <Pagination
 activePage={this.state.activePage}
 itemClass="page-item"
 linkClass="page-link"
 itemsCountPerPage={this.state.itemsCountPerPage}
 totalItemsCount={this.state.totalItemsCount}
 pageRangeDisplayed={this.state.pageRangeDisplayed}
 onChange={this.handlePageChange.bind(this)}
 />
 </div>
 </div> */}
        </div>
      </Card>
    );
  }
}

export default RouteRecords;
