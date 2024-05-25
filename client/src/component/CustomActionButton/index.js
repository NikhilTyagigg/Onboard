import React, { Fragment, useState } from 'react'
import { Spinner } from "reactstrap"
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, 
    ArrowRight, 
    Search, 
    RefreshCcw,
    Eye, 
    Save,
    Layout,
    Download, 
    Clock, 
    EyeOff,
    Scissors,
    Shield,
    Copy,
    File,
    Edit,
    List,
    Mail
 } from "react-feather"
import "./index.css"

const CustomActionButton = ({
    name, 
    icon, 
    onPress, 
    loaderEnabled, 
    laodingText,
    color, 
    customStyle}) => { 
    let buttonIcon = ""
    switch(icon){
        case 'back': buttonIcon = <ArrowLeft size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'front': buttonIcon = <ArrowRight size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'refresh': buttonIcon = <RefreshCcw size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'search': buttonIcon = <Search size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'eye': buttonIcon = <Eye size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'eye-off': buttonIcon = <EyeOff size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'save': buttonIcon = <Save size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'post': buttonIcon = <Layout size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'download': buttonIcon = <Download size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'shield': buttonIcon = <Shield size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'copy': buttonIcon = <Copy size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'file': buttonIcon = <File size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'edit': buttonIcon = <Edit size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'cut': buttonIcon = <Scissors size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'list': buttonIcon = <List size={'18px'} style={{marginRight:"10px"}}/>; break;
        case 'mail': buttonIcon = <Mail size={'18px'} style={{marginRight:"10px"}}/>; break;
    }
    let colorClasss = "";
    if(color){colorClasss=color}

    const renderSpinner = () => {
        if(color){
            return (
                <div style={{display:'flex',justifyContent:'center', textAlign: 'center'}}>
                    <div><Clock size={'18px'} style={{marginRight:"10px"}}/></div>
                    <div style={{minWidth:'100px',textAlign:'start'}}>{laodingText?laodingText:"Loading.."}</div>
                </div>
            )
        }else{
            return <Spinner size={'sm'} color="white" />
            /*return (
                <div style={{display:'flex',justifyContent:'center', textAlign: 'center'}}>
                    <div><Clock size={'18px'} style={{marginRight:"10px"}}/></div>
                    <div style={{minWidth:'100px',textAlign:'start'}}>{laodingText?laodingText:"Loading.."}</div>
                </div>
            )*/
        }
    }
    
    return(
        <button disabled={loaderEnabled} className='btn btn-primary' onClick={loaderEnabled?{}:onPress} style={{
            fontSize: '1rem',
            fontWeight: '500',
            lineHeight: '1rem',
            borderRadius: '12px',
            padding: '12px',
            minWidth: '200px'

        }}>
            {
                loaderEnabled ? renderSpinner(): <span>{buttonIcon}  {name}</span>
                
            }
        </button>
      )

        /*
            <div style={customStyle?{...customStyle}:{}} onClick={loaderEnabled?{}:onPress} 
            className={`custom-btn-container ${colorClasss}`}>
            {
                loaderEnabled?
                renderSpinner():
                <div style={{display:'flex',justifyContent:'center'}}>
                    <div>{buttonIcon}</div>
                    <div style={{minWidth:'100px',textAlign:'start'}}>{name}</div>
                </div>
            }
        </div>
    */
}

export default CustomActionButton
 
