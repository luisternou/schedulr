import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { isLoggedIn } from "../../helpers/auth";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import SubmitButton from "../../Components/SubmitButton";
import languageData from "../../config/Languages.json";
const SuperAdminRegister = () => {
  const [superadmin, setSuperadmin] = useState([]);
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
    textChange: "Sign Up",
  });

  useEffect(() => {
    getLanguage();
    fetch(`${process.env.REACT_APP_API_URL}/users/superadmin`)
      .then((resp) => resp.json())
      .then((resp) => {
        let sa;
        if (Object.keys(resp).length) {
          sa = true;
        } else {
          sa = false;
        }
        setSuperadmin(sa);
      });
  }, []);

  const { name, email, password1, password2 } = formInput;
  const handleChange = (text) => (e) => {
    setFormInput({ ...formInput, [text]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password1) {
      if (password1 === password2) {
        setFormInput({ ...formInput });
        axios
          .post(`${process.env.REACT_APP_API_URL}/users/register`, {
            name,
            email,
            password: password1,
            role: "superadmin",
          })
          .then((res) => {
            setFormInput({
              ...formInput,
              name: "",
              email: "",
              password1: "",
              password2: "",
            });

            toast.success(
              languageData.toast_successful_register[language] +
                res.data.message
            );
          })
          .catch((err) => {
            setFormInput({
              ...formInput,
              name: "",
              email: "",
              password1: "",
              password2: "",
              textChange: "Sign Up",
            });

            toast.error(languageData.toast_something_went_wrong[language]);
          });
      } else {
        toast.error(languageData.toast_passwords_do_not_match[language]);
      }
    } else {
      toast.error(languageData.toast_fill_in_all_fields[language]);
    }
  };

  return (
    <div className="BackgroundImage flex flex-col h-screen bg-gray-100 z-0">
      {isLoggedIn() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <Helmet>
        <title>
          {languageData.superadminregister_super_admin_register[language]}
        </title>
      </Helmet>
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <div
          className="LoginCard w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg z-0  "
        >
          <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
            {languageData.superadminregister_super_admin_register[language]}
          </h2>

          {!superadmin ? (
            <form className="mt-10" onSubmit={handleSubmit}>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-gray-600 uppercase"
              >
                {languageData.auth_name[language]}
              </label>
              <input
                onChange={handleChange("name")}
                id="name"
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="name"
                className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              />

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

              <label
                htmlFor="password"
                className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
              >
                {languageData.auth_password[language]}
              </label>
              <input
                onChange={handleChange("password1")}
                id="password"
                type="password"
                name="password1"
                placeholder="Password"
                autoComplete="current-password"
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

              <SubmitButton message={languageData.auth_register[language]} />

              <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
                <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                  <a href="/login" className="flex-2 underline">
                    {languageData.auth_login[language]}
                  </a>
                </p>
              </div>
            </form>
          ) : (
            <h1>
              <br />
              {languageData.superadminregister_message[language]}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegister;
