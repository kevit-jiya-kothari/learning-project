const API_URL = "http://localhost:3000/api/contacts";
const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");
const deleteContactButton = document.querySelector("#deleteContact");
const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") {
    alert("You do not have permission to delete contacts.");
    window.location.href = "contacts.html";
} 
else {
    getContact();
}

async function getContact() {
    try {
        if (!contactId) {
            throw new Error("Contact ID is missing from the URL.");
        }

        const response = await fetch(
            API_URL + "/" + encodeURIComponent(contactId),
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contact.");
        }
        const contact = data.contact;

        if (!contact) {
            throw new Error("Contact not found.");
        }

        displayContact(contact);

    } 
    catch (error) {
        console.error("Error fetching contact:", error);
        alert(error.message || "Unable to load contact.");
        window.location.href = "contacts.html";
    }
}

function displayContact(contact) {
    document.querySelector("#contactName").textContent = contact.name || "Not Provided";
    document.querySelector("#contactPhone").textContent = contact.phone || "Not Provided";
    document.querySelector("#contactEmail").textContent = contact.email || "Not Provided";
    document.querySelector("#contactTags").textContent =
        Array.isArray(contact.tags) && contact.tags.length > 0
            ? contact.tags.join(", ")
            : "Not Provided";
}

deleteContactButton.addEventListener("click", function (event) {
    event.preventDefault();

    const confirmDelete = confirm(
        "Are you sure you want to delete this contact?"
    );

    if (!confirmDelete) {
        return;
    }
    deleteContact();
});

async function deleteContact() {
    try {
        const response = await fetch(
            API_URL + "/" + encodeURIComponent(contactId),
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete contact.");
        }

        alert("Contact deleted successfully!");
        window.location.href = "contacts.html";

    } 
    catch (error) {
        console.error("Error deleting contact:", error);
        alert(error.message || "Unable to delete contact.");
    }
}