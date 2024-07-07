import React, { Fragment, Component } from "react";
import axios from "axios";
import UiLoader from "@components/ui-loader";

import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faFile,
  faList,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import {
  getLogs,
  getVehicleRecords,
  addVehicle,
  addMultipleVehicles,
} from "../../services/agent";
import { Card, Spinner, Table } from "reactstrap";
import toast from "react-hot-toast";
import { statusCode } from "../../utility/constants/utilObject";
import { showErrorToast, toastStyle } from "../../utility/helper";
import { Edit3, Plus, Search, Square, Trash, Trash2 } from "react-feather";
import "./index.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { userStatus } from "../../utility/constants/options";
import CustomDropdown from "../../component/CustomDropdown";
import CustomInputBox from "../../component/CustomInputBox";
import { use } from "i18next";
import { Eye, Edit, XSquare } from "react-feather";
import BarLoader from "react-spinners/BarLoader";
import Pagination from "react-js-pagination";
import Excel from "exceljs";
import Papa from "papaparse";

const override = {
  borderColor: "#1761fd",
  width: "100%",
};

class StopDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleList: [],
      userListOrg: [],
      loader: true,
      searchFilter: "",
      selectedUserForDocument: null,
      showModePopup: false,
      showDeletePopup: false,
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
      vehicleType: [],
      newVehicleInfo: {
        vehicleNumber: "",
        vehicleModule: "",
        vehicleType: "",
        startPoint: "",
        latitude: "",
        longitude: "",
      },
    };
  }

  componentDidMount = () => {
    this.getBusRecords();
  };

  getBusRecords = () => {
    this.setState({ loader: true });
    const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
    getVehicleRecords(queryParams)
      .then((res) => {
        if (res.status === statusCode.HTTP_200_OK) {
          let vehicles = res.data.data.vehicles;
          let vehicleType = res.data.data.vehicleType.map((v) => ({
            label: v.name,
            value: v.vehicleTypeId,
          }));

          this.setState({
            totalItemsCount: vehicles.count,
            vehicleList: vehicles.rows,
            vehicleType: vehicleType,
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

  addVehicle = (isActive = true) => {
    const {
      vehicleNumber,
      vehicleModule,
      vehicleType,
      startPoint,
      latitude,
      longitude,
    } = this.state.newVehicleInfo;

    if (
      !vehicleNumber ||
      !vehicleModule ||
      !vehicleType ||
      !startPoint ||
      !latitude ||
      !longitude
    ) {
      toast.error("Please fill all the mandatory fields!!");
      return;
    }

    this.setState({ loader: true });

    const payload = {
      vehicleNumber,
      vehicleModule,
      vehicleType: vehicleType.value,
      startPoint,
      latitude,
      longitude,
      isActive,
    };

    addVehicle(payload)
      .then((res) => {
        if (res.status === statusCode.HTTP_200_OK) {
          let vehicles = res.data.data;
          this.setState({
            totalItemsCount: vehicles.count,
            vehicleList: vehicles.rows,
            loader: false,
            showModePopup: false,
            showDeletePopup: false,
            newVehicleInfo: {},
          });
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({ loader: false });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false });
      });
  };

  addVehicles = (payload) => {
    addMultipleVehicles({ vehicles: payload })
      .then((res) => {
        if (res.status === statusCode.HTTP_200_OK) {
          let vehicles = res.data.data;
          this.setState({
            totalItemsCount: vehicles.count,
            vehicleList: vehicles.rows,
            loader: false,
            showModePopup: false,
            showDeletePopup: false,
            newVehicleInfo: {},
          });
          toast.success("Records updated successfully!!");
        } else {
          toast.error(res.message, { ...toastStyle.error });
          this.setState({ loader: false });
        }
      })
      .catch((err) => {
        toast.error(err?.message, { ...toastStyle.error });
        this.setState({ loader: false });
      });
  };

  _handleFileLoad = async (e) => {
    const file = e.target.files[0];
    const extension = file.name.split(".").pop().toLowerCase();
    this.setState({ loader: true });
    let params = [];
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          params = results.data;
          if (params.length > 0) {
            this.addVehicles(params);
          }
          if (params.length > 2000) {
            this.setState({ loader: false });
            showErrorToast("Upto 2000 records can be added in one go!!");
            return;
          }
        },
      });
    } else if (extension === "xlsx") {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then((workbook) => {
          const params = [];
          workbook.eachSheet((sheet) => {
            sheet.eachRow((row, rowIndex) => {
              if (rowIndex !== 1) {
                let rowData = [...row.values];
                rowData.splice(0, 1);
                params.push(rowData);
              }
            });
          });

          if (params.length > 2000) {
            this.setState({ loader: false });
            showErrorToast("Up to 2000 records can be added in one go!!");
            return;
          }

          this.addVehicles(params);
        });
      };
    } else {
      this.setState({ loader: false });
      showErrorToast("We are accepting only csv/xlsx file!");
    }
  };

  renderModePopup = () => {
    if (this.state.showModePopup) {
      return (
        <Modal
          size="sm"
          isOpen={this.state.showModePopup}
          style={{ marginTop: "5%" }}
        >
          <ModalHeader>Add Vehicle</ModalHeader>
          <ModalBody>
            <CustomInputBox
              label="Vehicle Number"
              mandatory={true}
              onChange={(text) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    vehicleNumber: text,
                  },
                });
              }}
              value={this.state.newVehicleInfo.vehicleNumber}
              charCount={false}
              size={"md"}
              placeholderText="Input the vehicle number"
              maxLength={300}
            />
            <CustomInputBox
              label="Module Number"
              mandatory={true}
              onChange={(text) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    vehicleModule: text,
                  },
                });
              }}
              value={this.state.newVehicleInfo.vehicleModule}
              charCount={false}
              size={"md"}
              placeholderText="Input the vehicle module"
              maxLength={300}
            />
            <CustomDropdown
              label="Vehicle Type"
              mandatory={true}
              onChange={(selected) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    vehicleType: selected,
                  },
                });
              }}
              value={this.state.newVehicleInfo.vehicleType}
              size="md"
              placeholder="Select vehicle type"
              options={this.state.vehicleType}
              isSearchable={true}
            />
            <CustomInputBox
              label="Start Point"
              mandatory={true}
              onChange={(text) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    startPoint: text,
                  },
                });
              }}
              value={this.state.newVehicleInfo.startPoint}
              charCount={false}
              size={"md"}
              placeholderText="Input the start point"
              maxLength={300}
            />
            <CustomInputBox
              label="Latitude"
              mandatory={true}
              onChange={(text) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    latitude: text,
                  },
                });
              }}
              value={this.state.newVehicleInfo.latitude}
              charCount={false}
              size={"md"}
              placeholderText="Input the latitude"
              maxLength={300}
            />
            <CustomInputBox
              label="Longitude"
              mandatory={true}
              onChange={(text) => {
                this.setState({
                  newVehicleInfo: {
                    ...this.state.newVehicleInfo,
                    longitude: text,
                  },
                });
              }}
              value={this.state.newVehicleInfo.longitude}
              charCount={false}
              size={"md"}
              placeholderText="Input the longitude"
              maxLength={300}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.addVehicle();
              }}
            >
              Save
            </Button>{" "}
            <Button
              color="secondary"
              onClick={() => {
                this.setState({ showModePopup: false, newVehicleInfo: {} });
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
  };

  render() {
    const {
      vehicleList,
      loader,
      activePage,
      totalItemsCount,
      itemsCountPerPage,
    } = this.state;

    return (
      <div className="stop-details-container">
        {loader ? (
          UiLoader
        ) : (
          <div>
            {this.renderModePopup()}
            <button
              className="add-vehicle-button"
              onClick={() => this.setState({ showModePopup: true })}
            >
              Add Vehicle
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Module Number</th>
                  <th>Vehicle Type</th>
                  <th>Start Point</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {vehicleList.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.vehicleNumber}</td>
                    <td>{vehicle.vehicleModule}</td>
                    <td>{vehicle.vehicleType.name}</td>
                    <td>{vehicle.startPoint}</td>
                    <td>{vehicle.latitude}</td>
                    <td>{vehicle.longitude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={5}
                onChange={(page) => {
                  this.setState({ activePage: page }, this.getBusRecords);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default StopDetails;
