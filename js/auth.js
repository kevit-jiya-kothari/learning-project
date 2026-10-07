const AUTH_API_URL ="https://dummyjson.com/auth/login";


const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event){

        event.preventDefault();
        
        const username = document.querySelector("#username").value;
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

        
        if (!response.ok) {
            // throw new Error("Invalid username or password");
            data.message || "Login failed";
        }

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      
        if (username === "emilys") {

            localStorage.setItem("userRole","Editor");

        }
        else {

            localStorage.setItem("userRole","Viewer");
        }
    
        alert("Login successful");
        window.location.href = "pages/home.html";
    }
    catch (error) {
        console.error("Login Error:", error);
        alert("Invalid username or password");
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const logoutLink =
        document.querySelector("#logoutLink");

    if (logoutLink) {

        logoutLink.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmLogout =
                confirm("Are you sure you want to logout?");

            if (!confirmLogout) {
                return;
            }

            // Remove JWT tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");

            alert("Logged out successfully");

            // Go back to login page
            window.location.href = "../index.html";

        });

    }

});

// const logoutLink = document.querySelector("#logoutLink");

// if (logoutLink) {

//     logoutLink.addEventListener("click", function(event){

//         event.preventDefault();
        
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
        
//         window.location.href = "../index.html";
//     });
// }

// const accessToken = localStorage.getItem("accessToken");
// const currentPage = window.location.pathname;

// if(!currentPage.endsWith("index.html") && !currentPage.endsWith("/")){

//     if(!accessToken){

//         console.log("No access token. Redirecting to login.");
//         window.location.href = "../index.html";
//     }
//     else {

//         console.log("Access token found. Page allowed.");

//     }
// }