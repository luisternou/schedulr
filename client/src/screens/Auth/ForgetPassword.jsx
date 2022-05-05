import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet";
import SubmitButton from "../../Components/SubmitButton";
import languageData from "../../config/Languages.json";
const ForgetPassword = ({ history }) => {
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  useEffect(() => {
    getLanguage();
  }, []);
  const [formInput, setFormInput] = useState({
    email: "",
  });
  const { email } = formInput;
  const handleChange = (text) => (e) => {
    setFormInput({ ...formInput, [text]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setFormInput({ ...formInput });
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/forgotpassword`, {
          email,
        })
        .then((res) => {
          setFormInput({
            ...formInput,
            email: "",
          });
          toast.success(languageData.toast_check_email[language]);
        })
        .catch((err) => {
          toast.error(languageData.toast_something_went_wrong[language]);
        });
    } else {
      toast.error(languageData.toast_fill_in_all_fields[language]);
    }
  };
  return (
    <div className="BackgroundImage flex flex-col h-screen bg-gray-100 z-0">
      <ToastContainer />
      <Helmet>
        <title>{languageData.auth_forgot_password[language]}</title>
      </Helmet>
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <div
          className="LoginCard w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg z-0  "
        >
          <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
            {languageData.auth_forgot_password[language]}
          </h2>

          <form className="mt-10" onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-600 uppercase"
            >
              {languageData.auth_email[language]}
            </label>
            <input
              onChange={handleChange("email")}
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="email"
              className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
            />

            <SubmitButton
              message={languageData.auth_forgot_password[language]}
            />

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

export default ForgetPassword;
