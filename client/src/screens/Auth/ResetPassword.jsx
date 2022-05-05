import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import languageData from "../../config/Languages.json";
const ResetPassword = ({ match }) => {
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
  });
  const { password1, password2 } = formData;

  useEffect(() => {
    getLanguage();
  }, []);
  let token = match.params.token;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const handleSubmit = (e) => {
    console.log(password1, password2);
    e.preventDefault();
    if (password1 === password2 && password1 && password2) {
      setFormData({ ...formData });
      axios
        .put(`${process.env.REACT_APP_API_URL}/user/passwordreset/${token}`, {
          newPassword: password1,
          resetPasswordLink: token,
        })
        .then((res) => {
          console.log("After password was reset");
          console.log(res.data.message);
          setFormData({
            ...formData,
            password1: "",
            password2: "",
          });
          toast.success(res.data.message);
          toast.info(languageData.toast_login_again[language]);
        })
        .catch((err) => {
          toast.error(languageData.toast_something_went_wrong[language]);
        });
    } else {
      toast.error(languageData.toast_passwords_do_not_match[language]);
    }
  };
  return (
    <div className="BackgroundImage flex flex-col h-screen bg-gray-100 z-0">
      <ToastContainer />
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <div
          className="LoginCard w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg z-0  "
        >
          <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
            {languageData.auth_reset_password[language]}
          </h2>

          <form className="mt-10" onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-600 uppercase"
            >
              {languageData.auth_password[language]}
            </label>
            <input
              onChange={handleChange("password1")}
              id="password"
              type="password"
              name="password1"
              placeholder="Password"
              autoComplete="email"
              className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
            />

            <label
              htmlFor="passwordConfirm"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              {languageData.auth_confirm_password[language]}
            </label>
            <input
              onChange={handleChange("password2")}
              id="passwordConfirm"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              autoComplete="current-password"
              className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
            />

            <button
              type="submit"
              className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
            >
              {languageData.auth_reset_password[language]}
            </button>

            <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
              <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                <a href="/login" className="flex-2 underline">
                  {languageData.auth_login[language]}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
