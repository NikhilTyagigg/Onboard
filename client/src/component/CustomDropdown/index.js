import React, { useState } from 'react'
import { Info } from 'react-feather'
import ReactTooltip from "react-tooltip";
import Select from "react-select";
import "./index.scss"

const CustomDropdown = ({
    value,
    optionHandler,
    options,
    mandatory,
    label,
    labelExample,
    labelButton,
    onLabelBtnClick,
    placeholder,
    customStyle,
    note,
    error,
    info
}) => {
    const _handleText = (e) => { onChange(e.target.value) }

    const renderLabel = () => {
        let infoContainer = ""
        let labelContainer = ""
        let labelButtonContainer = ""
        let labelExampleContainer = ""
        if(info){
            infoContainer = <Info
                                data-tip data-for={label}
                                className="actionIcon" 
                                style={{marginLeft:'7px'}}
                                size={"19px"} 
                                color='#546E7A'/>
        }
        if(labelButton){
            labelButtonContainer = <span onClick={onLabelBtnClick?onLabelBtnClick:{}} className="labelBlockButton">
                                            Suggest keywords
                                    </span>
        }
        if(labelExample){
            labelExampleContainer = <span className="labelExampleStyle">{labelExample}</span>
        }
        if(label){
            labelContainer = <label className="labelTextArea">
                                    {label}{mandatory?" *":""}
                                    {labelExampleContainer}
                                    {infoContainer}
                                    {labelButtonContainer}
                            </label>
        }
        return labelContainer
    }

    const renderInfoToolTip = () => {
        if(info){
            return (
                <ReactTooltip 
                    id={label} 
                    place="top"
                    backgroundColor="#1761fd"
                    offset ={{left: '0%'}}
                    effect="solid">
                    {info}
                </ReactTooltip>
            )
        }
    }

    const renderNote = () => {
        if(note){
            return (
                <div className="tipNoteStyleDropdown">
                    <span style={{fontWeight:"bold"}}>Hint</span>: {note}
                </div>
            )
        }
    }

    return(
        <>
            {renderLabel()}
            <div style={customStyle?customStyle:{}} className="toneInput">
                <Select
                    onChange={optionHandler}
                    value={value}
                    options={options}
                    placeholder={placeholder?placeholder:"Select..."}
                />
            </div>
            {renderNote()}
            {renderInfoToolTip()}
        </>
      )
}

export default CustomDropdown