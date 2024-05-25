import toast from 'react-hot-toast'
import moment from 'moment'
import moment_tz from 'moment-timezone'
import { 
    ACCESS_TYPE, 
    LOCAL_STORE_KEY, 
    DEVELOPMENT_TYPE 
} from './constants/localStoreKeys';

export const getUserNameFromEmail = (email) => {
    return email.replace('@','').replaceAll('.','')
};

export const isValidEmail = (email) => {
    return String(email)
      .toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const isValidMobile = (mobile) => {
    return mobile.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && ! (mobile.match(/0{5,}/));
}

export const isValidPassword = (pasword) => {
    return pasword.length >= 6
};

export const toastStyle = {
    duration: 3000,
    duration5: 5000,
    duration9: 9000,
    success: {
        id: 'clipboard',
        style: {
            height: "70px",
            padding: '16px',
            color: '#FFFFFF',
            background: "#1761fd",
        },
        iconTheme: {
            primary: '#1761fd',
            secondary: '#FFFAEE',
        },
    },
    error: {
        id: 'clipboard',
        style: {
            height: "70px",
            padding: '16px',
            color: '#FFFFFF',
            background: "#E57373"
        },
        iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
        },
    }
}

export const formatNumbers = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const filterIdFromNativeUrl = (url) => {
    if(!url){
        const urlPieces = window.location.href.split("/");
        const id = urlPieces.at(-1);
        if(parseInt(id) && parseInt(id) > 0)
            return parseInt(id)
        else
        return 0
    }else{
        const urlPieces = url.split("/")
        const id = urlPieces.at(-1);
        if(parseInt(id) && parseInt(id) > 0)
            return parseInt(id)
        else
        return 0
    }
}


export const showSuccessToast = (message) => {
    toast.success(message, {...toastStyle.success});
}

export const showErrorToast = (message) => {
    toast.error(message, {...toastStyle.error});
}

export const isAdmin = () => {
    return localStorage.getItem(LOCAL_STORE_KEY.USER_MODE) == ACCESS_TYPE.ADMIN 
}

export const isLocal = () => {
    return localStorage.getItem(LOCAL_STORE_KEY.DEVELOPMENT_MODE) == DEVELOPMENT_TYPE.LOCAL
}

export const scrollOnTop = () =>{
    window.scroll({ top: 0, behavior: 'instant'})
}
  
export const utcToLocal = (date) =>{
    const timezone = moment_tz.tz.guess();
    let utcDate = moment.utc(date).format();
    let localDateCreatedAt = moment.tz(utcDate, timezone).format('DD/MM/YYYY hh:mm A');
    return localDateCreatedAt
}