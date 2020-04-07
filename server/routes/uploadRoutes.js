const express = require("express");
const router = express.Router();
const pool = require("./connection");
const multer = require("multer");
const fs = require("fs");
const aws = require("aws-sdk");
const base64 = require("base64topdf");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: "eu-central-1"
});

const s3 = new aws.S3();
// const BUCKET = "eccentrictoadperfectstaffbucket";

const fileFilter = function(req, file, cb) {
  const allowedTypes = ["application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

let MAX_SIZE = 10000000;
const upload = multer({
  // dest: "./public/uploads/",
  dest: `${process.env.POLICY_INITIAL_UPLOADS}`,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

const getSignedUrlForDownload = async (filePath, key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Expires: 60 * 2
  };

  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) reject(err);

      resolve(url);
    });
  });

  return url;
};

const downloadFile = (filePath, key, callback) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };

  s3.getObject(params, (err, data) => {
    if (err) console.error(err);

    base64.base64Decode(data.Body.toString("base64"), filePath);

    callback();
  });
};

const deleteFile = fileName => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName
  };
  try {
    s3.deleteObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else console.log("Response Deleted!!", data);
    });
  } catch (e) {
    Console.log("Error with proces!!");
  }
};

router.post("/uploadfile", upload.single("file"), (req, res) => {
  const description = req.body.description;
  let staffAffected = req.body.staffAffected;
  let size = req.file.size;
  let now = Date.now();
  let nameOfFile = req.body.FileName;
  let organisationID = req.body.organisationID;
  let fileName4Policies = `${now}-${req.file.filename}`;
  const fileContent = fs.readFileSync(req.file.path);
  console.log(req.body)
  console.log(req.file)
  console.log("HELLOOO")
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${now}-${req.file.filename}`,
    Body: fileContent
  };
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    fs.unlinkSync(`${req.file.path}`, function(err) {
      console.log(err);
    });

    let sql = `insert into policies (policyName, policyLink, description, appliesTo, organisation, policySize) values
              ("${nameOfFile}","${fileName4Policies}","${description}","[${staffAffected}]", ${organisationID}, ${size})`;
    console.log(sql)
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
});

router.put("/viewDoc", (req, res) => {
  // console.log("THE URL",req.body.URL)
  let filePath = `public/${req.body.URL}.pdf`;
  let key = req.body.URL;

  getSignedUrlForDownload(filePath, key)
    .then(url => {
      console.log(url)
      res.json({ download: "Successfull", url: url });
    })
    .catch(e => {
      console.log(e);
    });
});

//REMOVE FROM MY SERVER
router.put("/removeDoc", (req, res) => {
  let fileToRemove = req.body.url.split("/");
  fileToRemove = fileToRemove[fileToRemove.length - 1];

  fs.unlinkSync(`public/${fileToRemove}`, function(err) {
    console.log(err);
  });
});

router.put("/deletePolicy", (req, res) => {
  let sql1 = `delete from policiesRead where policyRead = ${req.body.id}`;
  let sql2 = `delete from policies where id = ${req.body.id}`;
  let sql = `${sql1};${sql2}`;
  let results = { success: true, failure: false };
  deleteFile(req.body.policyLink);
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

router.put("/deletePolicyFromCategory", (req, res) => {
  let sql = `update policies set appliesTo = "[${req.body.appliesTo}]" where id = ${req.body.id}`;

  let results = { success: true, failure: false };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        res.json(results.failure);
      } else {
        res.json(results.success);
      }
    });
    connection.release();
  });
});

//EMPLOYEES

router.post("/uploadEmployeefile", upload.single("file"), (req, res) => {
  let size = req.file.size;
  let description = req.body.description;
  let staffAffected = req.body.staffID;

  let fileType = req.file.mimetype.split("/")[1];
  let nameOfFile = req.body.FileName;
  let organisationID = req.body.organisationID;
  let documentType = req.body.documentType;
  let now = Date.now();
  let fileName4Document = `${now}-${req.file.filename}`;
  const fileContent = fs.readFileSync(req.file.path);
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${now}-${req.file.filename}`,
    Body: fileContent
  };
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    fs.unlinkSync(`${req.file.path}`, function(err) {
      console.log(err);
    });

    let sql = `insert into staffDocuments (documentNameName, documentLinkLink, documentDescription, users, organisation, documentType, documentSize) values
              ("${nameOfFile}","${fileName4Document}","${description}",${staffAffected}, ${organisationID}, ${documentType}, ${size} )`;

    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        resizeBy.send("Error with connection");
      }
      connection.query(sql, function(error, result) {
        if (error) {
          res.json({ error: "error posting to database" });
        } else {
          res.json({ success: "Successfully uploaded document" });
        }
      });
      connection.release();
    });
  });
});

router.put("/deleteDocument", (req, res) => {
  let sql = `delete from staffDocuments where id = ${req.body.id}`;
  let results = { success: true, failure: false };
  deleteFile(req.body.DocumentLink);
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

router.post("/createUser", (req, res) => {
  let sql1 = `INSERT INTO users (email, password, fname, lname, userType, jobTitle, organisation, staffType) values
              ('${req.body.emailUser}', '#', '${req.body.fname}', '${req.body.lname}', ${req.body.userType}, '${req.body.jobTitle}', ${req.body.organisationID}, ${req.body.staffType})`;
  let sql2 = `SELECT u.id, u.userType , u.organisation, u.email, u.fname, u.lname, o.organisationName  FROM users u, organisation o  where u.organisation = ${req.body.organisationID} and u.email = '${req.body.emailUser}' and u.organisation = o.id`;
  let sql = `${sql1};${sql2}`;

  let results = { success: true, failure: false, duplicate: null };
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      resizeBy.send("Error with connection");
    }
    connection.query(sql, function(error, result) {
      if (error) {
        console.log(error.code);
        if (error.code === "ER_DUP_ENTRY") {
          res.json(results.duplicate);
        } else {
          res.json(results.failure);
        }
      } else {
        res.json(results.success);
      }
    });
    connection.release();
  });
});

module.exports = router;
