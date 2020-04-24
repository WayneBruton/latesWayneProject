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

router.put("/policiesAndStaffTypes", checktoken, (req, res) => {
  let id = req.body.id;
  let sql1 = `select * from policies where organisation = '${id}' order by createdAt desc`;
  let sql2 = `select * from staffTypes where organisation = '${id}' order by id`;
  let sql = `${sql1};${sql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        result[0].forEach((el) => {
          el.policyLink = `${el.policyLink}`;
        });
        let documentItems = [];

        let start = result[1];
        start.forEach((el) => {
          let id = el.id;
          let input = {
            id: id,
            title: el.staff_description,
            items: [],
          };
          let filtered = result[0].filter((el2) => {
            return el2.appliesTo.includes(id);
          });
          filtered.forEach((el2) => {
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

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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
  // let sql2 = `select * from staffDocuments where organisation = ${id} order by id desc`;
  let sql2 = `select s.id, s.documentNameName, s.documentLinkLink, s.documentDescription, s.documentType, s.users, s.createdAt, s.organisation, s.readDocument, s.documentSize, s.dateRead, d.documentType as documentTypeDesc from staffDocuments s, documentTypes d where s.organisation = ${id} and s.documentType = d.id order by s.id desc`;
  let sql = `${sql1};${sql2}`;

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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

  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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

router.put("/editPolicy", (req, res) => {
  let sql1 = `select * from policies where id = ${req.body.id}`;
  let sql2 = `select * from staffTypes where organisation = ${req.body.organisation}`;
  let sql = `${sql1};${sql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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

router.put("/updatePolicy", (req, res) => {
  let sql = `update policies set policyName = '${req.body.policyName}', description = '${req.body.description}', appliesTo = '${req.body.appliesTo}' where id = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
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

router.put("/getExpiry", (req, res) => {
  let sql = `select expiry from clientele where organisation = ${req.body.organisation}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        console.log(error);
        res.json({ error: "error connecting to the database" });
      } else {
        console.log(result)
        res.json(result);
      }
    });
    connection.release();
  });
});

module.exports = router;
