const API_URL = "https://jsonplaceholder.typicode.com/users";

const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get("id");

const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") {

    alert("You do not have permission to create contacts.");
    window.location.href = "contacts.html";

}

function getContact() {

    const storedContacts = localStorage.getItem("contacts");

    if (!storedContacts) {
        alert("Contacts not found");
        return;
    }
    const contacts = JSON.parse(storedContacts);

    for (let i = 0; i < contacts.length; i++) {

        if (contacts[i].id == contactId) {

            document.querySelector("#name").value = contacts[i].name;
            document.querySelector("#phone").value =  contacts[i].phone;
            document.querySelector("#email").value = contacts[i].email;
            document.querySelector("#tags").value = contacts[i].tags || "Not provided";

            return;
        }
    }

    alert("Contact not found");
}

const contactForm = document.querySelector("#contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();
    
    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    const email = document.querySelector("#email").value;
    const tags = document.querySelector("#tags").value;

    const updatedContact = {
        name: name,
        phone: phone,
        email: email,
        tags: tags
    };

    updateContact(updatedContact);
});

async function updateContact(updatedContact) {

    const storedContacts = localStorage.getItem("contacts");

        if (storedContacts) {

            const contacts = JSON.parse(storedContacts);

            for (let i = 0; i < contacts.length; i++) {

                if (contacts[i].id == contactId) {

                    contacts[i].name = updatedContact.name;
                    contacts[i].phone = updatedContact.phone;
                    contacts[i].email = updatedContact.email;
                    contacts[i].tags = updatedContact.tags;
                    break;
                }

            }

            localStorage.setItem(
                "contacts",
                JSON.stringify(contacts)
            );
        }
        try {
            const response = await fetch(API_URL + "/" + contactId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedContact)
            });

            if(response.ok) {
                const updatedContactFromAPI = await response.json();
                console.log("Contact updated:", updatedContactFromAPI);
                
            }
            else {
                console.log("API update failed, but localStorage was updated.");
            }

        }
        catch (error) {
            console.error("Error:", error);
            alert("Unable to update contact");
        }

        alert("Contact updated successfully");

        window.location.href =  "contact-details.html?id=" + contactId;;
}

getContact();
