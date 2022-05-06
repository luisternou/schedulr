import React, { useState } from "react";

import axios from "axios";

const ShiftCard = (props) => {
  const [departure, setDeparture] = useState([]);

  // create a function that calls the citymapper api and returns the data if nextshift is set to true
  const getNextShift = () => {
    // use props.date to get the date
    // use props.starttime to get the start time and create a datetime string

    // get the date in the format of YYYY-MM-DD
    let date = props.date;
    // convert date to string
    date = date.toString();
    // let date_array = date.split("-");

    // let dateString =
    //   date_array[2] +
    //   "-" +
    //   date_array[1] +
    //   "-" +
    //   date_array[0] +
    //   "T" +
    //   props.starttime +
    //   ":00";
    let dateString = date + "T" + props.startTime + ":00";
    let timezone = undefined;
    // use http://worldtimeapi.org/api/timezone/Europe/Vienna to get the timezone
    axios
      .get(`http://worldtimeapi.org/api/timezone/Europe/Vienna`)
      .then((resp) => {
        // use the timezone to get the time difference
        let dst = resp.data.dst;
        if (dst === true) {
          timezone = "+02:00";
        } else {
          timezone = "+01:00";
        }

        let url = `https://api.external.citymapper.com/api/1/directions/transit?start=48.211890,16.412290&end=48.120669,16.563048&time_type=arrive&time=${dateString}${timezone}`;
        console.log(url);
        if (props.nextshift) {
          fetch(url, {
            headers: {
              "Citymapper-Partner-Key":
                process.env.REACT_APP_CITYMAPPER_API_KEY,
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      });
  };

  if (props.nextshift) {
    getNextShift();
  }

  return (
    <div className="w-full  px-4">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <center>
                <h3 className="text-black-400 uppercase font-bold text-MD">
                  {/* {props.message} */} DATE - DESCRIPTION
                </h3>
              </center>
              <center>
                <span className="font-semibold text-sm text-black-700">
                  {/* {props.stat || 0} */} STARTTIME - ENDTIME
                </span>
              </center>
              <center>
                <h3 className="font-semibold text-sm text-black-700">
                  {/* {props.stat || 0} */} DURATION
                </h3>
              </center>
              {/* If props.nextshift is true show a message else not */}
              {props.nextshift ? (
                <center>
                  <h3 className="xl:w-5/12 lg:w-5/12 px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-green-100 text-green-800">
                    {/* {props.stat || 0} */} Departure time suggestion
                  </h3>
                </center>
              ) : null}
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
export default ShiftCard;
