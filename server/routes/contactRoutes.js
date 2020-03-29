const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: 465, //587
  secure: true,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

let mailError;

async function sendMail(subject, recipient, output) {
  let mailOptions = {
    from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
    to: `${recipient}`,
    subject: `${subject}`,
    text: "Hello world?",
    html: output
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection");
      mailError = true;
    } else {
      console.log("AWESOME");
      mailError = false;
      res.json({ error: false });
    }
  });
}

router.put("/contactform", function(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let message = req.body.message;
  let subject = req.body.subject;
  let recipient = "waynebruton@icloud.com";
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>First Name: ${firstName}</li><br>
    <li>Last  Name: ${lastName}</li><br>
    <li>Email: ${email}</li><br>
  </ul><br>
  <h3>Message</h3><br>
  <p>${message}</p>
    `;
  sendMail(subject, recipient, output)
    .then(async function() {
      if (mailError) {
        res.json({ error: true });
      } else {
        res.json({ error: false });
      }
    })
    .catch(async function(error) {
      console.log(error);
      res.json({ error: true });
    });
});

router.put("/getUser", (req, res) => {
  let sql = `select email, fname, lname from users where id = ${req.body.id}`;
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

let otp;
router.put("/createOTP", (req, res) => {
  otp = Math.floor(Math.random() * 1000000);
  let sql = `select email, fname, lname from users where email = '${req.body.email}' and organisation = ${req.body.id}`;
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
        if (result.length) {
          let firstName = result[0].fname;
          let lastName = result[0].lname;
          let recipient = result[0].email;
          // let recipient = `waynebruton@icloud.com`;
          let message = `Here is your one time pin <br /><span style="font-size: 150%;">${otp}</span>`;
          let subject = `One Time Pin (OTP)`;
          const output = `
                            <h3>One Time Pin (OTP) </h3>
                                Dear ${firstName} ${lastName}<br>                  
                            <p>${message}</p>
                                `;
          sendMail(subject, recipient, output)
            .then(async function() {
              if (mailError) {
                res.json({ error: true });
              } else {
                res.json({ error: false, OTP: otp });
              }
            })
            .catch(async function(error) {
              console.log(error);
              res.json({ error: true });
            });
        } else {
          res.json({ error: true });
        }
      }
    });
    connection.release();
  });
});

router.put("/emailPolicies", (req, res) => {
  let staffTypes = JSON.parse(req.body.staffTypes);
  let organisation = req.body.organisation;
  let str = "";
  let len = staffTypes.length - 1;
  staffTypes.forEach((el, index) => {
    if (index === len) {
      str = str + el;
    } else {
      str = str + el + ",";
    }
  });
  let sql;
  if (staffTypes[0] === 1) {
    sql = `select fname, lname, email from users where  organisation = ${organisation}`;
  } else {
    sql = `select fname, lname, email from users where staffType in (${str}) and organisation = ${organisation}`;
  }
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
        if (result.length) {
          let subject = "New Policy/s Uploaded";
          result.forEach(el => {
            let firstName = el.fname;
            let recipient = el.email;
            const output = `<br />
                          <h3>New policies uploaded</h3>
                          <br />
                          <p>Dear ${firstName},</p>
                          <p>A new policy has been uploaded.</p>
                          <p>Logon to   <a href="">Perfect Staff</a> to view it.</p>
                          <br />
                          <span>Perfect Staff Admin</span>`;

            sendMail(subject, recipient, output).catch(async function(error) {
              console.log(error);
              await res.json({ error: true });
            });
          });
          setTimeout(() => {
            if (mailError) {
              res.json({ error: true });
            } else {
              res.json({ error: false });
            }
          }, (len + 1) * 1000);
        } else {
          res.json({ error: true });
        }
      }
    });
    connection.release();
  });
});

router.put("/emailDocuments", (req, res) => {
  let staffTypes = JSON.parse(req.body.staffTypes);
  let str = "";
  let len = staffTypes.length - 1;
  staffTypes.forEach((el, index) => {
    if (index === len) {
      str = str + el;
    } else {
      str = str + el + ",";
    }
  });
  let sql;
  sql = `select fname, lname, email from users where id in (${str})`;

  let results = { success: true, failure: false };
  // res.json(results.success);
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
        if (result.length) {
          let subject = "New Staff Document/s Uploaded";
          result.forEach(el => {
            let firstName = el.fname;
            let recipient = el.email;
            const output = `<br />
                          <h3>New staff document/s uploaded</h3>
                          <br />
                          <p>Dear ${firstName},</p>
                          <p>A new document has been uploaded.</p>
                          <p>Logon to   <a href="">Perfect Staff</a> to view it.</p>
                          <br />
                          <span>Perfect Staff Admin</span>`;

            sendMail(subject, recipient, output).catch(async function(error) {
              console.log(error);
              if (error) {
                await res.json({ error: true });
              } else {
                await res.json({ error: false });
              }
            });
          });
          setTimeout(() => {
            if (mailError) {
              res.json({ error: true });
            } else {
              res.json({ error: false });
            }
          }, (len + 1) * 500);
        } else {
          res.json({ error: true });
        }
      }
    });
    connection.release();
  });
});

router.put("/emailIndividual", (req, res) => {
  let id = req.body.id;
  // let staffTypes = JSON.parse(req.body.staffTypes);
  // let str = "";
  // let len = staffTypes.length - 1;
  // staffTypes.forEach((el, index) => {
  //   if (index === len) {
  //     str = str + el;
  //   } else {
  //     str = str + el + ",";
  //   }
  // });
  let sql;
  sql = `select email from users where id = ${id} and organisation = ${req.body.organisation}`;

  let results = { success: true, failure: false };
  // res.json(results.success);
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
        if (result.length) {
          let subject = "Policies and documents read";

          let firstName = req.body.fname;
          let recipient = result[0].email;

          const output = `<br />
                          <h3>Your policy statistics</h3>
                          <br />
                          <p>Dear ${firstName},</p>
                          <p>These are your stats:</p>
                          <p><strong>Policies</strong></p>
                          <ol>
                            <li>Total Policies: ${req.body.totalPolicies}.</li>
                            <li>Policies read by you: ${req.body.policiesRead}.</li>
                            <li>Percentage of Policies read by you: <strong>${req.body.policiesReadPercent} %.</strong></li>
                          </ol>
                          <br />
                          <p><strong>Staff Documents</strong></p>
                          <ol>
                            <li>Total Staff Documents: ${req.body.staffDocsTotal}.</li>
                            <li>Staff Documents read by you: ${req.body.staffDocsRead}.</li>
                            <li>Percentage of Staff Documents read by you: <strong>${req.body.staffDocsReadPercentage} %.</strong></li>
                          </ol>
                          <br />
                          <h4>Total percentage of all documents and policies read is: <strong>${req.body.totalAllDocsPercent} %</strong>.</h4>
                          <br />
                          <p>Please be aware that reading and <strong>acknowledging</strong> of alldocuments is policy.</p>
                          <br />
                          <p><strong>Failure to comply/correct the situation can result in disciplinary action.</strong></p>
                          <br />
                          <p>Logon to   <a href="">Perfect Staff</a> to view your docs and take corrective action.</p>
                          <br />
                          <span>Perfect Staff Admin</span>`;

          sendMail(subject, recipient, output).catch(async function(error) {
            console.log(error);
            if (error) {
              await res.json({ error: true });
            } else {
              await res.json({ error: false });
            }
          });
          setTimeout(() => {
            if (mailError) {
              res.json({ error: true });
            } else {
              res.json({ error: false });
            }
          }, 500);
        } else {
          res.json({ error: true });
        }
      }
    });
    connection.release();
  });
});

module.exports = router;
