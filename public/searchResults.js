const urlParams = new URLSearchParams(window.location.search);

document.addEventListener("DOMContentLoaded", async () => {
  displayUrlParameters(urlParams);
  console.log(urlParams.getAll);

  const hotelId = urlParams.get("hotel_id");
  const capacity = urlParams.get("capacity");
  const amenities = urlParams.get("amenities");
  const roomView = urlParams.get("room_view");
  const extended = urlParams.get("extended") === "yes" ? 1 : 0;

  try {
    const response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hotelId, capacity, amenities, roomView, extended }),
    });

    if (response.ok) {
      const rooms = await response.json();
      displayRooms(rooms);
      populateRoomDropdown(rooms);
    } else {
      console.error("Error searching rooms");
    }
  } catch (error) {
    console.error("Error searching rooms:", error);
  }
});

function displayRooms(rooms) {
  const resultsContainer = document.getElementById("results-container");
  rooms.forEach((room) => {
    const roomElement = document.createElement("div");
    roomElement.innerHTML = `
      <h3>Room ${room.room_id}</h3>
      <p>Capacity: ${room.capacity}</p>
      <p>Amenities: ${room.amenities}</p>
      <p>Room View: ${room.room_view}</p>
      <p>Extended: ${room.room_extended ? "Yes" : "No"}</p>
      <p>Price $: ${room.price}</p>
      <button class="book-room-btn" data-room-id="${room.room_id}" data-hotel-id="${room.hotel_id}">Book Room</button>
    `;
    resultsContainer.appendChild(roomElement);
  });

// Add event listener to book room buttons
const bookRoomBtns = document.querySelectorAll(".book-room-btn");
bookRoomBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const roomId = rooms[0].room_id;
    const firstRoomPrice = rooms[0].price;
    createBooking(roomId, firstRoomPrice);
  });
});

}

async function createBooking(roomId,price) {
  const startDate = urlParams.get("checkin");
  const endDate = urlParams.get("checkout");
  const customerId = localStorage.getItem("customerId");
  const hotelId = urlParams.get("hotel_id");
  const capacity = urlParams.get("capacity");
  const amenities = urlParams.get("amenities");
  const roomView = urlParams.get("room_view");

  try {
    const response = await fetch("/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerId,
        hotel_id: hotelId,
        room_number: roomId,
        check_in_date: startDate,
        check_out_date: endDate,
        price: price,
        amenities: amenities,
        capacity: capacity,
        room_view: roomView
      }),
    });
    if (response.ok) {
      const data = await response.json();
      alert('Booking Created');
    } else {
      console.error("Error creating booking");
    }
  } catch (error) {
    console.error("Error creating booking:", error);
  }
}


async function getPrice(roomId, startDate, endDate) {
  try {
    const response = await fetch(`/rooms/${roomId}/price?start_date=${startDate}&end_date=${endDate}`);
    if (response.ok) {
      const data = await response.json();
      return data.price;
    } else {
      console.error("Error getting room price");
    }
  } catch (error) {
    console.error("Error getting room price:", error);
  }
}

function displayUrlParameters(urlParams) {
  const resultsContainer = document.getElementById("results-container");

  const urlParamsList = document.createElement("ul");
  urlParamsList.innerHTML = `
    <li>Hotel Chain: ${urlParams.get("hotel_chain")}</li>
    <li>Check-in: ${urlParams.get("checkin") || "Not provided"}</li>
    <li>Check-out: ${urlParams.get("checkout") || "Not provided"}</li>
    <li>Price Min: ${urlParams.get("price_min") || "Not provided"}</li>
    <li>Price Max: ${urlParams.get("price_max") || "Not provided"}</li>
    <li>Amenities: ${urlParams.get("amenities").replace(/\+/g, ' ').replace(/%2C/g, ', ')}</li>
    <li>Room View: ${urlParams.get("room_view").replace(/\+/g, ' ')}</li>
    <li>Capacity: ${urlParams.get("capacity")}</li>
    <li>Extended: ${urlParams.get("extended") === "yes" ? "Yes" : "No"}</li>
    <li>Hotel ID: ${urlParams.get("hotel_id")}</li>
    <li>Customer ID: ${urlParams.get("customerId")}</li>
  `;
  resultsContainer.appendChild(urlParamsList);
}
