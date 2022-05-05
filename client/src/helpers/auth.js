import cookie from "js-cookie";
const jwt = require("jsonwebtoken");

export const setCookie = (key, value) => {
  if (window !== "undefiend") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};
// remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 30,
    });
  }
};


export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

export const getUserId = (key) => {
  let userid = JSON.parse(localStorage.getItem(key));
  return userid;
};
// Set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
    console.log("Set local storage");
  }
};

// Remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  let authtoken = response.data.token;
  let decodedtoken = jwt.decode(authtoken);
  setLocalStorage("user", decodedtoken);
  setLocalStorage("token", authtoken);
  next();
};

export const isLoggedIn = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  removeLocalStorage("token");
  window.location.replace("/login");
  next();
};
