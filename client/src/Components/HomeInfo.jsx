import React from "react";

const HomeInfo = (props) => {
  return (
    <>
      <div className="w-full xl:w-4/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl overflow-auto h-4/6">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-black-700">
                  {props.languageData.homepage_welcome_to_name[props.language]}
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto p-3">
            <p>
              {" "}
              {
                props.languageData.homepage_welcome_explanation_part_one[
                  props.language
                ]
              }
              {
                props.languageData.homepage_welcome_explanation_part_two[
                  props.language
                ]
              }
              <br /> <br />
              {props.languageData.homepage_welcome_how_to_use[props.language]}
            </p>
            <br />
            <ul className="list-disc">
              <li>
                {props.languageData.homepage_welcome_new_fmea[props.language]}
                <a
                  className="text-blue-700 hover:text-blue-900"
                  href="/fmea/new"
                >
                  {
                    props.languageData.homepage_welcome_new_fmea_link[
                      props.language
                    ]
                  }
                </a>
              </li>
              <br />
              <li>
                {
                  props.languageData.homepage_welcome_new_fmea_submit[
                    props.language
                  ]
                }
              </li>
              <br />
              <li>
                {
                  props.languageData.homepage_welcome_view_all_part_one[
                    props.language
                  ]
                }
                <a
                  className="text-blue-700 hover:text-blue-900"
                  href="/fmea/my"
                >
                  {
                    props.languageData.homepage_welcome_my_fmea_link[
                      props.language
                    ]
                  }
                </a>{" "}
                {
                  props.languageData.homepage_welcome_view_all_part_two[
                    props.language
                  ]
                }
              </li>
              <br />
              <li>
                {
                  props.languageData.homepage_welcome_improve_part_one[
                    props.language
                  ]
                }
                <a
                  className="text-blue-700 hover:text-blue-900"
                  href="/fmea/my"
                >
                  {
                    props.languageData.homepage_welcome_my_fmea_link[
                      props.language
                    ]
                  }{" "}
                </a>{" "}
                {
                  props.languageData.homepage_welcome_improve_part_two[
                    props.language
                  ]
                }
              </li>
              <br />
              <li>
                {props.languageData.homepage_welcome_status[props.language]}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeInfo;
