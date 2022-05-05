//import React from 'react';
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import jwt from "jsonwebtoken";
import { getCookie } from "../../helpers/auth";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import languageData from "../../config/Languages.json";
import Table, {
  AvatarCell,
  SelectColumnFilter,
  StatusPill,
  ActionButtons,
} from "../../Components/Table";
import { Helmet } from "react-helmet";
import Footer from "../../Components/Footer";
const MyFMEA = ({ history, match }) => {
  const [isData, setIsData] = useState([]);
  const [data, setData] = useState([]);
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
    fetch(`${process.env.REACT_APP_API_URL}/fmea/user/${id}`, {
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
          Header: "Projek",
          accessor: "projectName",
          Cell: AvatarCell,
          emailAccessor: "projectNumber",
        },
        {
          Header: "Model",
          accessor: "model",
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: StatusPill,
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          Header: "Moeite",
          accessor: "effort",
        },
        {
          Header: "Skepper",
          accessor: "createdByName",
        },
        {
          Header: "Aksies",
          accessor: "_id",
          Cell: ActionButtons,
        },
      ];
    }
    if (lang === "de") {
      return [
        {
          Header: "Projekt",
          accessor: "projectName",
          Cell: AvatarCell,
          emailAccessor: "projectNumber",
        },
        {
          Header: "Modell",
          accessor: "model",
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: StatusPill,
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          Header: "Aufwand",
          accessor: "effort",
        },
        {
          Header: "Ersteller",
          accessor: "owner",
        },
        {
          Header: "Aktionen",
          accessor: "_id",
          Cell: ActionButtons,
        },
      ];
    } else {
      return [
        {
          Header: "Project",
          accessor: "projectName",
          Cell: AvatarCell,
          emailAccessor: "projectNumber",
        },
        {
          Header: "Model",
          accessor: "model",
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: StatusPill,
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          Header: "Effort",
          accessor: "effort",
        },
        {
          Header: "Role",
          accessor: "owner",
        },
        {
          Header: "Actions",
          accessor: "_id",
          Cell: ActionButtons,
        },
      ];
    }
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <Helmet>
        <title>{languageData.myfmea_my_fmea[language]}</title>
      </Helmet>
      <div className="relative BackgroundImage h-full md:ml-64 bg-gray-100">
        <Navbar />
        {/* Header */}
        <div className="relative md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>{/* Card stats */}</div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap"></div>
          {/* NEW FMEA Form */}
          <div className="flex flex-wrap mt-4">
            <div className="w-full  mb-12 xl:mb-0 px-4">
              <div className="relative overflow-auto h-full px-5 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-black-700 flex justify-center">
                        {languageData.myfmea_my_fmea[language]}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {isData ? (
                    <Table columns={columns} data={data} language={language} />
                  ) : (
                    <div className="justify-center flex">
                      <h3 className="">
                        {languageData.myfmea_no_fmea[language]}
                      </h3>
                    </div>
                  )}
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

export default MyFMEA;
