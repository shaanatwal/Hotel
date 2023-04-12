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


// Update the getHotelsByLocation function to include the rating parameter:
async function getHotelsByLocation(location, rating) {
  const query = `SELECT hotel_name FROM Hotel WHERE city = ? AND category_hotel = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [location, rating], (err, results) => {
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
