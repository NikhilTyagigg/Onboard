import React, { Fragment, Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faFile,
  faList,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { getLogs } from "../../services/agent";
import {
  Card,
  Spinner,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import toast from "react-hot-toast";
import { statusCode } from "../../utility/constants/utilObject";
import { toastStyle, utcToLocal } from "../../utility/helper";
import { Edit3, Plus, Search, Square, Trash, Trash2 } from "react-feather";
import "./index.css";
import moment from "moment";
import CustomInputBox from "../../component/CustomInputBox";
import { use } from "i18next";
import { Eye, Edit, XSquare } from "react-feather";
import BarLoader from "react-spinners/BarLoader";
import Pagination from "react-js-pagination";
import { LOG_SOURCE } from "../../utility/constants";
import * as Icon from "react-feather";
import Countdown from "react-countdown";

const override = {
  borderColor: "#1761fd",
  width: "100%",
};

class AuditLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      userListOrg: [],
      loader: true,
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
      refreshTime: null,
      keyValue: false,
    };
  }

  componentDidMount = () => {
    this.getLogs();
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

  getLogs = () => {
    this.setState({ loader: true });
    const queryParams = `?page=${this.state.activePage}&records=${this.state.itemsCountPerPage}`;
    const city = localStorage.getItem("city");
    const role = localStorage.getItem("user_role");

    if (city === "Mysore" || role === "0") {
      getLogs(queryParams)
        .then((res) => {
          if (res.status == statusCode.HTTP_200_OK) {
            let totalUsers = res.data.data.logs.count;
            this.setState({
              totalItemsCount: res.data.data.logs.count,
              userList: res.data.data.logs.rows,
              loader: false,
              refreshTime: Date.now() + 300000,
            });
          } else {
            toast.error(res.message, { ...toastStyle.error });
            this.setState({ loader: false, userList: [], userListOrg: [] });
          }
        })
        .catch((err) => {
          toast.error(err?.message, { ...toastStyle.error });
          this.setState({ loader: false, userList: [], userListOrg: [] });
        });
    } else {
      this.setState({ loader: false });
      toast.error("User is not authorized to access this data", {
        ...toastStyle.error,
      });
    }
  };

  renderDocuments = () => {
    if (this.state.selectedUserForDocument) {
      return (
        <Navigate
          to={{
            pathname: `/user-documents/${this.state.selectedUserForDocument}`,
          }}
        />
      );
    }
  };

  showDocuments = (userId) => {
    this.setState({ selectedUserForDocument: userId });
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
    this.setState({ showModePopup: false, email: "", status: "", type: "" });
  };

  renderModePopup = () => {
    if (this.state.showModePopup) {
      return (
        <Modal
          size="sm"
          isOpen={this.state.showModePopup}
          style={{ marginTop: "5%" }}
        >
          <ModalHeader>Add Bus</ModalHeader>
          <ModalBody>
            <CustomInputBox
              label="VEHICLE ID"
              mandatory={true}
              //smallBoxEnabled={true}
              //info={"VEHICLE ID"}
              onChange={(text) => {
                this.handleText("primary_text", text);
              }}
              onClick={(text) => {
                this.handleGuidingText("topic");
              }}
              value={this.state.primary_text}
              charCount={false}
              size={"md"}
              onBlur={(text) => {
                this.handleGuidingText();
              }}
              placeholderText="Input the vehicle id"
              maxLength={300}
              //note="Provide a blog topic that will determine the main theme of the blog"
            />
            <CustomInputBox
              label="VEHICLE NUMBER"
              //smallBoxEnabled={true}
              mandatory={true}
              //info={"Capture what you want this blog to achieve or for what target audience is this being written for. <br/>For example: to encourage working professionals to try meditation as a tool for stress relief, <br/> to promote organic farming, to motivate parents to take mental health seriously."}
              onChange={(text) => {
                this.handleText("intent", text);
              }}
              onClick={(text) => {
                this.handleGuidingText("intent");
              }}
              value={this.state.intent}
              charCount={false}
              size={"md"}
              onBlur={(text) => {
                this.handleGuidingText();
              }}
              placeholderText="Input the vehicle number"
              maxLength={300}
              //note="Provide information about the blog's goal or objective"
            />

            <CustomInputBox
              label="VEHICLE TYPE"
              mandatory={true}
              //smallBoxEnabled={true}
              //info={"Keywords that you want the content to include to improve its visibility and ranking"}
              onChange={(text) => {
                this.handleText("keywords", text);
              }}
              onClick={(text) => {
                this.handleGuidingText("keywords");
              }}
              onBlur={(text) => {
                this.handleGuidingText();
              }}
              value={this.state.keywords}
              //labelButton={this.state.blogId && this.state.blogId > 0 ? "" : 'Suggest keywords'}
              size={"md"}
              placeholderText="Input the vehicle type"
              onLabelBtnClick={this.keywordSuggestion}
              //note="Provide keywords that will improve visibility and ranking of your blog"
            />
          </ModalBody>
        </Modal>
      );
    }
  };

  renderUser = () => {
    const userList = [];
    this.state.userList.forEach((log, index) => {
      let date = new Date();
      var offset = date.getTimezoneOffset();
      userList.push(
        <>
          <tr key={index}>
            <th scope="row" style={{ width: "100px" }}>
              {index + 1}
            </th>
            <td>{log.vehicleNo}</td>
            <td>{log.routeNo}</td>
            <td>{log.userId}</td>
            <td>{log.rssi}</td>
            <td>{log.ackTime}</td>
            <td>{utcToLocal(log.requestedAt)}</td>
            <td title={log?.module || ""}>{LOG_SOURCE[log.source]}</td>
          </tr>
        </>
      );
    });
    return userList;
  };

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      this.getLogs();
      this.setState({ refreshTime: null });
    } else {
      // Render a countdown
      return (
        <span style={{ whiteSpace: "nowrap" }}>
          Auto refresh in {minutes}:{seconds} minutes
        </span>
      );
    }
  };

  downloadCSV = () => {
    const { userList } = this.state;
    const headers = [
      "#",
      "Vehicle No",
      "Route No",
      "User Id",
      "Sig Rssi",
      "Ack Time",
      "Requested At",
      "Source",
    ];
    const rows = userList.map((log, index) => [
      index + 1,
      log.vehicleNo,
      log.routeNo,
      log.userId,
      log.rssi,
      log.ackTime,
      utcToLocal(log.requestedAt),
      LOG_SOURCE[log.source],
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "logs.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="page-header d-flex align-items-center">
            <div className="tab-container" style={{ width: "90%" }}>
              <div className="section-head">Logs</div>
            </div>
            <div style={{ width: "20%" }}>
              {this.state.refreshTime && (
                <Countdown
                  key={this.state.keyValue}
                  date={this.state.refreshTime}
                  renderer={this.renderer}
                />
              )}
            </div>
            <div onClick={() => this.getLogs()} style={{ height: "20px" }}>
              <Icon.RefreshCcw />
            </div>
            <Button
              onClick={this.downloadCSV}
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              Download CSV
            </Button>
          </div>
          <div className="page-container no-scroll-bar">
            {!this.state.loader ? (
              <Table style={{ textAlign: "center" }} bordered>
                <thead style={{ position: "sticky", top: 0 }}>
                  <tr>
                    <th>#</th>
                    <th>Vehicle No</th>
                    <th>Route No</th>
                    <th>User Id</th>
                    <th>Sig Rssi</th>
                    <th>Ack Time</th>
                    <th>Requested At</th>
                    <th>Source</th>
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
          {this.renderDocuments()}
          {this.renderModePopup()}
        </div>
      </Card>
    );
  }
}

export default AuditLog;
