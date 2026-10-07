const API_URL = "https://jsonplaceholder.typicode.com/users";

const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");

const deleteContactButton = document.querySelector("#deleteContact");
const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") {

    alert("You do not have permission to create contacts.");
    window.location.href = "contacts.html";

}

deleteContactButton.addEventListener("click", function(event) {

        event.preventDefault();
        const confirmDelete =
            confirm(
                "Are you sure you want to delete this contact?"
            );

        if (!confirmDelete) {

            return;

        }
        deleteContact();

    }
);

function getContact() {

    const storedContacts = localStorage.getItem("contacts");

    if(!storedContacts) {
        alert("Contacts not found");
        return;
    }

    const contacts = JSON.parse(storedContacts);

    for (let i = 0; i < contacts.length; i++) {

        if (contacts[i].id == contactId) {
            displayContact(contacts[i]);
            return;
        }
    }
    
    alert("Contact not found");
}

function displayContact(contact) {

    document.querySelector("#contactName").textContent = contact.name;
    document.querySelector('#contactPhone').textContent = contact.phone;
    document.querySelector('#contactEmail').textContent = contact.email;
    document.querySelector('#contactTags').textContent = contact.tags || "Not Provided";
}

// deleteContactButton.addEventListener("click", function(event) {

//     event.preventDefault();
//     deleteContact();
// });

async function deleteContact() {

    const storedContacts = localStorage.getItem("contacts");

    if(storedContacts) {

        const contacts = JSON.parse(storedContacts);
        const updatedContacts = [];

        for (let i = 0; i < contacts.length; i++) {

            if (contacts[i].id != contactId) {
                updatedContacts.push(contacts[i]);
            }
        }

        localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    }

    try {
        const response = await fetch(API_URL + "/" + contactId, {
            method: "DELETE"
        });

        if (response.ok) {
          console.log("Contact deleted successfully");
        }
        else {
            throw new Error("Failed to delete contact");
        }
    }
    catch (error) {
        console.error("Error:", error);
    }

    alert("Contact deleted successfully");
    window.location.href = "contacts.html";
}

getContact();
