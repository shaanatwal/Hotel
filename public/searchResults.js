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
      `;
      resultsContainer.appendChild(roomElement);
    });
  }
  
  function populateRoomDropdown(rooms) {
    const dropdown = document.getElementById("book-id");
    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.room_id;
      option.textContent = `Room ${room.room_id}`;
      dropdown.appendChild(option);
    });
  }
  