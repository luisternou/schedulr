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
  const [navigation, setNavigation] = useState([]);
  const [result, setResult] = useState([]);
  const [isShift, setIsShift] = useState([]);
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };

  function getNav() {
    // use the citymaper api to get the navigation data

    //set the request's mode to 'no-cors'
    const request = new Request(
      `https://api.external.citymapper.com/api/1/directions/transit?start=48.211890,16.412290&end=48.120669,16.563048&time_type=arrive&time=2022-05-11T08:15:00+02:00`,
      {
        headers: {
          "Citymapper-Partner-Key": "vfMK0MMQAZ0QvL0NIlks1WIwVRfoILVl",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode: "no-cors",
      }
    );
    fetch(request)
      .then((response) => response.json())
      .then(
        (data) => {
          setNavigation(data);
        }
        //catch the error
      )
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    let fallbackStats = {
      userCount: 0,
      count: 0,
      totalLastMonth: 0,
      totalLastMonthUser: 0,
    };
    getNav();
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
    const getShift = () => {
      fetch(`${process.env.REACT_APP_API_URL}/shift/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setResult(resp.data);
          if (resp.data.length > 0) {
            setIsShift(true);
          } else {
            setIsShift(false);
          }
        })
        .catch((err) => {
          toast.error(languageData.toast_home_stats[language]);
        });
    };
    getShift();
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
        <div className="relative md:pt-32 pb-10 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full"></div>
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
              {/* display the shift cards and set nextshift to true if it is the first shift else false */}
              {isShift ? (
                result.map((shift, index) => {
                  return (
                    <ShiftCard
                      key={index}
                      shift={shift}
                      nextshift={index === 0 ? true : false}
                      language={language}
                      icon="fas fa-eye"
                      colour="bg-gray-500"
                    />
                  );
                })
              ) : (
                <h2 className="text-center text-2xl font-bold text-gray-800">
                  no shifts
                </h2>
              )}
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
