const API_URL = "http://localhost:3000/api/contacts";
const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");
const userRole = localStorage.getItem("userRole");

if (userRole === "Viewer") {
    document.querySelector("#editContactLink").style.display = "none";
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
            throw new Error(data.message || "Contact not found.");
        }

        const contact = data.contact;

        if (!contact) {
            throw new Error("Contact details were not returned by the server.");
        }
        displayContact(contact);

    } 
    catch (error) {
        console.error("Error fetching contact:", error);
        alert(error.message || "Unable to load contact details.");
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

    document.querySelector("#contactCreated").textContent =
    contact.createdAt
        ? new Date(contact.createdAt).toLocaleString()
        : "Not Provided";

    document.querySelector("#contactUpdated").textContent =
        contact.updatedAt
            ? new Date(contact.updatedAt).toLocaleString()
            : "Not Provided";

    document.querySelector("#editContactLink").href =
        "contact-edit.html?id=" + encodeURIComponent(contact._id);
}

getContact();