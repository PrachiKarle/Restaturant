var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restoran",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

conn.connect((err, data) => {
  if (!err) {
    console.log("Connect Successfully");
  } else {
    console.log(err);
  }
});

var util = require("util");
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
