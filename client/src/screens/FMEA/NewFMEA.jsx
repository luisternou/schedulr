import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getUserId, getCookie } from "../../helpers/auth";
import { v4 as uuidv4 } from "uuid";
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

const NewFMEA = (props) => {
  const currentUser = getUserId("user");
  const [showModal, setShowModal] = React.useState(false);
  const [gradingType, setGradingType] = useState([]);
  const [language, setLanguage] = useState([]);
  const [uuid, setUUID] = useState([]);
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
    setUUID(uuidv4());
    getLanguage();
  }, []);

  const [formInput, setFormInput] = useState({
    fmeaType: "",
    projectName: "",
    projectNumber: "",
    model: "",
    changeState: "",
    createdBy: currentUser._id,
    createdByName: currentUser.name,
    owner: "",
    effort: "",
    textChange: "Submit",
  });

  const {
    fmeaType,
    projectName,
    projectNumber,
    model,
    changeState,
    createdBy,
    createdByName,
    owner,
    effort,
  } = formInput;
  const handleChange = (text) => (e) => {
    setFormInput({ ...formInput, [text]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const authtoken = getCookie("token");
    if (fmeaType && projectName && model) {
      setFormInput({ ...formInput, textChange: "Submitting" });
      let idempotencyToken = uuid;
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/fmea/new`,
          {
            fmeaType,
            projectName,
            projectNumber,
            model,
            changeState,
            createdBy,
            createdByName,
            owner,
            effort,
            functions,
            idempotencyToken,
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
            name: "",
            email: "",
            employeeNumber: "",
            password1: "",
            password2: "",
            textChange: "Submitted",
          });

          if (res.status === 200) {
            toast.success(languageData.toast_fmea_created[language]);
          } else if (res.status === 201) {
            toast.info(languageData.toast_fmea_already_created[language]);
          }
        })
        .catch((err) => {
          setFormInput({
            ...formInput,
            fmeaType: "",
            projectName: "",
            projectNumber: "",
            model: "",
            changeState: "",
            createdBy: currentUser._id,
            createdByName: currentUser.name,
            owner: "",
            effort: "",
            functions: "",
            textChange: "Submit",
          });

          console.log(err);
          toast.error(languageData.toast_something_went_wrong[language]);
        });
    } else {
      toast.error(languageData.toast_fill_in_all_fields[language]);
    }
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...functions];
    let severity = [];
    let occurrence = [];
    let detection = [];
    let rpn = [];
    if (list[index].severity === undefined) {
      severity[index] = parseInt(5);
    } else {
      severity[index] = parseInt(list[index].severity);
    }
    if (list[index].occurrence === undefined) {
      occurrence[index] = parseInt(5);
    } else {
      occurrence[index] = parseInt(list[index].occurrence);
    }
    if (list[index].detection === undefined) {
      detection[index] = parseInt(5);
    } else {
      detection[index] = parseInt(list[index].detection);
    }
    console.log(
      "RPN " +
        severity[index] +
        " " +
        occurrence[index] +
        " " +
        detection[index]
    );
    rpn[index] = severity[index] * occurrence[index] * detection[index];
    list[index][name] = value;
    list[index].rpn = rpn[index];
    setfunctions(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...functions];
    list.splice(index, 1);
    setfunctions(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setfunctions([...functions, { function: "", failureMode: "" }]);
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
                      <div className="mt-4">
                        <span className="text-gray-700 flex justify-center">
                          {languageData.fmea_fmea_type[language]}{" "}
                        </span>
                        <div className="mt-2 flex justify-center">
                          <label className="inline-flex items-center">
                            <input
                              onChange={handleChange("fmeaType")}
                              type="radio"
                              className="form-radio w-5 h-5 "
                              name="fmeaType"
                              value="Design-FMEA"
                            />
                            <span className="ml-2">
                              {" "}
                              {languageData.fmea_design_fmea[language]}
                            </span>
                          </label>
                          <label className="inline-flex items-center ml-6">
                            <input
                              onChange={handleChange("fmeaType")}
                              type="radio"
                              className="form-radio w-5 h-5"
                              name="fmeaType"
                              value="Process-FMEA"
                            />
                            <span className="ml-2">
                              {" "}
                              {languageData.fmea_process_fmea[language]}
                            </span>
                          </label>
                          <br /> <br />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {languageData.fmea_project_name[language]}
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-00 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white shadow-lg"
                            id="grid-first-name"
                            type="text"
                            placeholder="Car"
                            name="projectName"
                            onChange={handleChange("projectName")}
                            value={projectName}
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-last-name"
                          >
                            {languageData.fmea_project_number[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-last-name"
                            type="text"
                            name="projectNumber"
                            placeholder="4823"
                            onChange={handleChange("projectNumber")}
                            value={projectNumber}
                          />
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
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-password"
                            type="text"
                            name="model"
                            placeholder="X872DA"
                            onChange={handleChange("model")}
                            value={model}
                          />
                        </div>
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            {languageData.fmea_change_state[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-password"
                            type="text"
                            name="changeState"
                            placeholder="No idea"
                            onChange={handleChange("changeState")}
                            value={changeState}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-city"
                          >
                            {languageData.fmea_created_by[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-city"
                            type="text"
                            name="createdByName"
                            placeholder="John Doe"
                            onChange={handleChange("createdByName")}
                            value={createdByName}
                            readOnly={true}
                          />
                          <input
                            id="grid-city"
                            type="hidden"
                            name="createdBy"
                            placeholder="John Doe"
                            onChange={handleChange("createdBy")}
                            value={createdBy}
                          />
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-state"
                          >
                            {languageData.fmea_owner[language]}
                          </label>
                          <div className="relative">
                            <input
                              className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="grid-city"
                              type="text"
                              name="owner"
                              placeholder="Jane Doe"
                              onChange={handleChange("owner")}
                              value={owner}
                            />
                          </div>
                        </div>

                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-zip"
                          >
                            {languageData.fmea_effort[language]}
                          </label>
                          <input
                            className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-zip"
                            type="number"
                            placeholder="1"
                            name="effort"
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            onChange={handleChange("effort")}
                            value={effort}
                          />
                        </div>
                      </div>

                      <br />

                      <h2 className="text-gray-700 font-semibold text-center">
                        {" "}
                        {languageData.fmea_functions[language]}
                      </h2>

                      <br />
                      {functions.map((x, i) => {
                        return (
                          <div className="box" key={i}>
                            <div className="flex flex-wrap -mx-3 mb-6">
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_function[language]} {i + 1}
                                </label>
                                <input
                                  type="text"
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="function"
                                  placeholder="What function is it"
                                  value={x.function}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_failure_mode[language]}
                                </label>
                                <input
                                  type="text"
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="failureMode"
                                  placeholder="What is the mode of the failure"
                                  value={x.failureMode}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_failure_effect[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What effect does the failure have"
                                  name="failureEffect"
                                  value={x.failureEffect}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
                                <Tooltip
                                  content="How severe is it if the risk.error occurrs"
                                  direction="right"
                                  background="#333"
                                  color="#f8f8ff"
                                >
                                  <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                  >
                                    {languageData.fmea_severity[language]}
                                    <button
                                      onClick={() => {
                                        setShowModal(true);
                                        setGradingType("severity");
                                      }}
                                      type="button"
                                      className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200"
                                    >
                                      <i className="fas fa-info-circle"></i>
                                    </button>
                                  </label>
                                </Tooltip>
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="severity"
                                  value={x.severity || 5}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span className="py-2">
                                  {functions[i].severity || 5}
                                </span>
                                <br /> <br />
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_cause[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What could be the cause"
                                  name="cause"
                                  value={x.cause}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
                                <Tooltip
                                  content="How likely is it that the risk/error occurrs"
                                  direction="right"
                                  background="#333"
                                  color="#f8f8ff"
                                >
                                  <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                  >
                                    {languageData.fmea_occurrence[language]}
                                    <button
                                      onClick={() => {
                                        setShowModal(true);
                                        setGradingType("occurrence");
                                      }}
                                      type="button"
                                      className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200"
                                    >
                                      <i className="fas fa-info-circle"></i>
                                    </button>
                                  </label>
                                </Tooltip>
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="occurrence"
                                  value={x.occurrence || 5}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span className="py-2">
                                  {functions[i].occurrence || 5}
                                </span>
                              </div>

                              <div className="w-full px-3">
                                <Tooltip
                                  content="Probability of noticing the risk/error"
                                  direction="right"
                                  background="#333"
                                  color="#f8f8ff"
                                >
                                  <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                  >
                                    {languageData.fmea_detection[language]}
                                    <button
                                      onClick={() => {
                                        setShowModal(true);
                                        setGradingType("detection");
                                      }}
                                      type="button"
                                      className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200"
                                    >
                                      <i className="fas fa-info-circle"></i>
                                    </button>
                                  </label>
                                </Tooltip>
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="detection"
                                  value={x.detection || 5}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span className="py-2">
                                  {functions[i].detection || 5}
                                </span>
                                <br /> <br />
                              </div>
                              <div className="w-full px-3 pt-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_current_control[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  required
                                  placeholder="What has been done to control this"
                                  name="currentControl"
                                  value={x.currentControl}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_rpn[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="The RPN"
                                  name="rpn"
                                  value={x.rpn || 1}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>
                            </div>

                            <div className="btn-box">
                              {functions.length - 1 === i && (
                                <button onClick={handleAddClick}>
                                  {languageData.fmea_add_function[language]}
                                </button>
                              )}
                              <br />
                              {functions.length !== 1 && (
                                <button
                                  className="mr10"
                                  onClick={() => handleRemoveClick(i)}
                                >
                                  {languageData.fmea_remove_function[language]}{" "}
                                </button>
                              )}
                              <br />
                            </div>
                          </div>
                        );
                      })}
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

export default NewFMEA;
