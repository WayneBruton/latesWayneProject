const express = require("express");
const router = express.Router();
const pool = require("./connection");
const bcrypt = require("bcryptjs");
const jwtSignUser = require("./tokenCreateRoutes");
const moment = require("moment");
var md5 = require("blueimp-md5");

router.put("/checkOrgName", (req, res) => {
  let sql = `select id from organisation where organisationName = '${req.body.name}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error connecting to database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/checkOrgEmail", (req, res) => {
  let sql = `select id from organisation where email = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error connecting to database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/checkUserEmail", (req, res) => {
  let sql = `select u.id, u.firstLogin, u.userType, u.organisation, o.organisationName from users u, organisation o where u.email = '${req.body.email}' and o.id = u.organisation order by u.organisation`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error connecting to database" });
      } else {
        res.json(result);
      }
    });
    connection.release();
  });
});

router.put("/login", (req, res) => {
  let password = req.body.password;
  let sql = `select u.id, u.fname, u.lname, u.email, u.password, u.userType, u.organisation, o.organisationName, o.country from users u, organisation o where u.email = '${req.body.email}' and o.id = u.organisation and u.organisation = ${req.body.id}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error posting to database" });
      } else {
        if (result.length) {
          let hash = result[0].password;
          bcrypt.compare(password, hash, function (err, response) {
            if (response) {
              let userJSON = {
                id: result[0].id,
                fname: result[0].fname,
                lname: result[0].lname,
                email: result[0].email,
                userType: result[0].userType,
              };
              // res.header({test: "Testing"})
              res.json({
                organisationID: result[0].organisation,
                organisationName: result[0].organisationName,
                country: result[0].country,
                user: userJSON,
                token: jwtSignUser(userJSON),
              });
            } else {
              res.json({ error: "could not log on" });
            }
          });
        } else {
          res.json({ error: "could not log on as no result dataset" });
        }
      }
    });
    connection.release();
  });
});

router.put("/firstlogin", (req, res) => {
  let password = req.body.password;
  let hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

  let sql1 = `update users set password = '${hash}', firstLogin = false where email = '${req.body.email}' and organisation = ${req.body.id}`;
  let sql2 = `select u.id, u.fname, u.lname, u.email, u.password, u.userType, u.organisation, o.organisationName, o.country from users u, organisation o where u.email = '${req.body.email}' and o.id = u.organisation`;
  let sql = `${sql1};${sql2}`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error posting to database" });
      } else {
        if (result.length) {
          let hash2 = result[1][0].password;

          bcrypt.compare(password, hash2, function (err, response) {
            if (response) {
              let userJSON = {
                id: result[1][0].id,
                fname: result[1][0].fname,
                lname: result[1][0].lname,
                email: result[1][0].email,
                userType: result[1][0].userType,
              };
              res.json({
                organisationID: result[1][0].organisation,
                organisationName: result[1][0].organisationName,
                country: result[1][0].country,
                user: userJSON,
                token: jwtSignUser(userJSON),
              });
            } else {
              res.json({ error: "could not log on" });
            }
          });
        } else {
          res.json({ error: "could not log on as no result dataset" });
        }
      }
    });
    connection.release();
  });
});

router.put("/createSignature", (req, res) => {
  let value = req.body.value.trim();

  value = value.replace(/:\/\/www/gi, "%3A%2F%2Fwww");
  value = value.replace(/\//gi, "%2F");
  value = value.replace(/@/gi, "%40");
  value = value.replace(/ /gi, "+");

  // let value2 =
  //   "merchant_id=10011412&merchant_key=3rpuer3qeqcfr&return_url=https%3A%2F%2Fwww.eccentrictoad.com%2Freturn&cancel_url=https%3A%2F%2Fwww.eccentrictoad.com%2Fcancel&notify_url=https%3A%2F%2Fwww.eccentrictoad.com%2Fnotify&name_first=Wayne&name_last=Bruton&email_address=waynebruton%40gmail.com&cell_number=0740628742&m_payment_id=01AB&amount=999.00&item_name=Test+Item&item_description=A+test+product&email_confirmation=1&confirmation_address=waynebruton%40icloud.com&passphrase=Perfectstuff123";

  // let arr1 = value.split("");
  // let arr2 = value2.split("");

  let saltedHash = md5(value);

  res.json({ signature: saltedHash });
});

router.post("/register", (req, res) => {
  (organisationNameG = req.body.organisationName),
    (emailG = req.body.email),
    (address1G = req.body.address1),
    (address2G = req.body.address2),
    (address3G = req.body.address3),
    (cityG = req.body.city),
    (provinceG = req.body.province),
    (countryG = req.body.country),
    (zipCodeG = req.body.zipCode),
    (contactNumberG = req.body.contactNumber),
    (emailUserG = req.body.emailUser),
    (fnameG = req.body.fname),
    (lnameG = req.body.lname),
    (userTypeG = req.body.userType),
    (passwordG = req.body.password),
    (registrationNumberG = req.body.registrationNumber),
    (VATNumberG = req.body.VATNumber),
    (mobileNumberG = req.body.mobileNumber);

  let orgSql = `INSERT INTO organisation (organisationName, registrationNumber, VATNumber,  email, address1, address2, address3, city, province, country, zipCode, contactNumber ) values
    ('${organisationNameG}','${registrationNumberG}','${VATNumberG}', '${emailG}', '${address1G}', '${address2G}', '${address3G}','${cityG}', '${provinceG}', '${countryG}', '${zipCodeG}', '${contactNumberG}' )`;

  let sql2 = `SELECT id, organisationName, country from organisation where organisationName = '${organisationNameG}'`;

  // let getUserStaffTypeSQL = `select id from staffTypes where organisation = ${orgIDG} order by id limit 1,1`;

  // let updateUserStaffTypeSQL = `update users set staffType = ${staffTypeG} where organisation = ${orgIDG}`;

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  const getLoginDetails = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          pool.getConnection(function (err, connection) {
            if (err) {
              connection.release();
              resizeBy.send("Error with connection");
            }
            let userData = `select id, fname, lname, email, userType, firstLogin from users where email = '${emailUserG}' and organisation = ${orgIDG}`;
            connection.query(userData, function (error, result) {
              if (error) {
                console.log(error);
              } else {
                let userJSON = {
                  id: result[0].id,
                  fname: result[0].fname,
                  lname: result[0].lname,
                  email: result[0].email,
                  userType: result[0].userType,
                };
                res.json({
                  organisationID: orgIDG,
                  organisationName: organisationNameG,
                  token: jwtSignUser(userJSON),
                  country: countryG,
                  fname: result[0].fname,
                  lname: result[0].lname,
                  userType: result[0].userType,
                  firstLogin: result[0].firstLogin,
                  userID: result[0].id,
                  country: countryG,
                  userIsEmployee: true,
                });
              }
            });
            connection.release();
          })
        );
        // });
      }, 250);
    });
  };

  const register = async function (param1, param2) {
    await loadCompany(param1)
      .then(await getOrdDetails(param2))
      .then(await setUpFiles())
      .then(await getLoginDetails())
      // .then(await getUserType(param3))
      // .then(await editUserType(param4));
  };

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  register(orgSql, sql2);
});

let orgIDG;
let organisationNameG;
let emailG;
let address1G;
let address2G;
let address3G;
let cityG;
let provinceG;
let countryG;
let zipCodeG;
let contactNumberG;
let emailUserG;
let fnameG;
let lnameG;
let userTypeG;
let passwordG;
let registrationNumberG;
let VATNumberG;
let mobileNumberG
let staffTypeG

const loadCompany = (param1) => {
  return new Promise((resolve) => {
    resolve(
      pool.getConnection(function (err, connection) {
        if (err) {
          connection.release();
          resizeBy.send("Error with connection");
        }
        connection.query(param1, function (error, result) {
          if (error) {
            console.log(error);
          } else {
          }
        });
        connection.release();
      })
    );
  });
};

const getOrdDetails = (param2) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        pool.getConnection(function (err, connection) {
          if (err) {
            connection.release();
            resizeBy.send("Error with connection");
          }
          connection.query(param2, function (error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log(result)
              orgIDG = result[0].id;
              console.log(orgIDG)
            }
          });
          connection.release();
        })
      );
      // });
    }, 600);
  });
};

// const getUserType = (param3) => {
//   console.log("test",param3)
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(
//         pool.getConnection(function (err, connection) {
//           if (err) {
//             connection.release();
//             resizeBy.send("Error with connection");
//           }
//           connection.query(param3, function (error, result) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log(result)
//               staffTypeG = result[0].id;
//             }
//           });
//           connection.release();
//         })
//       );
//       // });
//     }, 1000);
//   });
// };

// const editUserType = (param4) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(
//         pool.getConnection(function (err, connection) {
//           if (err) {
//             connection.release();
//             resizeBy.send("Error with connection");
//           }
//           connection.query(param4, function (error, result) {
//             if (error) {
//               console.log(error);
//             } else {
//               // console.log(result)
//               // usertTypeG = result[0].id;
//             }
//           });
//           connection.release();
//         })
//       );
//       // });
//     }, 1500);
//   });
// };

const setUpFiles = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        pool.getConnection(function (err, connection) {
          if (err) {
            connection.release();
            resizeBy.send("Error with connection");
          }
          let hash = bcrypt.hashSync(
            passwordG,
            parseInt(process.env.SALT_ROUNDS)
          );
          let sqlStaffTypes = `INSERT INTO staffTypes (organisation, staff_description) values
                                  (${orgIDG},"All Staff"),
                                  (${orgIDG},"Management"),
                                  (${orgIDG},"Admin"),
                                  (${orgIDG},"Finance"),
                                  (${orgIDG},"Security"),
                                  (${orgIDG},"Maintenance"),
                                  (${orgIDG},"Reception")`;

          let sqlUser = `INSERT into users (organisation, fname, lname, email, password, userType, staffType, firstLogin, mobileNumber ) values
                            (${orgIDG},'${fnameG}', '${lnameG}', '${emailUserG}','${hash}',${userTypeG}, 2, false, '${mobileNumberG}')`;

          let sqldocumentTypes = `INSERT INTO documentTypes (organisation, documentType) values
                                  (${orgIDG},"Employment"),
                                  (${orgIDG},"Notices"),
                                  (${orgIDG},"Disciplinary")`;
          let today = new Date();
          today = moment(today)
            .add(1, "y")
            .format("YYYY-MM-DD HH:mm:ss")
            .toString();
          let sqlclientele = `INSERT INTO clientele (organisation, package, expiry) values
                (${orgIDG}, 1, '${today}')`;

          let sqlColors = `INSERT INTO colorScheme (organisation, colorChosen ) values (
                  ${orgIDG}, "#142850"
              );`;

          let sqlUnits = `INSERT INTO textUnits (organisation, unitNumber ) values (
                  ${orgIDG}, 0
              );`;
          let finalSQL = `${sqlStaffTypes};${sqlUser};${sqldocumentTypes};${sqlclientele};${sqlColors};${sqlUnits}`;
          connection.query(finalSQL, function (error, result) {
            if (error) {
              console.log(error);
            } else {
            }
          });
          connection.release();
        })
      );
    }, 350);
  });
};


router.put("/updateNewRegistrationUser", (req, res) => {
  console.log(req.body)
  let sql = `select id from staffTypes where organisation = ${req.body.organisation} order by id limit 1,1`;
  // let sql = `select id from organisation where email = '${req.body.email}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function (error, result) {
      if (error) {
        res.json({ error: "error connecting to database" });
      } else {
        console.log(result)
        let sql2 = `update users set staffType = ${result[0].id} where id = ${req.body.userID}`;
        console.log(sql2)
        // res.json(result);
        connection.query(sql2, function (error, result) {
          if (error) {
            res.json({ error: "error connecting to database" });
          } else {
            console.log(result)
            // let sql2 = `update users set staffType = ${result[0].id} where id = ${req.body.userID}`;
            // console.log(sql2)
            res.json(result);
          }
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
