import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getUserId, getCookie } from "../../helpers/auth";
import languageData from "../../config/Languages.json";
import { Helmet } from "react-helmet";
import "../../styles/RangeSlider.css";
import "../../styles/Forms.css";
import GradingHelp from "../../Components/GradingHelp";
import Tooltip from "react-tooltip-lite";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import SubmitButton from "../../Components/SubmitButton";

const NewSchedule = (props) => {
  const currentUser = getUserId("user");

  const [showModal, setShowModal] = React.useState(false);
  const [gradingType, setGradingType] = useState([]);
  const [language, setLanguage] = useState([]);

  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const [functions, setfunctions] = useState([
    { function: "", failureMode: "" },
  ]);
  useEffect(() => {
    getLanguage();
  }, []);

  const [formInput, setFormInput] = useState({
    userID: currentUser._id,
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    description: "",
    textChange: "Submit",
  });

  const { userID, date, startTime, endTime, duration, description } = formInput;

  const handleChange = (text) => (e) => {
    setFormInput({ ...formInput, [text]: e.target.value });
    console.log(formInput);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const authtoken = getCookie("token");
    if ((userID, date, startTime, endTime, duration, description)) {
      setFormInput({ ...formInput, textChange: "Submitting" });

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/schedule/new`,
          {
            userID,
            date,
            startTime,
            endTime,
            duration,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        )
        .then((res) => {
          setFormInput({
            ...formInput,
            userID: currentUser._id,
            date: "",
            startTime: "",
            endTime: "",
            duration: "",
            description: "",

            textChange: "Submitted",
          });

          if (res.status === 201) {
            toast.success(languageData.toast_fmea_created[language]);
          }
        })
        .catch((err) => {
          setFormInput({
            ...formInput,
            userID: currentUser._id,
            date: "",
            startTime: "",
            endTime: "",
            duration: "",
            description: "",
            textChange: "Submit",
          });

          console.log(err);
          toast.error(languageData.toast_something_went_wrong[language]);
        });
    } else {
      toast.error(languageData.toast_fill_in_all_fields[language]);
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.newfmea_new_fmea[language]}</title>
      </Helmet>
      <div className="relative BackgroundImage md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="relative  md:pt-32 pb-32 pt-12">
          <div className="px-2 md:px-10 mx-auto w-full">
            <div>{/* Card stats */}</div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {/* NEW FMEA Form */}
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative overflow-auto h-5/6 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.newfmea_new_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* form */}
                  <div className="py-8  flex justify-center">
                    <form className="w-11/12 max-w-lg" onSubmit={handleSubmit}>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          {/* Date */}
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-date"
                          >
                            {languageData.fmea_model[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-date"
                            type="date"
                            name="date"
                            placeholder=""
                            onChange={handleChange("date")}
                            value={date}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          {/* start time */}

                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-start-time"
                          >
                            {languageData.fmea_project_name[language]}
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-00 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white shadow-lg"
                            id="grid-start-time"
                            type="time"
                            placeholder="16:00"
                            name="startTime"
                            onChange={handleChange("startTime")}
                            value={startTime}
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          {/* Start time */}
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-start-time"
                          >
                            {languageData.fmea_project_number[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-start-time"
                            type="time"
                            name="startTime"
                            placeholder="16:00"
                            onChange={handleChange("endTime")}
                            value={endTime}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                          {/* End time */}
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-duration"
                          >
                            {languageData.fmea_model[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-end-time"
                            type="text"
                            name="duration"
                            placeholder="2h"
                            onChange={handleChange("duration")}
                            value={duration}
                          />
                        </div>
                        <div className="w-full px-3">
                          {/* Duration */}
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-duration"
                          >
                            {languageData.fmea_change_state[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-description"
                            type="text"
                            name="description"
                            placeholder="TWIN"
                            onChange={handleChange("description")}
                            value={description}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          {/* description */}

                          {/* User ID */}
                          <input
                            id="grid-city"
                            type="hidden"
                            name="userID"
                            placeholder="John Doe"
                            value={currentUser._id}
                          />
                        </div>
                      </div>

                      <SubmitButton
                        message={languageData.fmea_submit[language]}
                      />
                    </form>
                  </div>
                  {/* End of Form */}
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <GradingHelp
            type={gradingType}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    </>
  );
};

export default NewSchedule;
