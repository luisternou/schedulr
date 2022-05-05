import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import { getCookie } from "../helpers/auth";
import { classNames } from "../helpers/Utils";
import HomeInfo from "../Components/HomeInfo";
import HomeCard from "../Components/HomeCard";
import languageData from "../config/Languages.json";
import "../styles/index.css";
const Home = ({ history }) => {
  const token = getCookie("token");

  let user_id = jwt.decode(token)._id;
  const [stats, setStats] = useState([]);
  const [result, setResult] = useState([]);
  const [isFMEA, setIsFMEA] = useState([]);
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };

  useEffect(() => {
    let fallbackStats = {
      userCount: 0,
      count: 0,
      totalLastMonth: 0,
      totalLastMonthUser: 0,
    };
    const getStats = () => {
      fetch(`${process.env.REACT_APP_API_URL}/fmea/summary/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setStats(resp);
        })
        .catch((err) => {
          setStats(fallbackStats);
          toast.error(languageData.toast_home_stats[language]);
        });
    };
    getStats();
    const getFMEA = () => {
      fetch(`${process.env.REACT_APP_API_URL}/fmea/user/${user_id}/5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setResult(resp);
          if (resp.length > 0) {
            setIsFMEA(true);
          } else {
            setIsFMEA(false);
          }
        })
        .catch((err) => {
          toast.error(languageData.toast_home_stats[language]);
        });
    };
    getFMEA();
    getLanguage();
  }, [token, user_id, language]);

  function convertDate(d) {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return dt + "/" + month + "/" + year;
  }

  function statusPill(value) {
    let language = localStorage.getItem("language");
    if (!language) {
      language = "en";
    }
    const status = value ? value.toLowerCase() : "unknown";
    let status_translated = null;
    if (status.startsWith("complete")) {
      status_translated = languageData.status_complete[language];
    }
    if (status.startsWith("incomplete")) {
      status_translated = languageData.status_incomplete[language];
    }
    return (
      <span
        className={classNames(
          "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
          status.startsWith("complete") ? "bg-green-100 text-green-800" : null,
          status.startsWith("incomplete") ? "bg-red-100 text-red-800" : null
        )}
      >
        {status_translated}
      </span>
    );
  }

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>Home | ViLix</title>
      </Helmet>
      <div className="relative BackgroundImage md:ml-64 bg-black-100">
        <Navbar />
        {/* Header */}
        <div className="relative md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>
              {/* Card stats */}
              <div className="flex flex-wrap">
                <HomeCard
                  message={
                    languageData.homepage_total_fmeas_submitted[language]
                  }
                  stat={stats.count}
                  icon="fas fa-hashtag"
                  colour="bg-red-500"
                />
                {/* Total submitted by current user */}
                <HomeCard
                  message={
                    languageData.homepage_total_you_fmeas_submitted[language]
                  }
                  stat={stats.userCount}
                  icon="fas fa-user-edit"
                  colour="bg-orange-500"
                />
                {/* Last month total submited */}
                <HomeCard
                  message={
                    languageData.homepage_total_fmeas_submitted_lastmonth[
                      language
                    ]
                  }
                  stat={stats.totalLastMonth}
                  icon="fas fa-calendar"
                  colour="bg-pink-500"
                />

                {/* Last month submitted by current user */}
                <HomeCard
                  message={
                    languageData.homepage_total_you_fmeas_last_month[language]
                  }
                  stat={stats.totalLastMonthUser}
                  icon="fas fa-calendar-alt"
                  colour="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap"></div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700">
                        {languageData.homepage_table_my_latest_fmeas[language]}
                      </h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                      <Link
                        to="/fmea/my"
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded-xl outline-none focus:outline-none mr-1 mb-1"
                        style={{ transition: "all .15s ease" }}
                      >
                        {languageData.homepage_table_see_all[language]}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* Projects table */}

                  {isFMEA ? (
                    <table className="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>
                          <th className="px-6 bg-black-50 text-black-500 align-middle border border-solid border-black-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            {languageData.homepage_table_project_name[language]}
                          </th>
                          <th className="px-6 bg-black-50 text-black-500 align-middle border border-solid border-black-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            {
                              languageData.homepage_table_project_number[
                                language
                              ]
                            }
                          </th>
                          <th className="px-6 bg-black-50 text-black-500 align-middle border border-solid border-black-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            {languageData.homepage_table_created_on[language]}
                          </th>
                          <th className="px-6 bg-black-50 text-black-500 align-middle border border-solid border-black-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            {languageData.homepage_table_status[language]}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.map(function (fmea, index) {
                          return (
                            <tr key={index}>
                              <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                <a href={`/fmea/view/${fmea._id}`}>
                                  {" "}
                                  {fmea.projectName}{" "}
                                </a>
                              </th>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <a href={`/fmea/view/${fmea._id}`}>
                                  {fmea.projectNumber}
                                </a>
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <a href={`/fmea/view/${fmea._id}`}>
                                  {convertDate(fmea.createdAt)}
                                </a>
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <a href={`/fmea/view/${fmea._id}`}>
                                  {" "}
                                  {statusPill(fmea.status)}{" "}
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex justify-center">
                      <h3>{languageData.homepage_table_no_fmeas[language]}</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <HomeInfo languageData={languageData} language={language} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
