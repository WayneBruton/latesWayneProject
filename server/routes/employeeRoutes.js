const express = require("express");
const router = express.Router();
const pool = require("./connection");
// const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
// const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");
let cookieparser = require("cookie-parser");
const checktoken = require("./tokenCheckRoutes");
router.use(cookieparser());
const moment = require("moment");
// var geocoding = new require("reverse-geocoding");
// var geocoder = require('local-reverse-geocoder');
var crg = require("country-reverse-geocoding").country_reverse_geocoding();
// var exchange = require("exchange-rates");
const fetch = require("node-fetch");
// import {convertCurrency, getCurrencyRate, getCurrencyRateList} from 'currencies-exchange-rates';

router.put("/getEmployeeDocuments", checktoken, (req, res) => {
  let sql1 = `select id, staffType from users where id =  ${req.body.id}`;
  let sql2 = `select * from staffTypes where organisation = ${req.body.organisation}`;
  let sql3 = `select s.id, s.documentNameName, s.documentLinkLink, s.documentType as typeId, d.documentType, s.readDocument from staffDocuments s, documentTypes d where s.organisation = ${req.body.organisation} and s.users = ${req.body.id} and s.documentType = d.id`;
  let sql4 = `select * from documentTypes where organisation = ${req.body.organisation}`;
  let sql5 = `select id, policyRead  from policiesRead where organisation = ${req.body.organisation} and user = ${req.body.id}`;
  let sql = `${sql1};${sql2};${sql3};${sql4};${sql5}`;
  let results = { success: true, failure: false };
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        let allStaff = result[1][0].id;
        let thisStaffType = result[0][0].staffType;

        let staffTypes = result[1].filter((el) => {
          return el.id === allStaff || el.id === thisStaffType;
        });
        let staffDocuments = result[2];
        let documentTypes = result[3];
        let policiesRead = result[4];

        let lastSQL = `Select * from policies where JSON_CONTAINS(appliesTo, '[${allStaff}]') or JSON_CONTAINS(appliesTo, '[${thisStaffType}]') and organisation = ${req.body.organisation}`;

        connection.query(lastSQL, function (error, result) {
          if (error) {
            console.log(error);
            res.json(results.failure);
          } else {
            let finalSend = {
              policies: result,
              policiesRead: policiesRead,
              staffTypes: staffTypes,
              staffDocuments: staffDocuments,
              documentTypes: documentTypes,
            };

            res.json(finalSend);
          }
        });
      }
    });
    connection.release();
  });
});

router.put("/postpolicyRead", (req, res) => {
  let sql;
  if (req.body.documentType === "Policy") {
    sql = `Insert INTO policiesRead (policyRead, user, organisation) values (${req.body.documentID}, ${req.body.userID}, ${req.body.organisationID})`;
  } else if (req.body.documentType === "StaffDocument") {
    let today = moment(new Date()).format("YYYY-MM-DD HH:mm").toString();
    sql = `Update staffDocuments set readDocument = true, dateRead = '${today}' where id = ${req.body.documentID}`;
  }

  let results = { success: true, failure: false };

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        res.json(results.success);
      }
    });
    connection.release();
  });
});

router.get("/exchangeRate", (req, res) => {
  fetch("https://api.exchangerate-api.com/v4/latest/USD")
    .then((response) => response.json())
    .then((data) => {
      res.json({ ZAR: data.rates.ZAR, ALL: data.rates });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/getPackages", (req, res) => {
  let today = new Date();
  today.setDate(today.getDate() + 30);

  let sql1 = `select * from packages`;
  let sql2 = `select * from clientele where organisation = ${req.body.id}`;
  let sql3 = `select country from organisation where id = ${req.body.id}`;
  let sql = `${sql1};${sql2};${sql3}`;

  let results = { success: true, failure: false };

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getCountry", (req, res) => {
  let lat = req.body.latitude;
  let lon = req.body.longitude;
  var country = crg.get_country(lat, lon);

  if (country == null) {
    res.json({ error: "Error" });
  } else {
    res.json({ country: country.name, code: country.code });
  }
});

router.put("/usageThusFar", (req, res) => {
  let sql1 = `select  sum(documentSize) as documentSize from  staffDocuments where organisation = ${req.body.id}`;
  let sql2 = `select sum(policySize) as policySize from policies where organisation = ${req.body.id}`;
  let sql3 = `select count(*) as users from users where organisation = ${req.body.id}`;
  let sql4 = `select * from clientele where organisation = ${req.body.id}`;
  let sql5 = `select * from packages`;
  let sql = `${sql1};${sql2};${sql3};${sql4};${sql5}`;
  let results = { success: true, failure: false };

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getTheme", (req, res) => {
  let sql = `select * from colorScheme where organisation = ${req.body.organisation}`;
  let results = { success: true, failure: false };

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/upDateTheme", (req, res) => {
  let sql = `update colorScheme set colorChosen = '${req.body.colorChosen}' where organisation = ${req.body.organisation}`;
  let results = { success: true, failure: false };

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;
