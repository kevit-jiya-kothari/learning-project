const AUTH_API_URL = "http://localhost:3000/api/auth/login";
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value;

        login(username, password);
    });
}

async function login(username, password) {
    try {
        const response = await fetch(AUTH_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        // Handle invalid credentials or other errors
        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        // Store user details after successful login
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userRole", data.user.role);

        alert("Login successful!");

        // Redirect to the existing home page
        window.location.href = "pages/home.html";

    } 
    catch (error) {
        console.error("Login error:", error);
        alert(error.message || "Unable to connect to the server.");
    }
}

// Handle logout
document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.querySelector("#logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();

            const confirmLogout = confirm("Are you sure you want to logout?");

            if (!confirmLogout) {
                return;
            }

            // Remove locally stored user details
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
            localStorage.removeItem("userRole");

            alert("Logged out successfully!");

            // Return to login page
            window.location.href = "../index.html";
        });
    }
});