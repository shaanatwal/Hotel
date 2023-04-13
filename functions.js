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
  const query = `SELECT hotel_name, hotel_id FROM Hotel WHERE city = ? AND category_hotel = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [location, rating], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => ({ name: row.hotel_name, id: row.hotel_id }));
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


async function checkCustomerUserCredentials(username, password) {
  const sql = "SELECT customer_id FROM Customer WHERE customer_username = ? AND customer_password = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, password], (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log("SQL results:", results); // Debug statement
      
      if (results.length > 0) {
        const customerId = results[0].customer_id;
        resolve(customerId);
      } else {
        resolve(null);
      }
    });
  });
}

async function getHotelChainsByHotelName(hotelName) {
  const query = `SELECT chain_name FROM Hotel_Chain JOIN Hotel ON Hotel_Chain.chain_id = Hotel.chain_id WHERE Hotel.hotel_name = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotelName], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.chain_name);
}



async function getHotelIdByName(hotelName) {
  const query = `SELECT hotel_id FROM Hotel WHERE hotel_name = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotelName], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results[0].hotel_id;
}

async function createEmployee(
  username,
  password,
  SSN,
  hotel_id,
  hotel_name,
  employee_name,
  street_number,
  street_name,
  city,
  province,
  job_role,
) {
  const employee_id = Math.floor(Math.random() * 1000000);

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Employee (employee_id, employee_username, employee_password, SSN, hotel_id, hotel_name, employee_name, street_number, street_name, city, province, job_role)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [
      employee_id,
      username,
      password,
      SSN,
      hotel_id,
      hotel_name,
      employee_name,
      street_number,
      street_name,
      city,
      province,
      job_role,
    ], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function checkEmployeeUserCredentials(username, password) {
  const sql2 = "SELECT * FROM Employee WHERE employee_username = ? AND employee_password = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql2, [username, password], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.length > 0);
    });
  });
}

async function getHotelChainsByHotelId(hotelId) {
  const query = `SELECT chain_name FROM Hotel_Chain JOIN Hotel ON Hotel_Chain.chain_id = Hotel.chain_id WHERE Hotel.hotel_id = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotelId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.chain_name);
}

async function getRoomViews(hotel_id) {
  const query = `SELECT DISTINCT room_view FROM Room WHERE hotel_id = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotel_id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.room_view);
}

async function getCapacities(hotel_id) {
  const query = `SELECT DISTINCT capacity FROM Room WHERE hotel_id = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotel_id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.capacity);
}

async function getAmenities(hotel_id) {
  const query = `SELECT DISTINCT amenities FROM Room WHERE hotel_id = ?`;
  const results = await new Promise((resolve, reject) => {
    connection.query(query, [hotel_id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  return results.map((row) => row.amenities);
}

async function searchRooms(hotelId, capacity, amenities, roomView, extended) {
  const query = `
    SELECT *
    FROM Room
    WHERE hotel_id = ?
      AND capacity = ?
      AND amenities = ?
      AND room_view = ?
      AND room_extended = ?
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, [hotelId, capacity, amenities, roomView, extended], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

async function createBooking(customerId, roomId, capacity, price, amenities, roomView, roomExtended, startDate, endDate, numberOfDays) {
  const bookingId = Math.floor(Math.random() * 1000000);

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Booking
        (booking_id, room_id, customer_id, capacity, price, amenities, room_view, room_extended, start_date, end_date, number_of_days)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(sql, [
      bookingId,
      roomId,
      customerId,
      capacity,
      price,
      amenities,
      roomView,
      roomExtended,
      startDate,
      endDate,
      numberOfDays
    ], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function removeEmployee (employee_id) {
  const sql = "DELETE FROM Employee WHERE employee_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [employee_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function removeCustomer (customer_id) {
  const sql = "DELETE FROM Customer WHERE customer_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [customer_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function removeRoom(room_id) {
  const sql = "DELETE FROM Room WHERE room_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [room_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function removeHotel(hotel_id) {
  const sql = "DELETE FROM Hotel WHERE hotel_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [hotel_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function createHotel(
  hotel_id,
  chain_id,
  hotel_name,
  street_number,
  street_name,
  building_number,
  city,
  province,
  zip,
  category_hotel,
  number_of_rooms,
  phone_number,
  email_address
) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Hotel (hotel_id, chain_id, hotel_name, street_number, street_name, building_number, city, province, zip, category_hotel, number_of_rooms, phone_number, email_address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [
      hotel_id,
      chain_id,
      hotel_name,
      street_number,
      street_name,
      building_number,
      city,
      province,
      zip,
      category_hotel,
      number_of_rooms,
      phone_number,
      email_address
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
  checkCustomerUserCredentials,
  getHotelChainsByHotelName,
  getHotelIdByName,
  createEmployee,
  checkEmployeeUserCredentials,
  getHotelChainsByHotelId,
  getRoomViews,
  getCapacities,
  getAmenities,
  searchRooms,
  createBooking,
  removeCustomer,
  removeEmployee,
  removeRoom,
  removeHotel,
  createHotel
};


