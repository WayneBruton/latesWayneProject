const express = require("express");
const router = express.Router();
const pool = require("./connection");
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
let cookieparser = require("cookie-parser");
const checktoken = require("./tokenCheckRoutes");
router.use(cookieparser());

router.put("/policiesAndStaffTypes", checktoken, (req, res) => {
  let id = req.body.id;
  let sql1 = `select * from policies where organisation = '${id}' order by createdAt desc`;
  let sql2 = `select * from staffTypes where organisation = '${id}' order by id`;
  let sql = `${sql1};${sql2}`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        result[0].forEach(el => {
          // el.PolicyLink = `${process.env.CLIENT_POLICY_UPLOADS}${el.PolicyLink}`;
          el.PolicyLink = `${el.PolicyLink}`;
        });
        let documentItems = [];

        let start = result[1];
        start.forEach(el => {
          let id = el.id;
          let input = {
            id: id,
            title: el.Staff_description,
            items: []
          };
          let filtered = result[0].filter(el2 => {
            return el2.AppliesTo.includes(id);
          });
          filtered.forEach(el2 => {
            el2.categoryid = id;
            // el2.posted = `posted as ${id}`
            input.items.push(el2);
          });

          documentItems.push(input);
        });
        let finalResult = [];
        finalResult.push(result[0]);
        finalResult.push(documentItems);
        res.json(finalResult);
      }
    });
    connection.release();
  });
});

router.put("/staffTypes", (req, res) => {
  let id = req.body.id;
  let sql = `select * from staffTypes where organisation = ${id} order by id`;

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        res.json({ error: "error posting to database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getOrgData", (req, res) => {
  let id = req.body.id;
  let sql = `select * from organisation where id = ${id}`;
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        res.json({ error: "error posting to database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getEmployeesDocumentTypesAndDocuments", checktoken, (req, res) => {
  let id = req.body.id;
  let sql1 = `select id, fname, lname from users where organisation = ${id} order by lname, fname, id`;
  let sql2 = `select * from staffDocuments where organisation = ${id} order by id desc`;
  let sql = `${sql1};${sql2}`;

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
        res.json({ error: "error connecting to the database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getEmployees", (req, res) => {
  let id = req.body.id;
  let sql1 = `select id, fname, lname from users where organisation = ${id} order by lname, fname, id`;
  let sql2 = `select id, documentType from documentTypes where organisation = ${id} order by id`;
  // let sql2 = `select * from staffDocuments where organisation = ${id} order by id desc`;
  // let sql = `${sql1};${sql2}`
  let sql = `${sql1};${sql2}`;

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
        res.json({ error: "error connecting to the database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;
