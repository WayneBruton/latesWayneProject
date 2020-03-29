const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieparser = require("cookie-parser");

app = express();

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
    extended: true
  })
);

//#################################
//ASYNC AWAIT EXAMPLE

// const test = async function() {
//   await a()
//     .then(await b())
//     .then(await c())
//     .then(await d())
//     .then(await e());
// };

// const a = () => {
//   return new Promise(resolve => {
//     resolve(console.log("one"));
//   });
// };
// const b = () => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(console.log("two"));
//     }, 600);
//   });
// };
// const c = () => {
//   return new Promise(resolve => {
//     resolve(console.log("three"));
//   });
// };
// const d = () => {
//   return new Promise(resolve => {
//     resolve(console.log("four"));
//   });
// };
// const e = () => {
//   return new Promise(resolve => {
//     resolve(console.log("five"));
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

app.use(function(err, req, res, next) {
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
