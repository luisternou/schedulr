import React, { useState, useEffect, Suspense } from "react";
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

  const [navigation, setNavigation] = useState([]);
  const [result, setResult] = useState([]);
  const [isShift, setIsShift] = useState([]);
  const [language, setLanguage] = useState([]);
  const [options, setOptions] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };

  useEffect(() => {
    const getShift = () => {
      fetch(`${process.env.REACT_APP_API_URL}/shift/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          let data = resp.data;
          // sort by date
          data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
          setIsShift(data);
          setResult(data);
        })
        .catch((err) => {
          toast.error(languageData.toast_home_stats[language]);
        });
    };

    getShift();

    //getNav(result.data[0].date, result.data[0].start_time);
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

  console.log("navigation");
  console.log(navigation);

  return (
    //  only render when navigation is loaded
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default Home;
