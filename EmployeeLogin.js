function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "database") {
      alert("Login successful!");
      window.location.href = "Hotel.html";
    } else {
      alert("Invalid username or password.");
    }
  }
  
  function signup() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword === confirmPassword) {
      alert("Account created successfully!");
      // Here, you can add code to store the new username and password in a database
    } else {
      alert("Passwords do not match.");
    }
  }