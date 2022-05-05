import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getUserId, getCookie, signout } from "../../helpers/auth";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import { Helmet } from "react-helmet";
import GradingHelp from "../../Components/GradingHelp";
import SubmitButton from "../../Components/SubmitButton";
import languageData from "../../config/Languages.json";
import "../../styles/RangeSlider.css";
import "../../styles/index.css";
const ImproveFMEA = ({ match, history }) => {
  const currentUser = getUserId("user");
  const [showModal, setShowModal] = useState(false);
  const [functions, setfunctions] = useState([]);
  const [improvedFunctions, setimprovedFunctions] = useState([]);
  const [gradingType, setGradingType] = useState();
  const [language, setLanguage] = useState([]);
  const [formInput, setFormInput] = useState([]);
  const [uuid, setUUID] = useState([]);

  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const id = match.params.id;
  useEffect(() => {
    setUUID(uuidv4());
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
  }, [history, id, language]);

  const { fmeaType, projectName, model } = formInput;

  const handleSubmit = (e) => {
    e.preventDefault();
    const authtoken = getCookie("token");
    if (fmeaType && projectName && model) {
      setFormInput({ ...formInput });
      let idempotencyToken = uuid;
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/fmea/improve/${id}`,
          {
            idempotencyToken,
            improvedFunctions,
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

          toast.success(languageData.toast_fmea_update[language]);
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
            owner: "",
            effort: "",
            functions: "",
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
    let severity_improved = [];
    let occurrence_improved = [];
    let detection_improved = [];
    let rpn_improved = [];

    if (list[index].severity_improved === undefined) {
      severity_improved[index] = parseInt(5);
    } else {
      severity_improved[index] = parseInt(list[index].severity_improved);
    }
    if (list[index].occurrence_improved === undefined) {
      occurrence_improved[index] = parseInt(5);
    } else {
      occurrence_improved[index] = parseInt(list[index].occurrence_improved);
    }
    if (list[index].detection_improved === undefined) {
      detection_improved[index] = parseInt(5);
    } else {
      detection_improved[index] = parseInt(list[index].detection_improved);
    }

    rpn_improved[index] =
      severity_improved[index] *
      occurrence_improved[index] *
      detection_improved[index];
    list[index][name] = value;
    list[index].rpn_improved = rpn_improved[index];
    list[index].severity = undefined;
    list[index].occurrence = undefined;
    list[index].detection = undefined;
    list[index].rpn = undefined;
    setimprovedFunctions(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...functions];
    list.splice(index, 1);
    setfunctions(list);
  };

  return (
    <>
      <Sidebar />
      <Helmet>
        <title>{languageData.improvefmea_improve_fmea[language]}</title>
      </Helmet>
      <ToastContainer />
      <div className="relative BackgroundImage md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="relative top-0 md:pt-32 pb-32 pt-12">
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
              <div className="relative h-5/6 overflow-auto flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className=" overflow-x-auto relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.improvefmea_improve_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* form */}
                  <div className="py-10 flex justify-center">
                    <form className="w-11/12 max-w-lg" onSubmit={handleSubmit}>
                      <br />
                      <br />
                      {functions.map((func, i) => {
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
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="function"
                                  placeholder="What function is it"
                                  value={func.function}
                                  readOnly={true}
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
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="failureMode"
                                  placeholder="What is the mode of the failure"
                                  value={func.failureMode}
                                  readOnly={true}
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
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What effect does the failure have"
                                  name="failureEffect"
                                  value={func.failureEffect}
                                  readOnly={true}
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
                                  name="severity_improved"
                                  value={func.severity_improved}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span>{func.severity_improved || 5}</span>
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_cause[language]}
                                </label>
                                <input
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                                  name="occurrence_improved"
                                  value={func.occurrence_improved}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br /> <br />
                                <span>{func.occurrence_improved || 5}</span>
                              </div>

                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_current_control[language]}
                                </label>
                                <input
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  placeholder="What has been done to control this"
                                  name="currentControl"
                                  value={func.currentControl}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
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
                                  value={func.detection_improved}
                                  placeholder="What function"
                                  name="detection_improved"
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                                <br />
                                <br />
                                <span>{func.detection_improved || 5}</span>
                              </div>
                              <div className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {
                                    languageData.improvefmea_improvements_made[
                                      language
                                    ]
                                  }
                                </label>
                                <input
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  required={true}
                                  placeholder="What could be the cause"
                                  name="improvementsMade"
                                  value={func.improvementsMade}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>
                              <dhiv className="w-full px-3">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  {languageData.fmea_rpn[language]}
                                </label>
                                <input
                                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-password"
                                  type="text"
                                  required={true}
                                  placeholder="The RPN"
                                  name="rpn"
                                  readOnly={true}
                                  value={func.rpn_improved}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </dhiv>
                            </div>
                            <div className="btn-box">
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

export default ImproveFMEA;
