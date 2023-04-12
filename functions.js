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


async function getHotelsByLocation(location) {
  const query = `SELECT hotel_name FROM Hotel WHERE city = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [location], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.hotel_name);
}



module.exports = {
  getLocations,
  getHotelsByLocation,
};
