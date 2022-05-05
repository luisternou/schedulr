import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { authenticate, isLoggedIn } from "../../helpers/auth";
import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import languageData from "../../config/Languages.json";
import "../../styles/Forms.css";
const Login = ({ history }) => {
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    textChange: "Sign In",
  });
  const { email, password1 } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);
    getLanguage();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password1) {
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
            });

            isLoggedIn() && isLoggedIn().role !== "user"
              ? history.push("/")
              : history.push("/");

            let token = res.data.token;

            let decoded_token = jwt.decode(token);

            toast.success(
              `Hey ${decoded_token.name}` +
                languageData.toast_successful_login[language]
            );
          });
        })
        .catch((err) => {
          console.log(err);
          if (
            err.response.data.message ===
            "Your Email could not be found, please sign up"
          ) {
            toast.error(languageData.toast_email_not_found[language]);
          }
          setFormData({
            ...formData,
            email: "",
            password1: "",
            textChange: "Sign In",
          });
          try {
            if (
              err.response.status === undefined ||
              err.response === undefined
            ) {
              toast.error(languageData.toast_something_went_wrong[language]);
            }
            if (err.response.status === 401) {
              toast.error(languageData.toast_wrong_password[language]);
            }
          } catch {
            toast.error(languageData.toast_something_went_wrong[language]);
          }
        });
    } else {
      toast.error(languageData.toast_fill_in_all_fields[language]);
    }
  };
  return (
    <div className="BackgroundImage flex flex-col h-screen bg-gray-100 z-0">
      {isLoggedIn() ? <Redirect to="/" /> : null}
      <Helmet>
        <title>{languageData.auth_login[language]}</title>
      </Helmet>
      <ToastContainer />
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <div
          className="LoginCard w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-lg shadow-md lg:shadow-lg z-0  "
        >
          <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
            {languageData.auth_login[language]}
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

            <button
              type="submit"
              className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
            >
              {languageData.auth_login[language]}
            </button>

            <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
              <a href="/users/password/forget" className="flex-2 underline">
                {languageData.auth_forgot_password[language]}
              </a>

              <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
                {languageData.auth_or[language]}
              </p>

              <a href="/register" className="flex-2 underline">
                {languageData.auth_create_account[language]}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
