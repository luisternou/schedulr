//adapted from https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/Dashboard%20Page/react-dashboard-page/src/components/Userdropdown.js
import React, { useState, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signout, getCookie } from "../helpers/auth";
import jwt from "jsonwebtoken";
import languageData from "../config/Languages.json";
const UserDropdown = ({ history }) => {
  const [language, setLanguage] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const [user, setUser] = useState();

  useEffect(() => {
    getLanguage();
    const getUser = () => {
      const userToken = getCookie("token");
      const userTokenDecoded = jwt.decode(userToken);
      const userId = userTokenDecoded._id;
      fetch(`${process.env.REACT_APP_API_URL}/user/id/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUser(res.name);
        })
        .catch((err) => {
          console.log(err);

          try {
            if (
              err.response.status === undefined ||
              err.response === undefined
            ) {
              toast.error(languageData.toast_something_went_wrong[language]);
            }
            if (err.response.status === 401) {
              toast.error(
                languageData.toast_no_permissions_view_page[language]
              );
              signout(() => {
                history.push("/login");
              });
            }
          } catch {
            if (err.response.status === 404) {
              toast.error(languageData.toast_user_not_found[language]);
            }
          }
        });
    };
    getUser();
  }, [history, language]);

  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
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
        <div className="items-center flex">
          <span className="inline-flex items-center justify-center rounded-full w-12 h-12 text-sm text-white bg-black-200">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg focus:outline-none"
              src={`https://ui-avatars.com/api/?name=${user}&background=d0d5db`}
            />
          </span>
        </div>
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
        }
        style={{ minWidth: "12rem" }}
      >
        <p
          className={
            "text-sm py-2 px-4 font-bold block w-full text-center whitespace-nowrap bg-transparent text-black-700"
          }
        >
          {user}
        </p>
        <Link
          to="/profile"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-center bg-transparent text-black-700 justify-center"
          }
        >
          {languageData.userdropdown_edit_profile[language]}
        </Link>

        <div className="h-0 my-2 border border-solid border-black-100" />
        <button
          onClick={() => {
            signout(() => {
              toast.warning(languageData.toast_logged_out[language]);
              try {
                history.push("/login");
              } catch (error) {
                console.log(error);
              }
            });
          }}
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-center bg-transparent text-black-700"
          }
        >
          {languageData.userdropdown_logout[language]}
        </button>
      </div>
    </>
  );
};

export default UserDropdown;
