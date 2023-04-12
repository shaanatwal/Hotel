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

async function createCustomer(
  username,
  password,
  SSN,
  name,
  streetnumber,
  streetname,
  buildingnumber,
  city,
  province,
  zip
) {
  const customer_id = Math.floor(Math.random() * 1000000);
  const booking_id = null;
  const renting_id = null;
  const date_of_registration = new Date().toISOString().slice(0, 10);

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Customer (customer_id, customer_username, customer_password, booking_id, renting_id, SSN, customer_name, street_number, street_name, building_number, city, province, zip, date_of_registration)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [
      customer_id,
      username,
      password,
      booking_id,
      renting_id,
      SSN,
      name,
      streetnumber,
      streetname,
      buildingnumber,
      city,
      province,
      zip,
      date_of_registration
    ], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}


module.exports = {
  getLocations,
  getHotelsByLocation,
  createCustomer,
};


