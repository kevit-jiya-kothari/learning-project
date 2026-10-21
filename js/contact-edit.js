const API_URL = "http://localhost:3000/api/contacts";
const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");
const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") {
    alert("You do not have permission to edit contacts.");
    window.location.href = "contacts.html";
} 
else {
    getContact();
}

const contactForm = document.querySelector("#contactForm");

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

        document.querySelector("#name").value = contact.name || "";
        document.querySelector("#phone").value = contact.phone || "";
        document.querySelector("#email").value = contact.email || "";

        document.querySelector("#tags").value =
            Array.isArray(contact.tags) ? contact.tags.join(", ") : "";

    } catch (error) {
        console.error("Error fetching contact:", error);
        alert(error.message || "Unable to load contact.");
        window.location.href = "contacts.html";
    }
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const email = document.querySelector("#email").value.trim();
    const tagsInput = document.querySelector("#tags").value;

    const tags = tagsInput
        .split(",")
        .map(function (tag) {
            return tag.trim();
        })
        .filter(function (tag) {
            return tag !== "";
        });

    const updatedContact = {
        name: name,
        phone: phone,
        email: email,
        tags: tags
    };

    updateContact(updatedContact);
});

async function updateContact(updatedContact) {
    try {
        const response = await fetch(
            API_URL + "/" + encodeURIComponent(contactId),
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(updatedContact)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update contact.");
        }

        alert("Contact updated successfully!");
        window.location.href = "contact-details.html?id=" + encodeURIComponent(contactId);

    } 
    catch (error) {
        console.error("Error updating contact:", error);
        alert(error.message || "Unable to update contact.");
    }
}