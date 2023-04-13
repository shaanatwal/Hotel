document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
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

  const bookRoomForm = document.getElementById("Book_Room");
  bookRoomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const roomId = document.getElementById("book-id").value;
    const checkInDate = urlParams.get("checkin");
    const checkOutDate = urlParams.get("checkout");
    const customerId = localStorage.getItem("customerId");
    const price = urlParams.get("price");
    const amenities =urlParams.get("amenities");
    const capacity = urlParams.get("capacity");

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
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          price: price,
          amenities: amenities,
          capacity: capacity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Redirect to the main page after booking
        window.location.href = "/MainPage.html";
      } else {
        console.error("Error creating booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  });
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
      alert('Booking Created');
      const customerId = localStorage.getItem("customerId");
      const roomId = btn.dataset.roomId;
      const hotelId = btn.dataset.hotelId;
      const startDate = urlParams.get("checkin");
      const endDate = urlParams.get("checkout");
      const price = await getPrice(roomId, startDate, endDate);
      const amenities = await getAmenitiesByRoomId(roomId);
      const capacity = await getCapacityByRoomId(roomId);
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
    });
  });
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

async function getAmenitiesByRoomId(roomId) {
  try {
    const response = await fetch(`/rooms/${roomId}/amenities`);
    if (response.ok) {
      const data = await response.json();
      return data.amenities;
    } else {
      console.error("Error getting room amenities");
    }
  } catch (error) {
    console.error("Error getting room amenities:", error);
  }
}

async function getCapacityByRoomId(roomId) {
  try {
    const response = await fetch(`/rooms/${roomId}/capacity`);
    if (response.ok) {
      const data = await response.json();
      return data.capacity;
    } else {
      console.error("Error getting room capacity");
    }
  } catch (error) {
    console.error("Error getting room capacity:", error);
  }
}
