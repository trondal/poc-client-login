const CLIENT_ID = "464c7f6d8a69062dbe07";
const CLIENT_SECRET = "496c26ffe9cf7ead8574534b149e69e86b1e9c0f";

var express = require("express");
var cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

var bodyParser = require("body-parser");

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
  // return res.json({ data: "AccessToken" });

  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      console.log("Some error");
    });
});

app.get("/ping", function (req, res) {
  return res.json({ data: "pong" });
});

// access token is going to be passed in as an Autorization header
app.get("/getUserData", async function (req, res) {
  console.log(req.get("Authorization"));
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"), // Bearer ACCESTOKEN
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

app.listen(4000, () => {
  console.log("CORS server running on port 4000");
});
