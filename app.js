const express = require("express");
const { getLocations } = require("./functions");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const locations = await getLocations();
    console.log("Locations:", locations); // Debugging line

    const options = locations
      .map((location) => `<option value="${location}">${location}</option>`)
      .join("");

    console.log("Options:", options); // Debugging line

    const form = `
      <form action="/submit" method="POST">
          <label for="location">Choose a location:</label>
          <select name="location" id="location">
              ${options}
          </select>
          <input type="submit" value="Submit">
      </form>
    `;

    res.send(form);
  } catch (error) {
    console.error("Error fetching locations:", error); // Debugging line
    res.status(500).send("Error fetching locations");
  }
});

app.post("/submit", (req, res) => {
  const selectedLocation = req.body.location;
  // Process the selected location as needed
  res.send(`Selected location: ${selectedLocation}`);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
