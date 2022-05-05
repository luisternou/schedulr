//addapted from https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/Dashboard%20Page/react-dashboard-page/src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import linkData from "../config//NavBar.json";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";
import jwt from "jsonwebtoken";
import { getCookie } from "../helpers/auth";
import { withRouter } from "react-router-dom";
import languageData from "../config/Languages.json";
function Sidebar({ history }) {
  let links = null;
  const [query, setQuery] = useState([]);
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
  }, []);
  const handleSubmit = (e) => {
    let search_params = {};
    search_params.projectName = query;
    search_params.projectNumber = query;
    search_params.simple = true;
    search_params.admin = false;
    search_params.join = "or";
    let search_string = encodeURIComponent(btoa(JSON.stringify(search_params)));

    history.push(`/result/${search_string}`);
  };

  const handleChange = (text) => (e) => {
    setQuery(e.target.value);
  };
  try {
    const token = getCookie("token");
    const user_role = jwt.decode(token).role;
    if (user_role === "user") {
      links = linkData.filter((link) => link.role === "user");
    } else if (user_role === "admin") {
      links = linkData.filter(
        (link) => link.role === "user" || link.role === "admin"
      );
    } else {
      links = linkData.filter(
        (link) =>
          link.role === "user" ||
          link.role === "admin" ||
          link.role === "superadmin"
      );
    }
  } catch (error) {
    links = linkData.filter((link) => link.role === "user");
  }

  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between relative z-10 py-4 px-6 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white md:w-64">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-black-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            ViLix FMEA Suite
          </Link>

          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="mr-3 inline-block relative">
              <LanguageDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-black-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-gray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Vilix FMEA Suite
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
     
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="mt-6 mb-4 md:hidden"
            >
              <div className="p-4">
                <div className="bg-white flex items-center rounded-full shadow-xl">
                  <input
                    className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                    id="search_sidebar"
                    type="text"
                    name="query"
                    onChange={handleChange("query")}
                    placeholder={languageData.navbar_search[language]}
                  />
                  <div className="p-4">
                    <button
                      type="submit"
                      className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-500 focus:outline-none w-8 h-8 flex items-center justify-center"
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {links.map((link, i) => {
                return (
                  <li className="items-center" key={i}>
                    <Link
                      className="text-gray-600 hover:text-gray-900 text-xs uppercase py-3 font-bold block"
                      to={link.link}
                    >
                      <i className={link.icon}></i> {link[language]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
}

export default withRouter(Sidebar);
