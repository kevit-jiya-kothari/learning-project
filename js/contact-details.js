const API_URL = "https://jsonplaceholder.typicode.com/users";

const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");

const userRole = localStorage.getItem("userRole");

if (userRole === "Viewer") {

    document.querySelector("#editContactLink").style.display = "none";
}

function getContact() {

    const storedContacts = localStorage.getItem("contacts");

    if (storedContacts) {

        const contacts = JSON.parse(storedContacts);
        for (let i = 0; i < contacts.length; i++) {

            if (contacts[i].id == contactId) {
                displayContact(contacts[i]);
                return;
            }
        }
    }

    getContactFromAPI();
}

async function getContactFromAPI() {
    try {
        const response = await fetch(API_URL + "/" + contactId);
        if (!response.ok) {
            throw new Error("Contact not found");
        }

        const contact = await response.json();
        displayContact(contact);
    }
    catch (error) {
        console.error("Error:", error);
    }
}

function displayContact(contact) {

    document.querySelector("#contactName").textContent = contact.name;
    document.querySelector("#contactPhone").textContent = contact.phone;
    document.querySelector("#contactEmail").textContent = contact.email;
    
    // if(contact.company){
    //     document.querySelector("#contactCompany").textContent = contact.company.name;
    // }
    // else{
    //     document.querySelector("#contactCompany").textContent = "Not Provided";
    // }

    // if(contact.company){
    //     document.querySelector("#contactDesignation").textContent = contact.company.catchPhrase;
    // }
    // else{
    //     document.querySelector("#contactDesignation").textContent = "Not Provided";
    // }

    document.querySelector("#contactTags").textContent = contact.tags || "Not Provided";
    document.querySelector("#contactCreated").textContent = "Not Provided";
    document.querySelector("#contactUpdated").textContent = "Not Provided";
    document.querySelector("#editContactLink").href = "contact-edit.html?id=" + contactId;

}

getContact();