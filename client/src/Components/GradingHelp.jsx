import React, { useState, useEffect } from "react";
import gradingInfo from "../config/Grading.json";
import languageData from "../config/Languages.json";
const GradingHelp = (props) => {
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
  function selector(category, element, lang) {
    if (category === "severity") {
      return (
        <td className="px-6 py-4 whitespace-nowrap" role="cell">
          {element.severity[lang]}
        </td>
      );
    }
    if (category === "occurrence") {
      return (
        <td className="px-6 py-4 whitespace-nowrap" role="cell">
          {element.occurrence[lang]}
        </td>
      );
    }
    if (category === "detection") {
      return (
        <td className="px-6 py-4 whitespace-nowrap" role="cell">
          {element.detection[lang]}
        </td>
      );
    }
  }

  return (
    <>
      {props.show ? (
        <>
          <div className="flex items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none justify-center focus:outline-none">
            <div className="relative bg-white w-auto my-6 mx-auto max-w-3xl">
              <div className="relative w-full border-0 border-0 flex flex-col outline-none rounded-lg shadow-lg focus:outline-none">
                <div className="flex p-5 items-start border-solid border-black-200 border-b justify-between rounded-t">
                  <h3 className="font-semibold text-3xl">
                    {languageData.gradinghelp_help_with_grading[language]}
                    {languageData[`fmea_${props.type}`][language]}
                  </h3>
                  <button
                    className="border-0 p-1 bg-transparent leading-none text-black float-right text-3xl font-semibold opacity-5 outline-none focus:outline-none"
                    onClick={props.onClose}
                  >
                    <span className="h-6 w-6 bg-transparent text-black text-2xl block outline-none opacity-5 focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative h-64  p-6 flex-auto overflow-y-auto overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {languageData.gradinghelp_rank[language]}
                        </th>
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {languageData.gradinghelp_meaning[language]}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradingInfo.map((grade, index) => {
                        return (
                          <tr key={index}>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              role="cell"
                            >
                              {grade.rank}
                            </td>
                            {selector(props.type, grade, language)}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-solid border-black-200 flex items-center justify-end rounded-b">
                  <button
                    className="text-red-500 hover:text-red-800 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={props.onClose}
                  >
                    {languageData.modal_close[language]}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default GradingHelp;
