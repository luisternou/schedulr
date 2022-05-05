import React from "react";

const HomeCard = (props) => {
  return (
    <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-black-400 uppercase font-bold text-xs">
                {props.message}
              </h5>
              <span className="font-semibold text-xl text-black-700">
                {props.stat || 0}
              </span>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div
                className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${props.colour}`}
              >
                <i className={props.icon}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeCard;
