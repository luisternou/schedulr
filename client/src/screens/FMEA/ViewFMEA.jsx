import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getCookie, signout } from "../../helpers/auth";
import { Link } from "react-router-dom";
import Tooltip from "react-tooltip-lite";
import { Helmet } from "react-helmet";
import GenFMEAPdf from "../../Components/GenFMEAPdf";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Verdict from "../../Components/Verdict";
import languageData from "../../config/Languages.json";
const ViewFMEA = ({ history, match }) => {
  const [functions, setFunctions] = useState([]);
  const [formInput, setFormInput] = useState({
    fmeaType: "",
    projectName: "",
    projectNumber: "",
    model: "",
    changeState: "",
    createdBy: "",
    createdByName: "",
    owner: "",
    effort: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalRPN, setModalRPN] = useState(1);
  const {
    fmeaType,
    projectName,
    projectNumber,
    model,
    changeState,

    createdByName,
    owner,
    effort,
  } = formInput;

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
            improvedFunctions,
          } = res.data;

          setFormInput({
            ...formInput,
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
            improvedFunctions,
          });

          fetch(`${process.env.REACT_APP_API_URL}/fmea/id/${id}`, {
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
  function callModal(rpn) {
    setModalRPN(rpn);
    console.log("RPN = ");
    console.log(modalRPN);
    setShowModal(true);
  }
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
          <div className="flex flex-wrap">
            {/* <LineChart />
            <BarChart /> */}
          </div>
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
                      <div className="mt-4">
                        <center>
                          <span className="text-gray-700">
                            {languageData.fmea_fmea_type[language]}
                          </span>
                          <div className="mt-2">
                            {/* {fmeaTypeString(language, fmeaType)} */}
                            {fmeaType}
                            <br /> <br />
                          </div>
                        </center>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {languageData.fmea_project_name[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {projectName}
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
                            {projectNumber}
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
                            {model}
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
                            {changeState}
                          </p>
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
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {createdByName}
                          </p>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-state"
                          >
                            {languageData.fmea_owner[language]}
                          </label>
                          <div className="relative">
                            <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                              {" "}
                              {owner}
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-zip"
                          >
                            {languageData.fmea_effort[language]}
                          </label>
                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {" "}
                            {effort}
                          </p>
                        </div>
                      </div>
                      <br />
                      <Tooltip
                        content="Click on a function to expand it"
                        direction="right"
                        background="#333"
                        color="#f8f8ff"
                      >
                        <center>
                          <h3>
                            {languageData.fmea_functions[language]}{" "}
                            <i className="fas fa-info-circle"></i>
                          </h3>
                        </center>
                      </Tooltip>
                      <div>
                        {functions.map((func, index) => (
                          <div
                            className="tab w-full overflow-y-auto bg-white border-t"
                            key={index}
                          >
                            <input
                              className="absolute opacity-0 "
                              id={`function${index}`}
                              type="checkbox"
                              name="tabs"
                            />
                            <label
                              className="block p-5 leading-normal cursor-pointer"
                              htmlFor={`function${index}`}
                            >
                              {languageData.fmea_function[language]}
                              {": "}
                              {func.function}{" "}
                              <i className="fas fa-caret-down"></i>
                            </label>
                            <div className="tab-content overflow-y-auto overflow-x-hidden  bg-gray-50 leading-normal">
                              <div className="box" key={index}>
                                <hr />
                                <center>
                                  <h3>
                                    {
                                      languageData.viewfmea_original_state[
                                        language
                                      ]
                                    }
                                  </h3>
                                </center>
                                <br />
                                <div className="flex flex-wrap -mx-3 mb-6">
                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_function[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.function}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_failure_mode[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.failureMode}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {
                                        languageData.fmea_failure_effect[
                                          language
                                        ]
                                      }
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.failureEffect}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_severity[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.severity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_cause[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.cause}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_occurrence[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.occurrence}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.viewfmea_control[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.currentControl}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_detection[language]}
                                    </label>
                                    <div className="relative">
                                      <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        {" "}
                                        {func.detection}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label
                                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                      htmlFor="grid-state"
                                    >
                                      {languageData.fmea_rpn[language]}
                                    </label>
                                    <div className="relative">
                                      <Tooltip
                                        content="Risk Priority Number"
                                        direction="right"
                                        background="#333"
                                        color="#f8f8ff"
                                      >
                                        <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                          {" "}
                                          {func.rpn}
                                        </p>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      callModal(func.rpn);
                                    }}
                                    type="button"
                                    className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-sm focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center"
                                  >
                                    {languageData.viewfmea_assessment[language]}
                                  </button>
                                </div>

                                {/* Improve state */}
                                {func.severity_improved &&
                                func.occurrence_improved &&
                                func.detection_improved &&
                                func.rpn_improved &&
                                func.improvementsMade ? (
                                  <div className="btn-box">
                                    <center>
                                      <h3>
                                        {
                                          languageData.viewfmea_improved_state[
                                            language
                                          ]
                                        }
                                      </h3>
                                    </center>
                                    <br />
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {languageData.fmea_function[language]}
                                        </label>
                                        <div className="relative">
                                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                            {" "}
                                            {func.function}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {languageData.fmea_severity[language]}
                                        </label>
                                        <div className="relative">
                                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                            {" "}
                                            {func.severity_improved}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {
                                            languageData.fmea_occurrence[
                                              language
                                            ]
                                          }
                                        </label>
                                        <div className="relative">
                                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                            {" "}
                                            {func.occurrence_improved}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {
                                            languageData.fmea_detection[
                                              language
                                            ]
                                          }
                                        </label>
                                        <div className="relative">
                                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                            {" "}
                                            {func.detection_improved}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {
                                            languageData.viewfmea_improvments[
                                              language
                                            ]
                                          }
                                        </label>
                                        <div className="relative">
                                          <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                            {" "}
                                            {func.improvementsMade}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label
                                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                          htmlFor="grid-state"
                                        >
                                          {languageData.fmea_rpn[language]}
                                        </label>
                                        <div className="relative">
                                          <Tooltip
                                            content="Risk Priority Number"
                                            direction="right"
                                            background="#333"
                                            color="#f8f8ff"
                                          >
                                            <p className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                              {" "}
                                              {func.rpn_improved}
                                            </p>
                                          </Tooltip>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          callModal(func.rpn_improved);
                                        }}
                                        type="button"
                                        className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-sm focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center"
                                      >
                                        {
                                          languageData.viewfmea_assessment[
                                            language
                                          ]
                                        }
                                      </button>
                                    </div>
                                  </div>
                                ) : null}
                                {/* improve state */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Link
                        to={`/fmea/edit/${id}`}
                        className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-sm focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center"
                      >
                        <i className="fas fa-edit fa 1x w-6  -ml-2" />
                        <span className="ml-3">
                          {languageData.viewfmea_edit_fmea[language]}
                        </span>
                      </Link>

                      <Link
                        to={`/fmea/improve/${id}`}
                        className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-sm focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center"
                      >
                        <i className="fas fa-clipboard-list fa 1x w-6  -ml-2" />
                        <span className="ml-3">
                          {languageData.viewfmea_add_improvements[language]}
                        </span>
                      </Link>
                      <GenFMEAPdf pdfLanguage={language} data={formInput} />
                    </div>
                  </div>
                  {/* End of Form */}
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <Verdict
            rpn={modalRPN}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    </>
  );
};

export default ViewFMEA;
