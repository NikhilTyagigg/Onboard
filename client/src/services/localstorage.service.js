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
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("user_role", user.role);
  }

  function _getUserInfo() {
    if (localStorage.getItem("userInfo")) {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
    return null;
  }

  function _getUserRole() {
    return parseInt(localStorage.getItem("user_role"), 10);
  }

  function _getAccessToken() {
    return localStorage.getItem("token");
  }

  function _getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }

  function _isAdminUser() {
    return _getUserRole() === 0;
  }

  function _clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }

  function _clearLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user_role");
  }

  return {
    getService: _getService,
    setToken: _setToken,
    setUserInfo: _setUserInfo,
    getUserInfo: _getUserInfo,
    getUserRole: _getUserRole,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    clearLocalStorage: _clearLocalStorage,
    isAdminUser: _isAdminUser,
    setTokenAfterRefreshToken: _setTokenAfterRefreshToken,
  };
})();

export default LocalStorageService;
