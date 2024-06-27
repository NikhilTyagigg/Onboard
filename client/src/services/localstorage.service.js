const LocalStorageService = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _setToken(tokenObj) {
    localStorage.setItem("token", tokenObj.token);
    localStorage.setItem("refresh_token", tokenObj.refresh);
  }

  function _setTokenAfterRefreshToken(token) {
    localStorage.setItem("token", token);
  }

  function _setUserInfo(user) {
    console.log("function a setinfo ka", user);
    localStorage.setItem("userInfo", JSON.stringify(user));
  }

  function _getUserInfo() {
    localStorage.getItem("userInfo");
    if (localStorage.getItem("userInfo")) {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
    return null;
  }

  function _getAccessToken() {
    return localStorage.getItem("token");
  }
  function _getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }
  function _isAdminUser() {
    return localStorage.getItem("user_role") == "ADMIN";
  }
  function _clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }

  function _clearLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userInfo");

    //localStorage.clear();
  }

  return {
    getService: _getService,
    setToken: _setToken,
    setUserInfo: _setUserInfo,
    getUserInfo: _getUserInfo,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    clearLocalStorage: _clearLocalStorage,
    isAdminUser: _isAdminUser,
    setTokenAfterRefreshToken: _setTokenAfterRefreshToken,
  };
})();

export default LocalStorageService;
