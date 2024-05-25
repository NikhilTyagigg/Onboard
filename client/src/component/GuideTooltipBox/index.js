import React, { Fragment, Component } from 'react'
import ideaIcon from "@src/assets/icons/suggestion.png"
import { XCircle } from 'react-feather'
import "./index.scss"

const GuideTooltipBox = ({
        head,
        content,
        onClose,
        applyMargin,
        fullHeight
    }) => {

    const containerStyle = {
        marginLeft: applyMargin?'5%':'0',
        marginRight: applyMargin?'5%':'0',
        width: applyMargin?'90%':'100%',
    }

    return(
        <div className={`guideTooltipContainer ${fullHeight?"fullHeight":''}`} style={{...containerStyle}}>
            <div className='head'>
                <div className='iconContainer'>
                    <img className='tooltipIcon' src={ideaIcon} />
                </div>
                <div className='headerText'>
                    {head}
                </div>
                <div onClick={onClose?onClose:{}} className='iconContainer'  style={{paddingTop:'7px'}}>
                    <XCircle
                        className="actionIcon" 
                        style={{marginLeft:'7px'}}
                        size={"19px"} 
                        color='#546E7A'/>
                </div>
            </div>
            {content}
        </div>
      )
}

export default GuideTooltipBox