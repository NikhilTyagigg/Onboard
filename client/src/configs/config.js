const CLOUD = {
  LOCAL: {
    API_ROOT: "http://127.0.0.1:5000/",
  },
  SERVER: {
    API_ROOT: "",
  },
};

import { isAdmin, isLocal } from "../utility/helper";

const develop = isLocal();

export const config = {
  baseURL: develop
    ? Object.assign({}, CLOUD.LOCAL)
    : Object.assign({}, CLOUD.SERVER),
};
