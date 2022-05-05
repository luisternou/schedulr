import React from "react";

const SubmitButton = (props) => {
  return (
    <>
      <button
        type="submit"
        className="w-full py-3 mt-10 bg-gray-800 font-medium text-white uppercase rounded-lg shadow-md lg:shadow-lg 
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
      >
        {props.message}
      </button>
    </>
  );
};

export default SubmitButton;
