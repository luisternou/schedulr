//addapted from https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/Dashboard%20Page/react-dashboard-page/src/components/Navbar.js
import React, { useState, useEffect } from "react";
import LanguageDropdown from "./LanguageDropdown";
import UserDropdown from "./UserDropdown";
import { withRouter } from "react-router-dom";
import languageData from "../config/Languages.json";
function Navbar({ history }) {
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
  return (
    <>
      <nav className="absolute flex items-center p-4 top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start">
        <div className="px-4 w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10">
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="/"
          >
            <img src="/icons/icon-512x512.png" alt="" className="w-20 h-20" />
          </a>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"
          >
            <div className="p-4">
              <div className="bg-white flex items-center rounded-full shadow-xl">
                <input
                  className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                  id="search_navbar"
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

          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <div className="mr-3">
              <LanguageDropdown />
            </div>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}
export default withRouter(Navbar);
