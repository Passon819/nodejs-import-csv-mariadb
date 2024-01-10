//Endpoint database (mariaDB) can use this
const fs = require("fs");
const mysql = require("mysql"); 
const fastcsv = require("fast-csv");
//import 'dotenv/config' //for ES6
require('dotenv').config();

let stream = fs.createReadStream("./assets/Book1.csv");
let csvData = []; // [['1','node.js','javascript runtime enviroment','2019-09-03'],[...],[...]]
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    //การเข้าถึงข้อมูลในอาเรย์
    //console.log('row1: '+csvData[0][1]);
    //console.log('row1: '+csvData[1][3]);

    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      port: "3307",
      user: "root",
      password: "Password123456",
      database: "demo_excel"
    });

    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        console.log("In query!!");
        let query =
          "INSERT INTO category (id, name, description, createdAt) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });

stream.pipe(csvStream);