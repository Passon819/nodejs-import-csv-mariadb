const fs = require('fs')
const mysql = require('mysql')
const fastcsv = require('fast-csv')
//import 'dotenv/config' //for ES6
require('dotenv').config();

let stream = fs.createReadStream('./assets/ContactList.csv');
let csvData = []
let csvStream = fastcsv.parse().on("data",function(data){
    csvData.push(data)
}).on("end", function(){

    csvData.shift()
    console.log('csvData: '+csvData);

    // Create connection
    const connection = mysql.createConnection({
        host: 'localhost',
        port: '3307',
        user: 'root',
        password: 'Password123456',
        database: 'demo_excel'
    });

    connection.connect(err=>{
        if (err) {
            console.error(err);
        } else{
            console.log("Is Conneted Ready to query");
            let query = "INSERT INTO contact_list (BasicID, DisplayName, CorporatesID, CorporateID, Name, Email, Tel) VALUES ?";
            connection.query(query, [csvData], (err, result)=>{
                console.log(err || result);
            });
        }
    });
});

stream.pipe(csvStream);
