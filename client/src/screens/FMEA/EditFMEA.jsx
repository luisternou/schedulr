import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getUserId, getCookie, signout } from "../../helpers/auth";
import { v4 as uuidv4 } from "uuid";
import GradingHelp from "../../Components/GradingHelp";
import { Helmet } from "react-helmet";
import "../../styles/RangeSlider.css";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import SubmitButton from "../../Components/SubmitButton";
import languageData from "../../config/Languages.json";
const EditFMEA = ({ match, history }) => {
  const currentUser = getUserId("user");
  const [showModal, setShowModal] = React.useState(false);
  const [functions, setfunctions] = useState([]);
  const [gradingType, setGradingType] = useState([]);
  const [formInput, setFormInput] = useState([]);
  const [language, setLanguage] = useState([]);
  const [uuid, setUUID] = useState([]);
  const id = match.params.id;
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  useEffect(() => {
    setUUID(uuidv4());
    const loadFMEA = () => {
      const token = getCookie("token");

      axios
        .get(`${process.env.REACT_APP_API_URL}/fmea/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
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
            functions,
          } = res.data;

          setFormInput({
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
          });

          fetch(`${process.env.REACT_APP_API_URL}/fmea/id/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((resp) => resp.json())
            .then((resp) => {
              console.log(resp);
              setfunctions(resp.functions);
            });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === undefined || err.response === undefined) {
            toast.error(languageData.toast_something_went_wrong[language]);
          }
          if (err.response.status === 401) {
            toast.error(languageData.toast_no_permissions_view_fmea[language]);
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
    getLanguage();
  }, [history, id, language]);

  function SetFMEAType() {
    if (fmeaType === "Design-FMEA") {
      return (
        <div className="mt-4">
          <span className="text-gray-700">
            {languageData.fmea_fmea_type[language]}
          </span>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                onChange={handleChange("fmeaType")}
                type="radio"
                className="form-radio"
                name="fmeaType"
                checked="checked"
                value="Design-FMEA"
              />
              <span className="ml-2">
                {languageData.fmea_design_fmea[language]}
              </span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                onChange={handleChange("fmeaType")}
                type="radio"
                className="form-radio"
                name="fmeaType"
                value="Process-FMEA"
              />
              <span className="ml-2">
                {languageData.fmea_process_fmea[language]}
              </span>
            </label>
            <br /> <br />
          </div>
        </div>
      );
    }
    return (
      <div className="mt-4">
        <span className="text-gray-700">
          {languageData.fmea_fmea_type[language]}
        </span>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              onChange={handleChange("fmeaType")}
              type="radio"
              className="form-radio"
              name="fmeaType"
              value="Design-FMEA"
            />
            <span className="ml-2">
              {languageData.fmea_design_fmea[language]}
            </span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              onChange={handleChange("fmeaType")}
              type="radio"
              className="form-radio"
              name="fmeaType"
              checked="checked"
              value="Process-FMEA"
            />
            <span className="ml-2">
              {languageData.fmea_process_fmea[language]}
            </span>
          </label>
          <br /> <br />
        </div>
      </div>
    );
  }

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
      setFormInput({ ...formInput });
      let idempotencyToken = uuid;
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/fmea/update/${id}`,
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
          });

          if (res.status === 200) {
            toast.success(languageData.toast_fmea_update[language]);
          }
          if (res.status === 201) {
            toast.info(languageData.toast_fmea_already_update[language]);
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
            createdByName: "",
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
      <Helmet>
        <title>{languageData.editfmea_edit_fmea[language]}</title>
      </Helmet>
      <ToastContainer />
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

          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative overflow-full h-5/6 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.editfmea_edit_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* form */}
                  <div className="py-10 flex justify-center">
                    <form className="w-11/12 max-w-lg" onSubmit={handleSubmit}>
                      <div className="flex justify-center">
                        <SetFMEAType />
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-00 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                              className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                            className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-zip"
                            type="number"
                            placeholder="1"
                            name="effort"
                            onChange={handleChange("effort")}
                            value={effort}
                          />
                        </div>
                      </div>
                      <br />
                      <h2 className="text-gray-700 font-semibold text-center">
                        {languageData.fmea_functions[language]}
                      </h2>
                      <br />
                      {functions.map((func, i) => {
                        return (
                          <div className="box">
                            <div className="flex flex-wrap -mx-3 mb-6">
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_function[language]}
                                </label>
                                <input
                                  type="text"
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="function"
                                  placeholder="What function is it"
                                  value={func.function}
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
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="failureMode"
                                  placeholder="What is the mode of the failure"
                                  value={func.failureMode}
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
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What effect does the failure have"
                                  name="failureEffect"
                                  value={func.failureEffect}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
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
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="severity"
                                  value={func.severity || 5}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span>{func.severity}</span>
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_cause[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What could be the cause"
                                  name="cause"
                                  value={func.cause}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
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
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="occurrence"
                                  value={func.occurrence}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span>{func.occurrence}</span>
                              </div>

                              <div className="w-full px-3">
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
                                <input
                                  className="RangeSlider"
                                  id="grid-password"
                                  type="range"
                                  min="1"
                                  max="10"
                                  placeholder="What function"
                                  name="detection"
                                  value={func.detection}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br />
                                <br />

                                <span>{func.detection || 5}</span>
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  for="grid-password"
                                >
                                  {languageData.fmea_rpn[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="The RPN"
                                  name="rpn"
                                  value={func.rpn}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>

                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_current_control[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What has been done to control this"
                                  name="currentControl"
                                  value={func.currentControl}
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

export default EditFMEA;
