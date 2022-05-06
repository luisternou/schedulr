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
import ShiftCard from "../Components/ShiftCard";
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

  // create a function to redirect to the new shift page
  const createNewShift = () => {
    window.location.href = "/shift/new";
  };

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>Home | KirEx</title>
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
        {/* Create a button to add a new shift */}

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              {/* INSERT SHIFT CARDS HERE */}
              <center>
                <div className="py-4">
                  <button
                    className="w-11/12 py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-lg shadow-md lg:shadow-lg 
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
                    onClick={createNewShift}
                  >
                    {languageData.homepage_add_new_shift[language]}
                  </button>
                </div>
              </center>
              <ShiftCard
                message={
                  languageData.homepage_total_you_fmeas_last_month[language]
                }
                stat={stats.totalLastMonthUser}
                date={"2022-05-19"}
                startTime={"12:00"}
                endTime={"16:00"}
                icon="fas fa-eye"
                colour="bg-blue-500"
                nextshift={true}
              />
              <br />
              <ShiftCard
                message={
                  languageData.homepage_total_you_fmeas_last_month[language]
                }
                stat={stats.totalLastMonthUser}
                icon="fas fa-eye"
                colour="bg-blue-500"
              />
            </div>
            {/* <HomeInfo languageData={languageData} language={language} /> */}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
