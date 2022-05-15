const fetch = require("node-fetch");

exports.getNavController = async (req, res) => {
  const { options } = req.params;

  // decode the options base 64 encoded to get the object
  let decodedOptions = decodeURIComponent(options);

  decodedOptions = atob(decodedOptions);

  let optionsObject = JSON.parse(decodedOptions);

  // remove everything after the T in the time string
  const datestring = optionsObject.date.split("T")[0];

  let timestring = optionsObject.shift_time;
  console.log(timestring);
  // convert timestring to uct time

  // get the timezone offset
  const timezoneOffset = new Date().getTimezoneOffset();
  // get the timezone offset in hours
  const timezoneOffsetHours = timezoneOffset / 60;

  // timestring is in format HH:MM
  const timeArray = timestring.split(":");
  // get the hours
  const hours = timeArray[0];
  // get the minutes
  const minutes = timeArray[1];

  // add the timezone offset to the hours
  const hoursWithTimezone = parseInt(hours) + timezoneOffsetHours;

  // get the new time string
  const newTimeString = `${hoursWithTimezone}:${minutes}`;

  if (hoursWithTimezone < 10) {
    timestring = `0${newTimeString}`;
  }

  let url = `https://api.external.citymapper.com/api/1/directions/transit?start=48.211890,16.412290&end=48.120669,16.563048&time_type=arrive&time=${datestring}T${timestring}:00`;
  console.log(url);
  // add headers to the request
  const headers = {
    "Content-Type": "application/json",
    "Citymapper-Partner-Key": process.env.CITYMAPPER_PARTNER_KEY,
  };
  // fetch the data from the url
  const response = await fetch(url, { headers });
  // parse the data to json
  const data = await response.json();
  // send the data to the client
  res.send(data);
};
