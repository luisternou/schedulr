import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import languageData from "../config/Languages.json";
import { Link } from "react-router-dom";

const ShiftCard = (props) => {
  // create a function that calls the citymapper api and returns the data if nextshift is set to true
  const [departure, setDeparture] = useState([]);
  async function getNav(options64) {
    if (departure.routes) {
      return;
    }
    // convert options to base64 uri format
    const options = encodeURI(options64);
    const url = `${process.env.REACT_APP_API_URL}/nav/${options}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDeparture(res);
      });
  }

  if (props.nextShift) {
    console.log("next shift");
    let options = {
      date: props.date,
      shift_time: props.startTime,
    };

    options = JSON.stringify(options);

    options = btoa(options);

    options = encodeURIComponent(options);
    console.log("calling nav", options);
    getNav(options);
  }

  return (
    <div className="w-full  px-4 py-2">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <center>
                <h3 className="text-black-400 uppercase font-bold text-MD">
                  {moment(props.shift.date).format("DD.MM.YYYY")} -{" "}
                  {props.shift.description}
                </h3>
              </center>
              <center>
                <span className="font-semibold text-sm text-black-700">
                  {props.shift.startTime} - {props.shift.endTime}
                </span>
              </center>
              <center>
                <h3 className="font-semibold text-sm text-black-700">
                  {props.shift.duration}{" "}
                  {languageData.shift_card_hours[props.language]}
                </h3>
              </center>
              {/* If props.nextshift is true show a message else not */}
              {props.nextshift ? (
                <center>
                  <a href="https://citymapper.com/directions?endcoord=48.120669%2C16.563048&endname=Flughafen%20Wien">
                    <h3 className="xl:w-5/12 lg:w-5/12 px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-green-100 text-green-800">
                      {
                        // subtract 5 minutes
                        moment(departure)
                          .subtract(5, "minutes")
                          .format("DD.MM.YYYY HH:mm")
                      }
                    </h3>
                  </a>
                </center>
              ) : null}
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <Link to={`/shift/view/${props.shift._id}`}>
                <div
                  className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${props.colour}`}
                >
                  <i className={props.icon}></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShiftCard;
