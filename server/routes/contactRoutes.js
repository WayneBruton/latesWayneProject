const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");
const moment = require("moment");

let transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: 465, //587
  secure: true,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let mailError;

async function sendMail(subject, recipient, output) {
  let mailOptions = {
    // from: "Perfect Staff Contact Form <wayne@eccentrictoad.com>",
    from: "Perfect Staff Contact Form <support@perfect-staff.com>",
    to: `${recipient}`,
    subject: `${subject}`,
    text: "Hello world?",
    html: output,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error with connection");
      mailError = true;
    } else {
      console.log("AWESOME AMAZING");
      mailError = false;
      res.json({ error: false });
    }
  });
}

router.put("/contactform", function (req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let message = req.body.message;
  let subject = req.body.subject;
  // let recipient = "waynebruton@icloud.com";
  let recipient = "support@perfect-staff.com";
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
    .then(async function () {
      if (mailError) {
        res.json({ error: true });
      } else {
        res.json({ error: false });
      }
    })
    .catch(async function (error) {
      console.log(error);
      res.json({ error: true });
    });
});

router.put("/getUser", (req, res) => {
  let sql = `select email, fname, lname from users where id = ${req.body.id}`;
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

let otp;
router.put("/createOTP", (req, res) => {
  otp = Math.floor(Math.random() * 1000000);
  let sql = `select email, fname, lname from users where email = '${req.body.email}' and organisation = ${req.body.id}`;
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
            .then(async function () {
              if (mailError) {
                res.json({ error: true });
              } else {
                res.json({ error: false, OTP: otp });
              }
            })
            .catch(async function (error) {
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
        if (result.length) {
          let subject = "New Policy/s Uploaded";
          result.forEach((el) => {
            let firstName = el.fname;
            let recipient = el.email;
            const output = `<br />
                          <h3>New policies uploaded</h3>
                          <br />
                          <p>Dear ${firstName},</p>
                          <p>A new policy has been uploaded.</p>
                          <p>Logon to   <a href="https:www//perfect-staff.com">Perfect Staff</a> to view it.</p>
                          <br />
                          <span>Perfect Staff Admin</span>`;

            sendMail(subject, recipient, output).catch(async function (error) {
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
        if (result.length) {
          let subject = "New Staff Document/s Uploaded";
          result.forEach((el) => {
            let firstName = el.fname;
            let recipient = el.email;
            const output = `<br />
                          <h3>New staff document/s uploaded</h3>
                          <br />
                          <p>Dear ${firstName},</p>
                          <p>A new document has been uploaded.</p>
                          <p>Logon to   <a href="https://www.perfect-staff.com">Perfect Staff</a> to view it.</p>
                          <br />
                          <span>Perfect Staff Admin</span>`;

            sendMail(subject, recipient, output).catch(async function (error) {
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
  let content = req.body.content;
  console.log(req.body);

  let sql;
  sql = `select email from users where id = ${id} and organisation = ${req.body.organisation}`;

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
        if (result.length) {
          let subject = "Policies and documents read";
          let recipient = result[0].email;
          const output = content;
          sendMail(subject, recipient, output).catch(async function (error) {
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

// ################################

router.post("/itnresponse", (req, res) => {
  // console.log("Body", JSON.stringify(req.body));

  // let info = {"m_payment_id":"1 2 false false 500","pf_payment_id":"28294559","payment_status":"COMPLETE","item_name":"Package Name Small","item_description":"Small - users 20","amount_gross":"5.00","amount_fee":"-2.51","amount_net":"2.49","custom_str1":"","custom_str2":"","custom_str3":"","custom_str4":"","custom_str5":"","custom_int1":"","custom_int2":"","custom_int3":"","custom_int4":"","custom_int5":"","name_first":"Wayne","name_last":"Bruton","email_address":"waynebruton@gmail.com","merchant_id":"10469596","signature":"a068de8b12ebaaaa22167e7a7680821d"}

  // let info = {
  //   m_payment_id: "1 2 false false 500",
  //   pf_payment_id: "28296034",
  //   payment_status: "COMPLETE",
  //   item_name: "Package Name Small",
  //   item_description: "Small - users 20",
  //   amount_gross: "5.00",
  //   amount_fee: "-2.51",
  //   amount_net: "2.49",
  //   custom_str1: "",
  //   custom_str2: "",
  //   custom_str3: "",
  //   custom_str4: "",
  //   custom_str5: "",
  //   custom_int1: "",
  //   custom_int2: "",
  //   custom_int3: "",
  //   custom_int4: "",
  //   custom_int5: "",
  //   name_first: "Wayne",
  //   name_last: "Bruton",
  //   email_address: "waynebruton@gmail.com",
  //   merchant_id: "10469596",
  //   signature: "85d86008c923c6b450f01cc599000f15",
  // };
  // console.log(info);
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}



  let info = req.body
  
  console.log("info",info)
  res.sendStatus(200);

  if (!isEmpty(info) ) {
  let receiptDetails = info.m_payment_id.split(" ");
  console.log(receiptDetails);

  // FOR CLIENTELE
  let organisation = parseInt(receiptDetails[0]);
  let package = parseInt(receiptDetails[1]);
  let monthly = receiptDetails[2];
  if (monthly === "true") {
    monthly = true;
  } else monthly = false;
  monthly = !monthly;


  let paidDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  
  let expiry;
  if (monthly) {
    expiry = moment(paidDate).add(1, "M").format('YYYY-MM-DD HH:mm:ss')
  } else {
    expiry = moment(paidDate).add(1, "Y").format('YYYY-MM-DD HH:mm:ss')
  }
  // console.log("Date Paid",paidDate)


//FOR CLIENTELE
// console.log("FOR CLIENTELE")
// console.log("-------------")
//   console.log("Expiry",expiry)
//   console.log("organisation", organisation);
//   console.log("package", package);
//   console.log("monthly", monthly);

  // PAYMENTS RECEIVED
  // console.log("FOR PAYMENTS RECEIVED")
  // console.log("---------------------")
  // console.log("organisation", organisation);
  // console.log("Pmt ID",info.pf_payment_id)
  // console.log("Pmt Status",info.payment_status)
  // console.log("package", package);
  // console.log("gross",info.amount_gross)
  // console.log("Fee",info.amount_fee)
  // console.log("Nett",info.amount_net)
  // console.log("Paid Date", paidDate)



  let response = `${JSON.stringify(req.body)}`;

  // let subject = "PayFastITN";
  // let recipient = "waynebruton@icloud.com";
  // let output = response;

  let sql1 = `update clientele set expiry = '${expiry}', package = ${package}, monthly = ${monthly} where organisation = ${organisation}`
  let sql2 = `insert into paymentsReceived (organisation, pf_payment_id, payment_status, package, amount_gross, amount_fee, amount_net, payDate) values
              (${organisation},'${info.pf_payment_id}', '${info.payment_status}', ${package}, ${info.amount_gross},${info.amount_fee},${info.amount_net}, '${paidDate}')`
  let sql = `${sql1};${sql2}`
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error);
        // res.json(results.failure);
      } else {
        // res.json(result);
        // write to JSON
        console.log(result)
      }
    });
    connection.release();
  });

  // sendMail(subject, recipient, output).catch(async function(error) {
  //   console.log(error);
  //   if (error) {
  //     await console.log(error);
  //   } else {
  //     await console.log("AWESOME IT WORKED");
  //   }
  // });
}
});


module.exports = router;
