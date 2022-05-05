import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";
import { isLoggedIn, getCookie, signout } from "../helpers/auth";
import { Helmet } from "react-helmet";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import languageData from "../config/Languages.json";
const Profile = ({ history }) => {
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
    role: "",
  });

  useEffect(() => {
    getLanguage();
    const loadProfile = () => {
      const token = getCookie("token");
      axios
        .get(`${process.env.REACT_APP_API_URL}/user/id/${isLoggedIn()._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const { role, name, email } = res.data;
          setFormInput({ role, name, email });
        })
        .catch((err) => {
          if (err.response.status === undefined || err.response === undefined) {
            toast.error(languageData.toast_something_went_wrong[language]);
          } else toast.error(languageData.toast_something_went_wrong[language]);
          if (err.response.status === 401) {
            signout(() => {
              history.push("/login");
            });
          }
        });
    };
    loadProfile();
  }, [history, language]);

  const { name, email, password1, password2, role } = formInput;
  const handleChange = (text) => (e) => {
    setFormInput({ ...formInput, [text]: e.target.value });
  };
  const handleSubmit = (e) => {
    const token = getCookie("token");
    console.log(token);
    let decoded_token = jwt.decode(token);
    let loggedinuserid = decoded_token._id;

    e.preventDefault();
    setFormInput({ ...formInput });
    if (password1) {
      if (password1 === password2) {
        axios
          .put(
            `${process.env.REACT_APP_API_URL}/user/update/${loggedinuserid}`,
            {
              name,
              email,
              password: password1,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            toast.success(languageData.toast_profile_updated[language]);
            setFormInput({ ...formInput });
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        toast.error(languageData.toast_passwords_do_not_match[language]);
      }
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/update/${loggedinuserid}`,
          {
            name,
            email,
            password: password1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toast.success(languageData.toast_profile_update[language]);
          setFormInput({ ...formInput });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.user_edit_profile[language]}</title>
      </Helmet>
      <div className="relative md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="BackgroundImage flex flex-col h-screen bg-gray-100 z-0">
          <div className="grid place-items-center mx-2 my-20 sm:my-auto">
            <div
              className="LoginCard w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6 
            bg-white rounded-xl shadow-md lg:shadow-lg z-0  "
            >
              <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
                {languageData.user_profile[language]}
              </h2>

              <form className="mt-10" onSubmit={handleSubmit}>
                <label
                  htmlFor="role"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  {languageData.user_role[language]}
                </label>
                <input
                  id="role"
                  type="text"
                  name="role"
                  disabled
                  placeholder="Role"
                  value={role}
                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  required
                />
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  {languageData.user_email[language]}
                </label>
                <input
                  disabled
                  value={email}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  required
                />
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-gray-600 uppercase"
                >
                  {languageData.user_name[language]}
                </label>

                <input
                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  placeholder="Name"
                  onChange={handleChange("name")}
                  value={name}
                  id="name"
                />
                <hr />
                <div className="justify-center">
                  <br />
                  <center>
                    <h4>{languageData.user_change_password[language]}</h4>
                  </center>
                </div>
                <label
                  htmlFor="password"
                  className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
                >
                  {languageData.user_password[language]}
                </label>
                <input
                  onChange={handleChange("password1")}
                  id="password"
                  type="password"
                  name="password1"
                  placeholder="Password"
                  autoComplete="current-password"
                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
                <label
                  htmlFor="confirm_password"
                  className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
                >
                  {languageData.user_confirm_password[language]}
                </label>
                <input
                  onChange={handleChange("password2")}
                  id="confirm_password"
                  type="password"
                  name="password2"
                  placeholder="Confirm Password"
                  autoComplete="current-password"
                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />

                <button
                  type="submit"
                  className="rounded-xl shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
                >
                  {languageData.user_submit[language]}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="invisible relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="invisible font-semibold text-base text-invisible flex justify-center">
                        Profile
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto"></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profile;
