import React, { Fragment, useState } from 'react'
import { XSquare, RotateCcw, Plus, Repeat, CheckCircle, Edit3 } from 'react-feather'
import { Spinner } from "reactstrap"
import { 
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter 
} from "reactstrap";
import Creatable from 'react-select/creatable';
import { colors } from '../../utility/constants/colors';
import { newModeOptions, textUpdateActions } from '../../utility/constants/options';
import { showSuccessToast, showErrorToast, blogTitleFormat } from '../../utility/helper';
import './index.scss'


const CustomContentEditor = ({
    defaultContent,
    onAppend,
    onRegenerate,
    onDelete,
    onChange,
    loader,
    updateLoader,
    customStyle,
    title,
    updateCountChange,
    actions,
    //Version Select props
    versionSelectModeEnabled,
    contentVersion1,
    contentVersion2,
    updatedVersionText,
    onSelect1,
    onSelect2,
    // Append version props
    appendModeEnabled,
    originalText, 
    appendedText,
    onSelectAppendVersion,
    onRejectAppendVersion,
    //Paraphrase option
    paraphraseOptions,
    onParaphrase,
}) => {
    const [editMode, setEditMode] = useState(null)
    const [originalContent, setOriginalContent] = useState(defaultContent)
    const [paraphraseOptionShow, setParaphraseOptionShow] = useState(false)
    const [showModePopup, setShowModePopup] = useState(false)
    const [newModeOption, seNewModeOption] = useState([...newModeOptions])
    const [selectedModeOption, setSelectedModeOption] = useState([])
    
    const enableEdit = () => setEditMode(true)
    const _handleTextChange = (e) => {
        const wordChange = e.target.value.split(" ").length - originalContent.split(" ").length;
        const charChange = e.target.value.length - originalContent.length;
        updateCountChange(wordChange, charChange)
        setOriginalContent(e.target.value)
    }
    const _handleModeOptionSelect = (value) => { setSelectedModeOption(value) }

    const _handleKeyDown = (e) => { 
        if (e.key === 'Enter') {
            setEditMode(false);
            if(originalContent == ""){onDelete()}
            else{onChange(originalContent)}
        }
    }

    const clickToCopy = () => {
        if(originalContent){
            navigator.clipboard.writeText(originalContent)
            showSuccessToast("Copied to clipboard")
          }
    }

    const _handlemouse = () => {
        setEditMode(false)
        if(originalContent == ""){onDelete()}
        else{onChange(originalContent)}
    }

    const initParaphrase = (mode) => {
        if(onParaphrase){
            setParaphraseOptionShow(false)
            onParaphrase(JSON.stringify([mode]))
        }
    }

    const renderActionButtonViewMode = () => {
        if(paraphraseOptionShow){
            const modeArray = []
            paraphraseOptions.forEach((item)=>{
                modeArray.push(<span 
                        className='paraphraseBtn' 
                        onClick={()=>{initParaphrase(item)}} >
                        {item}
                </span>)
            })
            // modeArray.push(<span 
            //     className='paraphraseBtn addModeStyle' 
            //     onClick={()=>{setShowModePopup(true)}} >
            //     <Plus 
            //         className="actionIcon bold-text" 
            //         size={"15px"}/>
            //     {"Add Your Own"}
            // </span>)

            return (
                <div className={`actionButtonSection paraphraseOption`}>
                    {modeArray}
                    <span className='paraphraseClose' onClick={()=>{setParaphraseOptionShow(false)}} >
                        <XSquare 
                            className="actionIcon" 
                            style={{paddingRight:"0"}}
                            size={"20px"} 
                            color='#EF5350'/>
                    </span>
                </div>
            )
        }else{
            return (
                <div className="actionButtonSection">
                    <span className='info'>
                        Word Count : {originalContent.split(" ").length}
                    </span>
                    {
                        actions.includes(textUpdateActions.REGENERATE)?
                        <span onClick={onRegenerate?onRegenerate:{}} >
                            <RotateCcw className="actionIcon" size={"14px"} color='#43A047'/> Regenerate
                        </span>:<></>
                    }
                    {
                        actions.includes(textUpdateActions.ADD_CONTENT)?
                        <span onClick={onAppend?onAppend:{}} >
                            <Plus className="actionIconSuffix" size={"14px"} color='#43A047'/> Add Content
                        </span>:<></>
                    }
                    {
                        actions.includes(textUpdateActions.PARAPHRASE)?
                        <span onClick={()=>{setParaphraseOptionShow(true)}} >
                            <Repeat className="actionIconSuffix" size={"14px"} color='#43A047'/> Paraphrase
                        </span>:<></>
                    }
                </div>
            )
        }
    }

    const applyModeForParaphrasing = () => {
        setSelectedModeOption(false)
        const modeOption = []
        selectedModeOption.forEach((item)=>{
            modeOption.push(item.value)
        })
        onParaphrase(JSON.stringify(modeOption))
    }

    const renderModePopup = () => {
        if(showModePopup){
            return (
                <Modal isOpen={showModePopup}>
                <ModalHeader>Add mode for paraphrase</ModalHeader>
                <ModalBody>
                    <Creatable
                        onChange={_handleModeOptionSelect}
                        isMulti 
                        options={newModeOption} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={applyModeForParaphrasing} color="primary" >Apply</Button>{' '}
                    <Button onClick={()=>{setShowModePopup(false)}} color="secondary" >Cancel</Button>
                </ModalFooter>
            </Modal>
            )
        }
    }

    const formatContentForAddMore = (originalContent, newContent) => {
        const initialLength = originalContent.length;
        const fullStopIndex = newContent.substr(initialLength-1).indexOf(". ")
        const newText = (
            <>
                {newContent.substr(0, (initialLength-1) + (fullStopIndex+2) )} 
                <span className='addNewHighlighted'>  {newContent.substr((initialLength-1) + (fullStopIndex+2))} </span>
            </>
        )
        return newText
    }

    if(loader){
        return (
            <div className='outlineSectionBoxSelected'>
                <div className="page-sipnner-container">
                    <Spinner size="lg" color="success" />
                    <div style={{color: colors.editorGreen}} className='page-spinner-text'>
                        Loading section...
                    </div>
                </div>  
            </div>
        )
    }else if(updateLoader){
        return (
            <div className='outlineSectionBoxSelected'>
                <div className="page-sipnner-container">
                    <Spinner size="lg" color="success" />
                    <div style={{color: colors.editorGreen}} className='page-spinner-text'>
                        Please wait while update the content...
                    </div>
                </div>  
            </div>
        )
    }else if(appendModeEnabled){
        return (
            <div className='selectionState'>
                <div className='outlineVersionPointBox'>
                    <div className='statusHeader'>{updatedVersionText}</div>
                    <div className='outlinePointBoxText'>
                        {formatContentForAddMore(
                            originalText,
                            appendedText
                        )}
                    </div>
                    <div 
                        className="actionButtonSection">
                        <span 
                            className='choiseButton' 
                            onClick={onSelectAppendVersion?onSelectAppendVersion:{}} >
                            <CheckCircle 
                                className="action-icon" 
                                size={"14px"} 
                                color='#FFFFFF'/>
                            Choose New Version
                        </span>
                        <span 
                            className="choiseButton" 
                            style={{marginLeft:"20px"}}
                            onClick={onRejectAppendVersion?onRejectAppendVersion:{}}>
                            <CheckCircle 
                                className="actionIcon"
                                size={"14px"} 
                                color={colors.white}/>
                            Cancel
                        </span>
                    </div>
                </div>
            </div>
        )
    }else if(versionSelectModeEnabled){
        return (
            <div className='selectionState'>
                <div className='outlineVersionPointBox'>
                    <div className='statusHeader'>Initial Version</div>
                    <div className='outlinePointBoxText'>
                        {contentVersion1}
                    </div>
                    <div className="actionButtonSection">
                        <span 
                            className='choiseButton' 
                            onClick={onSelect1?onSelect1:{}} >
                            <CheckCircle 
                                className="actionIcon" 
                                size={"14px"} 
                                color={colors.white}/>
                            Choose Original Version
                        </span>
                    </div>
                </div>
                <div className='outlineVersionPointBox'>
                    <div className='statusHeader'>{updatedVersionText?updatedVersionText:""}</div>
                    <div className='outlinePointBoxText'>
                        {contentVersion2}
                    </div>
                    <div 
                        className="actionButtonSection">
                        <span 
                            className='choiseButton' 
                            onClick={onSelect2?onSelect2:{}}>
                            <CheckCircle 
                                className="actionIcon" 
                                size={"14px"} 
                                color={colors.white}/>
                            Choose New Version
                        </span>
                    </div>
                </div>
            </div>
        )
    }else if(editMode){
        return(
            <div className='outlineSectionBoxSelected'>
                <textarea 
                    rows="5"
                    className='outlineSectionBoxSelectedInput'
                    type={"text"}
                    autoFocus
                    onChange={_handleTextChange}
                    placeholder="Enter the section point..."
                    onKeyPress={_handleKeyDown}
                    onBlur={_handlemouse}
                    value={originalContent}/>
            </div>
        )
    }else{
        return (
            <div style={customStyle?customStyle:{}} className='outlinePointBoxV2'>
                {
                    title?<div className='contentHead'>{title}</div>:<></>
                }
                <div onClick={()=>{}} className='outlinePointBoxText'>
                    {originalContent}
                    {/* <Edit3 className="actionIconSuffix" size={"17px"} color="#1761fd"/> */}
                </div>
                {renderActionButtonViewMode()}
                {renderModePopup()}
            </div>
        )
    }
}

export default CustomContentEditor