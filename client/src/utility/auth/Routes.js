import { Outlet, Navigate } from 'react-router-dom'
import Login from "../../views/Login/index.js"
import Register from "../../views/Register"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"
import { isAdmin, scrollOnTop } from '../helper'
import { verifyToken } from '../../services/agent.js'
import { faL } from '@fortawesome/free-solid-svg-icons'
import LocalStorageService from '../../services/localstorage.service.js'
import toast from 'react-hot-toast'
import { toastStyle } from "../../utility/helper"
import { statusCode } from "../../utility/constants/utilObject";
const localStorageService = LocalStorageService.getService();

const checkAuth = () => {
    if(localStorageService.getAccessToken() && checkTokenLife()){
        return true;
    }else{
        localStorageService.clearLocalStorage();
        return false
    }
}
const checkAuthAdmin = () =>{
    if(localStorageService.getAccessToken() &&  localStorageService.isAdminUser() && checkTokenLife()){
        return true;
    }else{
        localStorageService.clearLocalStorage();
        return false
    }
}
// PrivateRoutes can ONLY be accessed if user is logged in for e.g. Dashboard, Profile etc. routes
const PrivateRoutes = ({component : Component,role}) => { 
    scrollOnTop()
    if(role == "admin"){
        const data = checkAuthAdmin();
        return( (checkAuthAdmin()) ? <LayoutWrapper><Component/></LayoutWrapper> : <Navigate to="/login"/>)
    }else{
        return( (checkAuth()) ? <LayoutWrapper><Component/></LayoutWrapper> : <Navigate to="/login"/>)
    }
}
// PublicRoutes can ONLY be accessed if user is not logged in for e.g. Login, Register, Forget Password etc. routes 
const PublicRoutes= ({component : Component, notAllowedInAdmin}) => {
    if(notAllowedInAdmin){return(<Navigate to="/"/>)}
    else{return( checkAuth() ? <Navigate to="/"/>: <Component/>)}
}
// AllRoutes can be accessed anytime, wheather a user is logged in or not he can navigate to this route for e.g. Pricing route 
const AllRoutes=({component : Component})=>{
    return <Component/>
}

const checkTokenLife = () => {
    if(localStorage.getItem('logged') != undefined && localStorage.getItem('logged') != ""){
        const loggedTime = localStorage.getItem('logged');
        const currentTime = Date.now();
        const hours = (Math.abs(currentTime - loggedTime) / 36e5).toFixed(0);
        if(hours >= 8){
            localStorageService.clearLocalStorage();
            return false;
        }else{
            return true;
        }
    }else{
        localStorageService.clearLocalStorage();
        return false;
    }
}

export  {
    PrivateRoutes,
    PublicRoutes,
    AllRoutes,
    checkAuthAdmin
}