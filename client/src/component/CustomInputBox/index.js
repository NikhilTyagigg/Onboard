import React from "react";
import { Info } from "react-feather";
import ReactTooltip from "react-tooltip";
import { Spinner } from "reactstrap";
import "./index.scss";

const CustomInputBox = ({
  value,
  onChange,
  onBlur,
  onClick,
  mandatory,
  label,
  labelButton,
  labelButtonSpinner,
  onLabelBtnClick,
  charCount,
  maxLength,
  inputType, // Use this prop for the input type
  placeholderText,
  size,
  note,
  error,
  noOfColumns,
  smallBoxEnabled,
  info,
  customMargin,
}) => {
  const _handleText = (e) => {
    onChange(e.target.value);
  };

  const _handleGuidingText = (e) => {
    onClick(e.target.value);
  };

  const _hideGuidingText = (e) => {
    onBlur("");
  };

  const renderLabel = () => {
    let infoContainer = "";
    let labelContainer = "";
    let labelButtonContainer = "";
    if (info) {
      infoContainer = (
        <Info
          data-tip
          data-for={label}
          className="actionIcon"
          style={{ marginLeft: "7px" }}
          size={"19px"}
          color="#546E7A"
        />
      );
    }
    if (labelButton) {
      labelButtonContainer = (
        <span
          onClick={onLabelBtnClick ? onLabelBtnClick : {}}
          style={{ cursor: "pointer" }}
          className="suggestionLabelBlockButton"
        >
          {labelButton}
        </span>
      );
    }

    if (labelButtonSpinner) {
      labelButtonContainer = <Spinner size={"12px"} color="grey" />;
    }

    if (label) {
      labelContainer = (
        <label className="labelTextArea">
          {label}
          {mandatory ? " *" : ""}
          {labelButtonContainer}
        </label>
      );
    }
    return labelContainer;
  };

  const renderInfoToolTip = () => {
    if (info) {
      return (
        <ReactTooltip
          id={label}
          backgroundColor="#1761fd"
          place="top"
          offset={{ left: "0%" }}
          effect="solid"
          html={true}
        >
          {info}
        </ReactTooltip>
      );
    }
  };

  const renderNote = () => {
    if (note) {
      return (
        <div className="tipNoteStyle">
          <span style={{ color: "#000000", fontWeight: "bold" }}>Hint</span>:{" "}
          {note}
        </div>
      );
    }
  };

  const renderCharCount = () => {
    if (charCount) {
      return (
        <div className="tipNoteStyle">
          <span style={{ color: "#000000", fontWeight: "bold" }}>
            Character count:{" "}
          </span>
          {value.length} {maxLength ? " / " + maxLength : ""}
        </div>
      );
    }
  };

  const smallBox = {
    height: "20px",
  };

  const columnNumber = () => {
    if (noOfColumns) {
      return noOfColumns;
    } else if (smallBoxEnabled) {
      return "10";
    } else {
      return "30";
    }
  };

  const boxStyle = () => {
    const styleObject = {};
    if (size) {
      switch (size) {
        case "xxl":
          styleObject["height"] = "320px";
          break;
        case "xll":
          styleObject["height"] = "200px";
          break;
        case "xl":
          styleObject["height"] = "150px";
          break;
        case "lg":
          styleObject["height"] = "135px";
          break;
        case "md":
          styleObject["height"] = "40px";
          break;
        case "sm":
          styleObject["height"] = "37px";
          break;
        default:
          styleObject["height"] = "20px";
      }
    }
    return styleObject;
  };

  return (
    <div
      className={
        customMargin && customMargin === true
          ? "merge-content-delete"
          : "inputBoxContainer"
      }
    >
      {renderLabel()}
      <input
        onChange={_handleText}
        onClick={
          onClick
            ? _handleGuidingText
            : () => {
                return false;
              }
        }
        onBlur={
          onBlur
            ? _hideGuidingText
            : () => {
                return false;
              }
        }
        style={{ ...boxStyle() }}
        className={`topicAreaStyle form-control ${
          smallBoxEnabled ? "smallBox" : ""
        }`}
        value={value}
        type={inputType || "text"} // Use the inputType prop here
        placeholder={
          placeholderText ? placeholderText : "Type or paste your inputs here"
        }
        rows={smallBoxEnabled ? "1" : "2"}
        cols={columnNumber()}
      />
      {renderCharCount()}
      {renderNote()}
      {renderInfoToolTip()}
    </div>
  );
};

export default CustomInputBox;
