import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getCookie } from "../../helpers/auth";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Table, {
  AvatarCell,
  SelectColumnFilter,
  RolePill,
  ActionButtonsUser,
} from "../../Components/Table";
import jwt from "jsonwebtoken";
import { Helmet } from "react-helmet";
import Footer from "../../Components/Footer";
import languageData from "../../config/Languages.json";

const SuperAdmin = ({ history, match }) => {
  const [data, setData] = useState([]);
  const [currentUser, setcurrentUser] = useState([]);
  const [isData, setIsData] = useState([]);
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
    const token = getCookie("token");
    let id = jwt.decode(token);
    id = id._id;
    setcurrentUser(id);
    fetch(`${process.env.REACT_APP_API_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.length > 0) {
          setIsData(true);
        } else {
          setIsData(false);
        }
        setData(resp);
      });
  }, []);

  const columns = React.useMemo(() => {
    let lang = localStorage.getItem("language");
    if (lang === "af") {
      return [
        {
          Header: "Naam",
          accessor: "name",
          Cell: AvatarCell,
          emailAccessor: "email",
        },
        {
          Header: "Rol",
          accessor: "role",
          Filter: SelectColumnFilter,
          filter: "equals",
          Cell: RolePill,
        },
        {
          Header: "Aksies",
          accessor: "_id",
          Cell: ActionButtonsUser,
        },
      ];
    }
    if (lang === "de") {
      return [
        {
          Header: "Name",
          accessor: "name",
          Cell: AvatarCell,
          emailAccessor: "email",
        },
        {
          Header: "Rolle",
          accessor: "role",
          Filter: SelectColumnFilter,
          filter: "equals",
          Cell: RolePill,
        },
        {
          Header: "Aktionen",
          accessor: "_id",
          Cell: ActionButtonsUser,
        },
      ];
    } else {
      return [
        {
          Header: "Name",
          accessor: "name",
          Cell: AvatarCell,
          emailAccessor: "email",
        },
        {
          Header: "Role",
          accessor: "role",
          Filter: SelectColumnFilter,
          filter: "equals",
          Cell: RolePill,
        },
        {
          Header: "Actions",
          accessor: "_id",
          Cell: ActionButtonsUser,
        },
      ];
    }
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.superadmin_super_admin[language]}</title>
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
          <div className="flex flex-wrap"></div>

          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative overflow-auto h-full flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-3xl rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.search_field_placeholder[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="px-5 block w-full overflow-x-auto">
                  {isData ? (
                    <Table columns={columns} data={data} user={currentUser} />
                  ) : (
                    <div className="justify-center flex">
                      <h3>{languageData.superadmin_no_users[language]}</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* rigt table */}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SuperAdmin;
