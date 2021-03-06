const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieparser = require("cookie-parser");

app = express();

// var corsOptions = {
//   origin: 'https://www.perfect-staff.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(cors());
app.use(cookieparser());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

if (port === 3000) {
  const dotenv = require("dotenv").config();
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "files/uploads/")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//#################################
//ASYNC AWAIT EXAMPLE

// const test = async function() {
//   let one = "one"
//   let two = "two"
//   let three = "three"
//   let four = "four"
//   let five = "five"
//   await a(one)
//     .then(await b(two))
//     .then(await c(three))
//     .then(await d(four))
//     .then(await e(five));
// };

// const a = (one) => {
//   return new Promise(resolve => {
//     resolve(console.log(one));
//   });
// };
// const b = (two) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(console.log(two));
//     }, 600);
//   });
// };
// const c = (three) => {
//   return new Promise(resolve => {
//     resolve(console.log(three));
//   });
// };
// const d = (four) => {
//   return new Promise(resolve => {
//     resolve(console.log(four));
//   });
// };
// const e = (five) => {
//   return new Promise(resolve => {
//     resolve(console.log(five));
//   });
// };

// test();

// ###############################################
// THIS TO CHECK ALL OBJECTS
// const p = {
//   p1: "value1",
//   p2: "",
//   p3: "value3"
// };

// for (let [key, value] of Object.entries(p)) {
//   if (!value) {
//     console.log("res.json");
//   }
// }
//#################################################
// else {
//   console.log(`The Values: ${key}:${value}`);
// }
// }
// ################################################

const initialRoutes = require("./routes/initialRoutes"),
  authorizationRoutes = require("./routes/authorizationRoutes"),
  uploadRoutes = require("./routes/uploadRoutes"),
  employeeRoutes = require("./routes/employeeRoutes"),
  settingsRoutes = require("./routes/settingsRoutes"),
  contactRoutes = require("./routes/contactRoutes"),
  reportRoutesGlobal = require("./routes/reportRoutesGlobal"),
  reportRoutesIndividual = require("./routes/reportRouteIndividual");

app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.status(422).json({ error: "Only PDF Files allowed" });
    console.log("Only PDF Files allowed");
    return;
  }
});

app.use(
  authorizationRoutes,
  initialRoutes,
  uploadRoutes,
  settingsRoutes,
  employeeRoutes,
  contactRoutes,
  reportRoutesGlobal,
  reportRoutesIndividual
);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
