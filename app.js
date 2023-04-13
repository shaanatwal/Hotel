const express = require("express");
const path = require("path"); // root
const { getLocations, getHotelsByLocation, createCustomer,  checkCustomerUserCredentials, getHotelChainsByHotelId, getHotelIdByName,getHotelChainsByHotelName, 
  checkEmployeeUserCredentials, createEmployee, getCapacities, getRoomViews, getAmenities, searchRooms, createBooking, removeCustomer, removeEmployee
 } = require("./functions");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "MainPage.html"));
});

app.post("/submit", (req, res) => {
  const selectedLocation = req.body.location;
  // Process the selected location as needed
  res.send(`Selected location: ${selectedLocation}`);
});

app.post("/employeesignup", async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Create the employee using the provided data
    await createEmployee(
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
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Error creating employee" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const {
      username,
      password,
      SSN,
      name,
      streetnumber,
      streetname,
      buildingnumber,
      city,
      province,
      zip,
    } = req.body;

    await createCustomer(
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
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Error creating customer" });
  }
});



// retrieves all unique city names
app.get("/locations", async (req, res) => {
  try {
    const locations = await getLocations();
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
});

// gets a hotel by its city
// new: AND rating aswell.
app.get("/hotels", async (req, res) => {
  const { location, rating } = req.query;
  try {
    const hotels = await getHotelsByLocation(location, parseInt(rating, 10));
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Error fetching hotels" });
  }
});

app.post("/logincustomer", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isAuthenticated = await checkCustomerUserCredentials(username, password);
    res.status(200).json({ isAuthenticated });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Error authenticating user" });
  }
});

app.post("/loginemployee", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isAuthenticated = await checkEmployeeUserCredentials(username, password);
    res.status(200).json({ isAuthenticated });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Error authenticating user" });
  }
});


app.get("/hotelChains", async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const hotelChains = await getHotelChainsByHotelId(hotel_id);
    res.json(hotelChains);
  } catch (error) {
    console.error("Error fetching hotel chains:", error);
    res.status(500).json({ error: "Error fetching hotel chains" });
  }
});


app.get("/roomViews", async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const roomViews = await getRoomViews(hotel_id);
    res.json(roomViews);
  } catch (error) {
    console.error("Error fetching room views:", error);
    res.status(500).json({ error: "Error fetching room views" });
  }
});

app.get("/capacities", async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const capacities = await getCapacities(hotel_id);
    res.json(capacities);
  } catch (error) {
    console.error("Error fetching capacities:", error);
    res.status(500).json({ error: "Error fetching capacities" });
  }
});

app.get("/amenities", async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const amenities = await getAmenities(hotel_id);
    res.json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Error fetching amenities" });
  }
});


app.post("/search", async (req, res) => {
  const { hotelId, capacity, amenities, roomView, extended } = req.body;
  try {
    const rooms = await searchRooms(hotelId, capacity, amenities, roomView, extended);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ error: "Error searching rooms" });
  }
});

app.post("/bookings", async (req, res) => {
  const { customer_id, hotel_id, room_number, check_in_date, check_out_date } = req.body;

  try {
    // Create a new booking using the provided data
    // This is just an example and should be modified to fit your specific database schema
    const booking = await createBooking(customer_id, hotel_id, room_number, check_in_date, check_out_date);

    // Send a success response back to the client
    res.status(200).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Error creating booking" });
  }
});

app.delete("/deleteemployee", async (req, res) => {
  try {
    const { employee_id } = req.body;
    await removeEmployee(employee_id);
    res.sendStatus(200);
  }
  catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Error deleting employee" });
  }
});


app.delete("/deletecustomer", async (req, res) => {
  try {
    const { customer_id } = req.body;
    await removeCustomer(customer_id);
    res.sendStatus(200);
  }
  catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Error deleting customer" });
  }
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
