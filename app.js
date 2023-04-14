const express = require("express");
const path = require("path"); // root
const { getLocations, getHotelsByLocation, createCustomer,  checkCustomerUserCredentials, getHotelChainsByHotelId, getHotelIdByName,getHotelChainsByHotelName, getHotelById, updateHotel, updateRoom, getRoomById,
  checkEmployeeUserCredentials, createEmployee,  getCapacities, getRoomViews, getAmenities, searchRooms, createBooking, removeRoom, createRoom, removeCustomer, removeHotel, createHotel, removeEmployee,createNewBooking,removeBooking, createNewRenting
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
  const {
    customer_id,
    hotel_id,
    room_number,
    check_in_date,
    check_out_date,
    price,
    amenities,
    capacity,
    room_view
  } = req.body;

  try {
    const booking = await createBooking(
      customer_id,
      hotel_id,
      room_number,
      check_in_date,
      check_out_date,
      price,
      amenities,
      capacity,
      room_view
    );

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

app.delete("/deleteroom", async (req, res) => {
  try {
    const { room_id } = req.body;
    await removeRoom(room_id);
    res.sendStatus(200);
  }
  catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Error deleting room" });
  }
});

app.delete("/deletehotel", async (req, res) => {
  try {
    const { hotel_id } = req.body;
    await removeHotel(hotel_id);
    res.sendStatus(200);
  }
  catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ error: "Error deleting hotel" });
  }
});

app.post("/addhotel", async (req, res) => {
  try {
    const {
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
      email_address,
    } = req.body;

    await createHotel(
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
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ error: "Error creating hotel" });
  }
});

app.post("/addroom", async (req, res) => {
  try {
    const { room_id, hotel_id, capacity, price, amenities, room_view, room_extended, damages } = req.body;

    // Create the room using the provided data
    await createRoom(room_id, hotel_id, capacity, price, amenities, room_view, room_extended, damages);

    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Error adding room" });
  }
});
//////new ones
app.get("/updatehotel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "UpdateHotel.html"));
});

app.get("/gethotel/:hotel_id", async (req, res) => {
  try {
    const hotel = await getHotelById(req.params.hotel_id);
    res.json(hotel);
  } catch (error) {
    console.error("Error getting hotel:", error);
    res.status(500).json({ error: "Error getting hotel" });
  }
});
///new ones
app.put("/updatehotel", async (req, res) => {
  try {
    await updateHotel(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: "Error updating hotel" });
  }
});

app.get("/updateroom", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "UpdateRoom.html"));
});

app.get("/getroom/:room_id", async (req, res) => {
  try {
    const room = await getRoomById(req.params.room_id);
    res.json(room);
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(500).json({ error: "Error getting room" });
  }
});

app.put("/updateroom", async (req, res) => {
  try {
    await updateRoom(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Error updating room" });
  }
});

// THIS IS THE ONE FOR AddBooking.html
app.post("/addbooking", async (req, res) => {
  try {
    const {
      booking_id,
      room_id,
      employee_id,
      customer_id,
      capacity,
      price,
      amenities,
      room_view,
      room_extended,
      start_date,
      end_date,
      num_days,
    } = req.body;

    await createNewBooking(
      booking_id,
      room_id,
      employee_id,
      customer_id,
      capacity,
      price,
      amenities,
      room_view,
      room_extended,
      start_date,
      end_date,
      num_days
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating new booking:", error);
    res.status(500).json({ error: "Error creating new booking" });
  }
});

app.delete("/deletebooking", async (req, res) => {
  try {
    const { booking_id } = req.body;
    await removeBooking(booking_id);
    res.sendStatus(200);
  }
  catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Error deleting booking" });
  }
});

// THIS IS THE ONE FOR AddRenting.html
app.post("/addrenting", async (req, res) => {
  try {
    const {
      renting_id,
      booking_id,
      employee_id,
      customer_id,
      room_id,
      capacity,
      price,
      amenities,
      room_view,
      room_extended,
      start_date,
      end_date,
      num_days,
      payment,
      additional_charges
    } = req.body;

    await createNewRenting(
      renting_id,
      booking_id,
      employee_id,
      customer_id,
      room_id,
      capacity,
      price,
      amenities,
      room_view,
      room_extended,
      start_date,
      end_date,
      num_days,
      payment,
      additional_charges
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error creating new booking:", error);
    res.status(500).json({ error: "Error creating new booking" });
  }
});
