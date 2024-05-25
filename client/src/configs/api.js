import { config } from './config';
import { isAdmin, isLocal } from '../utility/helper';

export const apiURL = {
    LOGIN_VALIDATE_USER: config.baseURL+'/user/login/',
    LOGIN_REFRESH_TOKEN: ''
};