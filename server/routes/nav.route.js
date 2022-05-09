const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const { getNavController } = require("../controllers/nav.controller");

// create a route to call another external api with the url https://api.external.citymapper.com/api/1/directions/transit?start=48.211890,16.412290&end=48.120669,16.563048&time_type=arrive&time=2022-05-11T08:15:00+02:00
router.get("/", (req, res) => {
  fetch(
    "https://api.external.citymapper.com/api/1/directions/transit?start=48.211890,16.412290&end=48.120669,16.563048&time_type=arrive&time=2022-05-11T08:15:00+02:00"
  )
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    });
});
