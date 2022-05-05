import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getCookie } from "../helpers/auth";
import { Helmet } from "react-helmet";
import Tooltip from "react-tooltip-lite";
import jwt from "jsonwebtoken";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import SelectData from "../config/SearchCriteria.json";
import languageData from "../config/Languages.json";
import "../styles/RangeSlider.css";
import "../styles/Forms.css";
const Search = ({ history }) => {
  const [searchParams, setSearchParams] = useState([]);
  const [functions, setfunctions] = useState([{ field: "", value: "" }]);
  const [join, setJoin] = useState("and");
  const [admin, setAdmin] = useState(false);
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };

  // set the language
  useEffect(() => {
    getLanguage();
  }, []);
  // check if user can search with admin rights
  let allowAdminSearch = false;
  let token = getCookie("token");

  let role = jwt.decode(token).role;

  if (role === "admin" || role === "superadmin") {
    allowAdminSearch = true;
  }

  // deal with the change of global join
  const handleJoinChange = (text) => (e) => {
    setJoin(e.target.value);
  };

  // handle toggle of admin rights
  const handleAdminChange = (text) => (e) => {
    setAdmin(e.target.checked);
  };

  // when form is submitted
  const handleSubmit = (e) => {
    let search_string = encodeURIComponent(btoa(JSON.stringify(searchParams)));
    history.push(`/result/${search_string}`);
  };

  // handle if the input is changed
  const handleInputChange = (e, index) => {
    let search_params = {};
    const { name, value } = e.target;
    const list = [...functions];

    list[index][name] = value;
    search_params.join = join;
    search_params.admin = admin;
    search_params.criteria = list;
    setfunctions(list);
    setSearchParams(search_params);
  };

  // handle add a search criteria
  const handleAddClick = () => {
    setfunctions([...functions, { field: "", value: "" }]);
  };

  // handle remove a search criteria
  const handleRemoveClick = (index) => {
    const list = [...functions];
    list.splice(index, 1);
    let search_params = {};
    search_params.join = join;
    if (!search_params.admin) {
      search_params.admin = false;
    } else {
      search_params.admin = admin;
    }
    search_params.criteria = list;
    setfunctions(list);
    setSearchParams(search_params);
  };

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.search_search_fmea[language]}</title>
      </Helmet>
      <div className="relative BackgroundImage md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="relative  md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full"></div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {/* Outer box  */}
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative overflow-auto h-5/6 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.search_search_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* search form */}
                  <div className="py-10 flex justify-center">
                    <form className="w-11/12 max-w-lg" onSubmit={handleSubmit}>
                      <div className="w-full px-3">
                        <div>
                          {/* display search as admin only if user is an admin */}
                          {allowAdminSearch ? (
                            <label className="inline-flex items-center ml-6">
                              <input
                                onChange={handleAdminChange("admin")}
                                type="checkbox"
                                className="form-checkbox text-black w-5 h-5"
                                name="admin"
                              />
                              <Tooltip
                                content="If you search as an admin you can search all FMEAs otherwise only the FMEAs you submitted"
                                direction="right"
                                background="#333"
                                color="#f8f8ff"
                              >
                                <span className="ml-2">
                                  {languageData.search_admin_search[language]}{" "}
                                  <i className="fas fa-question-circle"></i>
                                </span>
                              </Tooltip>
                            </label>
                          ) : null}
                        </div>
                        {/* Global join */}
                        <Tooltip
                          content="For example: Project number = Foo AND Model = Bar | Project number = Foo OR Model = Bar "
                          direction="right"
                          background="#333"
                          color="#f8f8ff"
                        >
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            {languageData.search_global_join[language]}{" "}
                            <i className="fas fa-question-circle"></i>
                          </label>
                        </Tooltip>
                        <select
                          name="join"
                          id="join"
                          onChange={handleJoinChange("join")}
                          className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value="and">
                            {languageData.search_join_and[language]}
                          </option>
                          <option value="or">
                            {languageData.search_join_or[language]}
                          </option>
                        </select>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6"></div>
                      {/* display search criterias */}
                      {functions.map((x, i) => {
                        return (
                          <div className="box" key={i}>
                            <div className="flex flex-wrap -mx-3 mb-2">
                              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="field"
                                >
                                  {languageData.search_field[language]}
                                </label>
                                <select
                                  name="field"
                                  id="field"
                                  onChange={(e) => handleInputChange(e, i)}
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                >
                                  <option>
                                    {
                                      languageData.search_field_placeholder[
                                        language
                                      ]
                                    }
                                  </option>
                                  {SelectData.map((item, index) => {
                                    return (
                                      <option key={index} value={item.value}>
                                        {item[language]}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>

                              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="field"
                                >
                                  {languageData.search_value[language]}
                                </label>
                                <input
                                  className="shadow-lg appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="field"
                                  type="text"
                                  required
                                  placeholder={
                                    languageData.search_value_placeholder[
                                      language
                                    ]
                                  }
                                  name="value"
                                  value={x.value}
                                  onChange={(e) => handleInputChange(e, i)}
                                />
                              </div>
                            </div>

                            {/* Add/remove search criterias */}
                            <div className="btn-box">
                              {functions.length - 1 === i && (
                                <button onClick={handleAddClick}>
                                  {languageData.search_add_criteria[language]}
                                </button>
                              )}
                              <br />
                              {functions.length !== 1 && (
                                <button
                                  className="mr10"
                                  onClick={() => handleRemoveClick(i)}
                                >
                                  {
                                    languageData.search_remove_criteria[
                                      language
                                    ]
                                  }{" "}
                                </button>
                              )}
                              <br />
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="submit"
                        className="rounded-lg shadow-md lg:shadow-lg w-full py-3 mt-10 bg-gray-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
                      >
                        <i className="fas fa-clipboard-list fa 1x w-6  -ml-2" />
                        <span className="ml-3">
                          {languageData.search_submit[language]}
                        </span>
                      </button>
                    </form>
                  </div>
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

export default Search;
