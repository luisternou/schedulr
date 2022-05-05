import React, { useState, useEffect } from "react";
import verdictData from "../config/Verdict.json";
import languageData from "../config/Languages.json";
const Verdict = (props) => {
  const [language, setLanguage] = useState([]);
  const [verdictCategory, setVerdictCategory] = useState([]);
  const getLanguage = () => {
    const lang = localStorage.getItem("language");

    if (lang) {
      return setLanguage(lang);
    }
    setLanguage("en");
  };
  const getVerdictCategory = (rpn) => {
    if (rpn === 1) {
      setVerdictCategory("no_risk");
    }
    if (rpn >= 2 && rpn <= 50) {
      setVerdictCategory("acceptable");
    }
    if (rpn >= 51 && rpn <= 100) {
      setVerdictCategory("medium");
    }
    if (rpn >= 101 && rpn <= 1000) {
      setVerdictCategory("high");
    }
  };
  useEffect(() => {
    getLanguage();
    getVerdictCategory(props.rpn);
  }, [props.rpn]);

  return (
    <>
      {props.show ? (
        <>
          <div className="items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none justify-center focus:outline-none">
            <div className="relative w-4/6 my-6 mx-auto max-w-3xl">
              <div className="relative w-full bg-white border-0 flex flex-col outline-none rounded-lg shadow-lg focus:outline-none">
                <div className="p-5 flex items-start justify-between   border-solid border-black-200 border-b rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {languageData.verdict_verdict[language]}
                  </h3>
                  <button
                    className="p-1 bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold opacity-5 outline-none focus:outline-none"
                    onClick={props.onClose}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none opacity-5 focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="justify-center px-5">
                  <p className="text-xl font-semibold">
                    {languageData.verdict_with_an_rpn_part_one[language]}
                    {props.rpn}
                    {languageData.verdict_with_an_rpn_part_two[language]}
                  </p>
                  <br />
                  <p className="text-xl font-semibold">
                    {languageData.verdict_failure_risk[language]}
                  </p>
                  <p className="text-xl">
                    {verdictData[verdictCategory].risk_of_failure[language]}
                  </p>
                  <p className="text-xl font-semibold">
                    {" "}
                    <br />
                    {languageData.verdict_need_for_action[language]}
                  </p>
                  <p className="text-xl">
                    {verdictData[verdictCategory].need_for_action[language]}
                  </p>
                  <br />
                  <p className="text-xl font-semibold">
                    {languageData.verdict_measures[language]}
                  </p>
                  <p className="text-xl">
                    {verdictData[verdictCategory].measures[language]}
                  </p>
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

export default Verdict;
