const connection = require("./db_config");

function getLocations() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT city FROM Hotel";
    connection.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.map((row) => row.city));
    });
  });
}

module.exports = {
  getLocations,
};
