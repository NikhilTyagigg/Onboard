/* eslint-disable */
import axios from "axios";
import qs from "qs";
import { isAdmin, isLocal } from "../utility/helper";
import { axiosInstance } from "./interceptor.service";
import LocalStorageService from "./localstorage.service";
const localStorageService = LocalStorageService.getService();
const develop = isLocal();

const CLOUD = {
  LOCAL: {
    API_ROOT: "http://localhost:5000/api/v1/",
  },
  SERVER: {
    API_ROOT: "https://onboard.iwayplus.in/api/v1/",
  },
};
let URL =
  process.env.NODE_ENV === "development"
    ? Object.assign({}, CLOUD.LOCAL)
    : Object.assign({}, CLOUD.SERVER);
//console.log(URL);

const requests = {
  get: (url) => {
    return axiosInstance
      .get(URL.API_ROOT + url)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  },
  post: (url, body) => {
    //Added for Alpha Prompts Visible
    if (typeof body === "object" && body !== null) {
      if (!(body?.user && body?.user != ""))
        body["user"] = localStorage.getItem("id");
      if (!body?.type) body["type"] = localStorage.getItem("content_type");
      body["is_pro"] = "wcw436aidbewu@$*^46954$%^^";
    }
    console.log(body, URL.API_ROOT + url);

    return axiosInstance
      .post(URL.API_ROOT + url, body)
      .then((res) => {
        console.log(body);
        return res;
      })
      .catch((error) => {
        return error;
      });
  },
  postPublic: (url, body) => {
    return axios
      .post(URL.API_ROOT + url, body)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  },
  delete: (url, body) => {
    return axiosInstance
      .delete(URL.API_ROOT + url, body)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  },
  uploadFile: (url, formData) => {
    return axios
      .post(`${URL.API_ROOT}${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  },
};

const Auth = {
  login: (email, password) => {
    return requests.postPublic(
      "user/login/",
      qs.stringify({
        email: email,
        password: password,
      })
    );
  },
  signUpHandler: (payload) => {
    return requests.postPublic("user/register/", qs.stringify({ ...payload }));
  },
};

// Assuming requests.post handles sending the token in the header
export const verifyToken = (token) => {
 // console.log("Verifying token...");
  return requests.post("auth/token_verify/", { token });
};

export const updateUserPassword = (payload) => {
  return requests.post("auth/userprofile/update_password/", payload);
};

export const updateUserProfile = (payload) => {
  return requests.post("auth/userprofile/update_user/", payload);
};

export const getUserProfile = (payload) => {
  return requests.post("auth/fetch_user_by_id/", payload);
};

export const loginHandler = (payload) => {
  return requests.postPublic("auth/login/", qs.stringify({ ...payload }));
};

export const signUpHandler = (payload) => {
  return requests.postPublic("auth/register/", payload);
};

export const fetchRegisteredEmails = async () => {
  try {
    const response = await requests.get("auth/registered-emails");
    return response.data;
  } catch (error) {
    console.error("Error fetching registered emails:", error);
    throw error;
  }
};

export const someApiToUpdateUserRole = async (userId, role) => {
  const payload = { userId, role };
  try {
    const response = await requests.postPublic("auth/changerole", payload);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkUser = (payload) => {
  return requests.postPublic("auth/check", payload);
};
export const otpHandler = (payload) => {
  return requests.postPublic("auth/send-otp/", payload);
};
export const verifyOtp = (payload) => {
  return requests.postPublic("auth/verify-otp/", payload);
};
export const getotp = (queryParams = "") => {
  return requests.post("auth/getotp" + queryParams);
};
export const deleteUserProfile = () => {
  // Your function implementation
  return requests.delete("auth/deletep");
};

// ############# ONBOARD APIS ##################
export const getLogs = (queryParams = "", city = "") => {
  return requests.post(`route/getLogs${queryParams}`, { city });
};

export const getVehicleRecords = (queryParams = "", userId = "", city = "") => {
  return requests.post("route/getVehicles" + queryParams, { userId, city });
};

export const addVehicle = (payload) => {
  return requests.post("route/addVehicle", payload);
};

export const getRoutes = (queryParams = "") => {
  return requests.post("route/getRoutes" + queryParams);
};

export const addRoute = (payload) => {
  return requests.post("route/addRoute", payload);
};
export const addMultipleVehicles = (payload) => {
  return requests.post("route/addMultipleVehicles", payload);
};

export const getMasterData = (city) => {
  const payload = { city: city };
  return requests.post("route/getMasterData", payload);
};

export const getRouteConfig = (payload, city) => {
 // console.log("hello getrouteconfig =", payload);
  return requests.post("route/getVehicleRouteMap", { city });
};

export const addRouteConfig = (payload) => {
 // console.log("addconfig paylod ****==", payload);
  return requests.post("route/addVehicleConfig", payload);
};

export const addMultipleRoutes = (routes, city) => {
  const payload = {
    routes: routes,
    city: city,
  };
  return requests.post("route/addMultipleRoutes", payload);
};

export const sendResetPasswordEmail = (payload) => {
  //console.log("hey checking reset wala", payload);
  return requests.post("auth/send_reset_password_email/", payload);
};

export const resetPasswordHandler = (payload) => {
  return requests.post("auth/reset_password/", payload);
};

export const sendEmailVerification = (payload) => {
  // console.log(payload);
  return requests.postPublic(`auth/send-otp/`, payload);
};

export const verifyEmail = (payload) => {
  return requests.postPublic(`auth/verify_email/`, payload);
};

// ############# ONBOARD APIS ##################

const TextParaphrase = {
  rephrase_text: (text, no_of_lines) => {
    return requests.post(
      "sentiment/rephrase_text/",
      qs.stringify({
        text: text,
        no_of_lines: no_of_lines,
      })
    );
  },
  rephrase_text_parrot: (text, no_of_lines) => {
    return requests.post(
      "sentiment/rephrase_text_parrot/",
      qs.stringify({
        text: text,
        no_of_lines: no_of_lines,
      })
    );
  },
};

const TextSummarize = {
  summarize_text_v1: (text, no_of_lines) => {
    return requests.post(
      "sentiment/summarize_text/",
      qs.stringify({
        text: text,
        no_of_lines: no_of_lines,
      })
    );
  },
  summarize_text_v2: (text, no_of_lines) => {
    return requests.post(
      "sentiment/summarize_text_v2/",
      qs.stringify({
        text: text,
        no_of_lines: no_of_lines,
      })
    );
  },
  summarize_text_v3: (text, no_of_lines) => {
    return requests.post(
      "sentiment/summarize_text_v3/",
      qs.stringify({
        text: text,
        no_of_lines: no_of_lines,
      })
    );
  },
};

const Product = {
  list: () => {
    return requests.get("product/");
  },
};

export default {
  Auth,
  Product,
  TextParaphrase,
  TextSummarize,
};
