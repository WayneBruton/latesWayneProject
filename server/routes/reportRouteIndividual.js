const express = require("express");
const router = express.Router();
const pool = require("./connection");
// const nodemailer = require("nodemailer");
// const fs = require("fs");
const moment = require("moment");
// var Report = require("../lib/fluentReports").Report;
var Report = require("fluentreports").Report;
var primary_data = [];
var secondary_data = {};
var header_data = [];
var fileName;

router.put("/printIndividualReport", (req, res) => {
  primary_data = [];
  secondary_data = {};
  header_data = [];
  let header = {
    name: req.body.name,
  };
  header_data.push(header);

  let sql = `select * from staffTypes where organisation = ${req.body.organisation}`;
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
        result.forEach((el, index) => {
          let insertPrimary = {
            id: el.id,
            name: el.staff_description,
          };
          if (index === 0) {
            primary_data.push(insertPrimary);
          } else if (el.id === req.body.staffType) {
            primary_data.push(insertPrimary);
          }
        });
        let stafftypes = primary_data.slice(0, 2).map((el) => el.id);
        primary_data.push({ id: 99, name: "Personal Documents" });
        //ALL STAFF
        let sql1 = `select p.id, p.policyName, p.createdAt, p.appliesTo from  policies p
        where  JSON_CONTAINS(p.appliesTo, '${stafftypes[0]}') and p.organisation = ${req.body.organisation}`;
        // STAFF TYPE
        let sql2 = `select p.id, p.policyName, p.createdAt, p.appliesTo from  policies p
        where  JSON_CONTAINS(p.appliesTo, '${stafftypes[1]}') and p.organisation = ${req.body.organisation}`;
        //POLICIES READ
        let sql3 = `select policyRead, readAt from policiesRead where user = ${req.body.id}`;
        //Staff Documents
        let sql4 = `select * from staffDocuments where users = ${req.body.id}`;
        let finalsql = `${sql1};${sql2};${sql3};${sql4}`;
        connection.query(finalsql, function (error, result) {
          if (error) {
            console.log(error);
            res.json({ error: "error connecting to the database" });
          } else {
            let arr1 = [];
            let arr2 = [];
            let arr3 = result[1];
            result[0].forEach((el) => {
              el.appliesTo = JSON.parse(el.appliesTo);
              if (el.appliesTo.includes(stafftypes[0])) {
                el.appliesTo = stafftypes[0];
              }
              let id = el.id;
              let filter = result[2].filter((el2) => {
                return el2.policyRead === id;
              });
              if (filter.length) {
                el.policyRead = "Yes";
                el.readAt = moment(filter[0].readAt).format(
                  "Do MMM YYYY HH:mm"
                );
              } else {
                el.policyRead = "No";
                el.readAt = null;
              }
              let insertData = {
                policyName: el.policyName,
                policyRead: el.policyRead,
                readAt: el.readAt,
              };
              arr1.push(insertData);
            });
            result[1].forEach((el) => {
              el.appliesTo = JSON.parse(el.appliesTo);
              if (el.appliesTo.includes(stafftypes[1])) {
                el.appliesTo = stafftypes[1];
              }
              let id = el.id;
              let filter = result[2].filter((el2) => {
                return el2.policyRead === id;
              });
              if (filter.length) {
                el.policyRead = "Yes";
                el.readAt = moment(filter[0].readAt).format(
                  "Do MMM YYYY HH:mm"
                );
              } else {
                el.policyRead = "No";
                el.readAt = null;
              }
              let insertData = {
                policyName: el.policyName,
                policyRead: el.policyRead,
                readAt: el.readAt,
              };
              arr2.push(insertData);
            });
            arr3 = [];
            result[3].forEach((el) => {
              if (el.readDocument === 1) {
                el.readDocument = "Yes";
                el.dateRead = moment(el.dateRead).format("Do MMM YYYY HH:mm");
              } else {
                (el.readDocument = "No"), (el.dateRead = null);
              }
              let insertData = {
                policyName: el.documentNameName,
                policyRead: el.readDocument,
                readAt: el.dateRead,
                // readAt: moment(el.dateRead).format("Do MMM YYYY")
              };
              arr3.push(insertData);
            });
            secondary_data[`${stafftypes[0]}`] = arr1;
            secondary_data[`${stafftypes[1]}`] = arr2;
            secondary_data[
              `${primary_data[primary_data.length - 1].id}`
            ] = arr3;
            let now = Math.floor(Math.random() * 100000000);
            //   let now = new Date();
            fileName = `Individual Report - ${now}.pdf`;

            printreport().then(() => {
              setTimeout(() => {
                return res.json({
                  url: `${process.env.homeURL}${process.env.CLIENT_REPORTS}${fileName}`,
                });
              }, 300);
            });
          }
        });
      }
    });
    connection.release();
  });
});
// We are going to pretend that we are running queries to get this data.  ;-)
function sql_select(query) {
  "use strict";
  if (query === 0 || query == null) {
    return primary_data;
  }
  if (secondary_data[query]) {
    return secondary_data[query];
  }
  return [];
}

