//https://github.com/creativetimofficial/tailwind-starter-kit/tree/main/Dashboard%20Page/react-dashboard-page
import React, { useState, useEffect, createRef } from "react";
import { createPopper } from "@popperjs/core";
import languageData from "../config/Languages.json";
const LanguageDropdown = ({ history }) => {
  function setLanguageLocalStorage(language) {
    localStorage.setItem("language", language);
    window.location.reload(false);
  }

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

  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef();
  const popoverDropdownRef = createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <button
        className="text-black-500 block"
        ref={btnDropdownRef}
        onClick={(e) => {
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="bg-gray-300 items-center shadow-lg flex rounded-full">
          <span className="w-12 h-12 text-sm text-black bg-black-200 inline-flex items-center justify-center rounded-full">
            <i className="fas fa-globe-africa"></i>
          </span>
        </div>
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "py-2 list-none text-left bg-white text-base z-50 float-left rounded shadow-lg mt-1"
        }
        style={{ minWidth: "12rem" }}
      >
        <p
          className={
            "py-2 px-4 block w-full whitespace-nowrap text-center text-sm font-bold bg-transparent text-black-700"
          }
        >
          {languageData.languagedropdown_language[language]}
        </p>
        <button
          onClick={() => {
            setLanguageLocalStorage("af");
          }}
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-center bg-transparent text-black-700"
          }
        >
          Afrikaans
        </button>
        <button
          onClick={() => {
            setLanguageLocalStorage("de");
          }}
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-center bg-transparent text-black-700"
          }
        >
          Deutsch
        </button>

        <button
          href="#"
          onClick={() => {
            setLanguageLocalStorage("en");
          }}
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-black-700"
          }
        >
          English
        </button>
      </div>
    </>
  );
};

export default LanguageDropdown;
