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
