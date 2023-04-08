console.log("Hello World");
// Function to populate the dropdown list with locations
function populateLocations() {
	const locationSelect = document.getElementById("location");
	// Make a request to the server using PHP to fetch the locations data
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "getLocations.php", true);
	xhr.onload = function () {
		if (xhr.status === 200) {
			const locations = JSON.parse(xhr.responseText);
			for (let i = 0; i < locations.length; i++) {
				const option = document.createElement("option");
				option.value = locations[i].id;
				option.text = locations[i].name;
				locationSelect.add(option);
			}
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.onerror = function () {
		console.error(xhr.statusText);
	};
	xhr.send();
}

// Function to handle the search button click
function getHotels() {
	const locationSelect = document.getElementById("location");
	const locationId = locationSelect.value;
	const checkin = document.getElementById("checkin").value;
	const checkout = document.getElementById("checkout").value;
	if (locationId && checkin && checkout) {
		// Make a request to the server using PHP to fetch the hotels data
		const url = `getHotels.php?locationId=${locationId}&checkin=${checkin}&checkout=${checkout}`;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onload = function () {
			if (xhr.status === 200) {
				const hotels = JSON.parse(xhr.responseText);
				displayHotels(hotels);
			} else {
				console.error(xhr.statusText);
			}
		};
		xhr.onerror = function () {
			console.error(xhr.statusText);
		};
		xhr.send();
	}
}

// Populate the dropdown list with locations when the page loads
populateLocations();

var slider = document.getElementById("myRange");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
	output.innerHTML = this.value;
};