async function printreport() {
  "use strict";
  var counter = 0;
  var daydetail = function (report, data) {
    counter++;
    report.band(
      [
        { data: "", width: 15 },
        { data: data.policyName, width: 180 },
        {
          data: `Read: ${data.policyRead}`,
          width: 120,
          align: 3,
          textColor: data.policyRead === "No" ? "#FF0000" : "#000000",
        },
        {
          data: data.readAt !== null ? `${data.readAt}` : "",
          width: 120,
          align: 3,
          textColor: data.totalPercent < 75 ? "#FF0000" : "#000000",
        },
      ],
      {
        border: 0,
        width: 0,
        wrap: 1,
        fill: counter % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
        // textColor: "#0000ff"
        textColor: "black",
      }
    );
  };

  var nameFooter = function (report, data) {
    report.band([
      ["Totals for " + data.name, 180],
      // [data.totalDocs, 100, 3]
      [report.totals.totalDocs, 100, 3],
    ]);
    report.newLine();
    //   report.newLine();
  };

  var nameHeader = function (report, data) {
    report.print(data.name, {
      fontBold: true,
      // fill: "black",
      fill: "#6f6f6f",
      textColor: "#ffffff",
      link: "http://www.eccentrictoad.com/",
    });
    // report.print("Read", {
    //   fontBold: true,
    //   width: 100,
    //   align: 3,
    //   fill: "#6f6f6f",
    //   textColor: "#ffffff",
    //   link: "http://www.eccentrictoad.com/"
    // });
    report.newLine();
  };

  var weekDetail = function (report, data) {
    // We could do this -->  report.setCurrentY(report.getCurrentY()+2);   Or use the shortcut below of addY: 2
    report.print(["Report Type: " + data.reportType], { x: 100, addY: 2 });
    //   report.newLine()
  };

  var totalFormatter = function (data, callback) {
    if (data.totalDocs) {
      data.totalDocs = ": " + data.totalDocs;
    }
    callback(null, data);
  };

  var reportName = `public/uploads/${fileName}`;
  var results = sql_select(0);

  var repTitle = function (report, data) {
    var tit = [`${header_data[0].name}`];
    var tit2 = [
      `Printed at: ${moment(new Date()).format("Do MMM YYYY HH:mm")}`,
    ];
    report.print(tit2, {
      fontBold: false,
      fontSize: 7,
      align: "left",
      textColor: "black",
      underline: false,
    });
    report.print(tit, {
      fontBold: true,
      fontSize: 16,
      align: "center",
      textColor: "red",
      underline: true,
    });
    report.newLine();
    report.newLine();
  };

  var rpt = new Report(reportName)
    .autoPrint(false) // Optional
    .fullScreen(false) // Optional
    .pageHeader(repTitle) // Optional
    .pageFooter(["Printed by PerfectStaff"])
    // .pageHeader(["Policy Adherance Report"]) // Optional
    .pageHeader(repTitle) // Optional
    //   .finalSummary(["Total Hours:", "totalDocs", 3]) // Optional
    .userdata({ hi: 1 }) // Optional
    .data(results) // REQUIRED
    // .totalFormatter(totalFormatter) // Optional
    .fontSize(8); // Optional

  var subRpt = new Report(rpt)
    .data(sql_select)
    //   .data(secondary_data)
    .keys(["id"])
    .detail(daydetail)
    .sum("hours");

  rpt.groupBy("name").header(nameHeader);
  // .footer(nameFooter);
  // .footer(["Printed by PerfectStaff"]);

  subRpt
    .groupBy("reportType")
    // .header(weekDetail)
    .footer(function (Rpt) {
      Rpt.print("\n");
    });

  // Debug output is always nice (Optional, to help you see the structure)
  // rpt.printStructure();

  // This does the MAGIC...  :-)
  console.time("Rendered");
  rpt.render(function (err, name) {
    console.timeEnd("Rendered");
    //   displayReport(err, name);
  });
}

module.exports = router;
