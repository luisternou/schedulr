import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getCookie, signout } from "../../helpers/auth";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";
import moment from "moment";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import languageData from "../../config/Languages.json";
const ViewShift = ({ history, match }) => {
  const [functions, setFunctions] = useState([]);
  const [formInput, setFormInput] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    description: "",
  });

  const { date, startTime, endTime, duration, description } = formInput;

  const id = match.params.id;
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
    const loadFMEA = () => {
      const token = getCookie("token");

      axios
        .get(`${process.env.REACT_APP_API_URL}/shift/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const { date, startTime, endTime, duration, description } =
            res.data.data;

          setFormInput({
            ...formInput,
            date,
            startTime,
            endTime,
            duration,
            description,
          });

          fetch(`${process.env.REACT_APP_API_URL}/shift/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((resp) => resp.json())
            .then((resp) => {
              setFunctions(resp.functions);
            });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === undefined || err.response === undefined) {
            toast.error(languageData.toast_something_went_wrong[language]);
          }
          if (err.response.status === 401) {
            toast.error(languageData.toast_no_permissins_view_fmea[language]);
            signout(() => {
              history.push("/login");
            });
          }
          if (err.response.status === 404) {
            toast.error(languageData.toast_fmea_not_found[language]);
          }
        });
    };
    loadFMEA();
  }, [formInput, history, id, language]);

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.viewfmea_view_fmea[language]}</title>
      </Helmet>
      <div className="relative BackgroundImage md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="relative  md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>{/* Card stats */}</div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap"></div>
          {/* NEW FMEA Form */}
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative h-full overflow-auto flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.viewfmea_view_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* form */}
                  <div className="py-10 flex justify-center">
                    <div className="w-full max-w-lg">
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            {languageData.fmea_change_state[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {moment(date).format("DD.MM.YYYY")}
                          </p>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {languageData.fmea_project_name[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {startTime}
                          </p>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-last-name"
                          >
                            {languageData.fmea_project_number[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            {languageData.fmea_model[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {duration}
                          </p>
                        </div>
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            {languageData.fmea_change_state[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {description}
                          </p>
                        </div>
                      </div>

                      <div></div>

                      <Link
                        to={`/shift/view/${id}/edit`}
                        className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-sm focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center"
                      >
                        <i className="fas fa-edit fa 1x w-6  -ml-2" />
                        <span className="ml-3">
                          {languageData.viewfmea_edit_fmea[language]}
                        </span>
                      </Link>
                    </div>
                  </div>
                  {/* End of Form */}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ViewShift;
