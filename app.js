const express = require("express");
const path = require("path"); // root
const { getLocations, getHotelsByLocation } = require("./functions");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "MainPage.html"));
});

app.post("/submit", (req, res) => {
  const selectedLocation = req.body.location;
  // Process the selected location as needed
  res.send(`Selected location: ${selectedLocation}`);
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

// retrieves all hotels that exist in a specified city
app.get("/hotels", async (req, res) => {
  const { location } = req.query;
  try {
    const hotels = await getHotelsByLocation(location);
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Error fetching hotels" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

