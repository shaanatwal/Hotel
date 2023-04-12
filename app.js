const express = require("express");
const path = require("path"); // root
const { getLocations, getHotelsByLocation, createCustomer,  checkCustomerUserCredentials, getHotelChainsByHotelId, getHotelIdByName,getHotelChainsByHotelName } = require("./functions");

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


app.get("/hotelChains", async (req, res) => {
  const { hotel_name } = req.query;
  try {
    const hotelChains = await getHotelChainsByHotelName(hotel_name);
    res.json(hotelChains);
  } catch (error) {
    console.error("Error fetching hotel chains:", error);
    res.status(500).json({ error: "Error fetching hotel chains" });
  }
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

