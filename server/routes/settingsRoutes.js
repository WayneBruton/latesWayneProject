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

router.put("/getEmployeesToEdit", checktoken, (req, res) => {
  let sql1 = `select id, fname, lname, userType from users where organisation = ${req.body.id}`;
  let sql2 = `select * from staffTypes where organisation = ${req.body.id}`;
  let sql3 = `select users, count(*) as count from staffDocuments where organisation = ${req.body.id} group by users`;
  let sql = `${sql1};${sql2};${sql3}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        //   res.json(results.failure);

        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/getEmployeeToEdit", (req, res) => {
  let sql = `select * from users where id = ${req.body.id}`;

  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
        res.json(results.failure);
      } else {
        //   res.json(results.failure);

        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/editEmployee", (req, res) => {
  console.log(req.body)
  let sql = `update users set lname = '${req.body.lname}', fname = '${req.body.fname}', email = '${req.body.email}', userType = ${req.body.userType}, staffType = ${req.body.staffType}, jobTitle = '${req.body.jobTitle}', mobileNumber = '${req.body.mobileNumber}' where id = ${req.body.id}`;

  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/deleteEmployee", (req, res) => {
  let sql2 = `Delete from users where id = ${req.body.id}`;
  let sql1 = `delete from policiesRead where user = ${req.body.id}`;
  let sql = `${sql1};${sql2}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/getStaffTypes", checktoken, (req, res) => {
  let sql1 = `select id, staff_description from staffTypes where organisation  = ${req.body.id}`;
  let sql2 = `select s.id, s.staff_description, p.appliesTo from staffTypes s right join
  policies p on JSON_CONTAINS(p.appliesTo, CAST(s.id as JSON), '$') where s.organisation = ${req.body.id} and s.organisation = p.organisation`;
  let sql3 = `select u.staffType from users u, staffTypes s where s.id = u.staffType and u.organisation = ${req.body.id} and s.organisation = u.organisation`;
  let sql = `${sql1};${sql2};${sql3}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/editStaffType", (req, res) => {
  let sql = `update staffTypes set staff_description = '${req.body.staffType}' where id = ${req.body.id}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/deleteStaffType", (req, res) => {
  let sql = `Delete from staffTypes where id = ${req.body.id}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.post("/addStaffType", (req, res) => {
  let sql = `Insert into staffTypes (staff_description, organisation) values ('${req.body.staffType}', ${req.body.organisation})`;
  let results = { success: true, failure: false };

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/getDocumentTypes", checktoken, (req, res) => {
  let sql = `select d.id, d.documentType, count(s.documentType) as count from documentTypes as d left join staffDocuments  as s on s.documentType = d.id and d.organisation = ${req.body.id} and d.organisation = s.organisation
            where d.organisation = ${req.body.id}
              group by d.id`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/editDocumentType", (req, res) => {
  let sql = `update documentTypes set documentType = '${req.body.documentType}' where id = ${req.body.id}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.post("/addDocumentType", (req, res) => {
  let sql = `Insert into documentTypes (documentType, organisation) values ('${req.body.documentType}', ${req.body.organisation})`;
  let results = { success: true, failure: false };

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/deleteDocumentType", (req, res) => {
  let sql = `Delete from documentTypes where id = ${req.body.id}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/getOrganisationStatistics", checktoken, (req, res) => {
  let sql1 = `select count(*) as users from users where organisation  = ${req.body.id}`;
  let sql2 = `select count(*) as policies from policies where organisation = ${req.body.id}`;
  let sql3 = `select * from staffDocuments where organisation = ${req.body.id}`;
  let sql4 = `select * from staffTypes where organisation = ${req.body.id}`;
  let sql5 = `select u.id, u.lname, u.fname, u.staffType,  count(p.user) as policiesRead from users u left join policiesRead p on u.organisation = ${req.body.id} and p.organisation = ${req.body.id}  and u.id = p.user where u.organisation = ${req.body.id} group by u.id, u.lname, u.fname, u.staffType order by u.lname`;
  let sql6 = `select * from policies where organisation = ${req.body.id}`;
  let sql7 = `select c.package, p.usageAllowed, p.users from clientele c, packages p where c.organisation = ${req.body.id} and c.package = p.id`;
  let sql = `${sql1};${sql2};${sql3};${sql4};${sql5};${sql6};${sql7}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/getOrganisationDetails", checktoken, (req, res) => {
  let sql = `select * from organisation where id  = ${req.body.id}`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
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

router.put("/updateOrganisationDetails", (req, res) => {
  let update = req.body;

  let id = req.body.id;

  delete update.id;
  let updateArray = [];
  Object.keys(update).forEach(function(key) {
    updateArray.push(update[key]);
  });
  updateArray.push(id);
  let sql = `update organisation set organisationName = ?, registrationNumber = ?, VATNumber = ?, email = ?, address1 = ?, address2 = ?,address3 = ?, country = ?, province = ?, city = ?, zipCode = ?, contactNumber = ? where id = ?`;
  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, updateArray, function(error, result) {
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

module.exports = router;
