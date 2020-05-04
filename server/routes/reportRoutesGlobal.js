const express = require("express");
const router = express.Router();
// const pool = require("./connection");
// const nodemailer = require("nodemailer");
const fs = require("fs");
const moment = require("moment");
// var Report = require("../lib/fluentReports").Report;
var Report = require("fluentreports").Report;
var primary_data = [];
var secondary_data = {};
var fileName;

router.put("/printGlobalReport", (req, res) => {
  primary_data = [];
  secondary_data = {};
  req.body.forEach((el, index) => {
    let data1 = {
      id: el.id,
      name: `${el.lname} ${el.fname}`,
    };
    primary_data.push(data1);
    secondary_data[`${el.id}`] = [
      {
        reportType: "policy",
        total: `Total Policies: ${el.totalPolicies}`,
        read: `Number Read: ${el.policiesRead}`,
        percent: `Read Percent: ${el.policiesReadPercent} %`,
        totalDocs: el.totalPolicies,
        totalRead: el.policiesRead,
        totalPercent: el.policiesReadPercent,
      },
      {
        reportType: "staff",
        total: `Total Documents: ${el.staffDocsTotal}`,
        read: `Number Read: ${el.staffDocsRead}`,
        percent: `Read Percent: ${el.staffDocsReadPercentage} %`,
        totalDocs: el.staffDocsTotal,
        totalRead: el.staffDocsRead,
        totalPercent: el.staffDocsReadPercentage,
      },
    ];
  });
  let now = Math.floor(Math.random() * 100000000);
  //   let now = new Date();
  fileName = `Group Report - ${now}.pdf`;

  printreport().then(() => {
    setTimeout(() => {
      return res.json({
        url: `${process.env.homeURL}${process.env.CLIENT_REPORTS}${fileName}`,
      });
    }, 300);
  });
});

router.put("/removeReport", (req, res) => {
  fs.unlink(`public/${req.body.rep}`, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("File Deleted");
  });
  res.json({ done: "Alright!!" });
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
        { data: data.total, width: 160 },
        {
          data: data.read,
          width: 125,
          align: 3,
          textColor: data.totalRead <= 0 ? "#FF0000" : "#000000",
        },
        {
          data: data.percent,
          width: 125,
          align: 3,
          textColor: data.totalPercent < 75 ? "#FF0000" : "#000000",
        },
      ],
      {
        border: 0,
        width: 0,
        wrap: 0,
        fill: counter % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
        textColor: "#0000ff",
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
      link: "http://www.fluentReports.com/",
    });
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
    var tit = ["Policy Adherance Report"];
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
    .header(weekDetail)
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
