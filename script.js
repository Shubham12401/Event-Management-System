document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("create-event-form");
  const eventItems = document.getElementById("event-items");
  const rsvpForm = document.getElementById("rsvp-event-form");
  const rsvpEventSelect = document.getElementById("rsvp-event");

  // Load events from localStorage
  let events = JSON.parse(localStorage.getItem("events")) || [];

  // Function to render the event list
  function renderEvents() {
    eventItems.innerHTML = "";
    rsvpEventSelect.innerHTML = "";
    events.forEach((event, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");

      li.innerHTML = `
                ${event.name} - ${event.date} at ${event.time}
                <span class="btn-delete" data-index="${index}">Delete</span>
            `;

      eventItems.appendChild(li);

      // Add to RSVP dropdown
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${event.name} - ${event.date}`;
      rsvpEventSelect.appendChild(option);
    });
  }

  // Function to delete an event
  eventItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.getAttribute("data-index");
      events.splice(index, 1);
      localStorage.setItem("events", JSON.stringify(events));
      renderEvents();
    }
  });

  // Create new event
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventName = document.getElementById("event-name").value;
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value;

    const newEvent = {
      name: eventName,
      date: eventDate,
      time: eventTime,
    };

    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    renderEvents();

    // Reset form
    eventForm.reset();
  });

  // RSVP to event
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventIndex = rsvpEventSelect.value;
    const userEmail = document.getElementById("rsvp-email").value;

    const rsvpData = {
      event: events[eventIndex],
      email: userEmail,
    };

    // Send RSVP to backend
    const response = await fetch("http://localhost:3000/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rsvpData),
    });

    const result = await response.json();
    if (result.success) {
      alert("RSVP successfully submitted!");
    } else {
      alert("Failed to submit RSVP.");
    }
  });

  // Initial render
  renderEvents();
});
