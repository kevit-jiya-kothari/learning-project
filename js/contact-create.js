const API_URL = "http://localhost:3000/api/contacts";
const contactForm = document.querySelector("#contactForm");
const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") 
{
    alert("You do not have permission to create contacts.");
    window.location.href = "contacts.html";
} 

else 
{
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

        const contact = {
            name: name,
            phone: phone,
            email: email,
            tags: tags
        };

        createContact(contact);
    });
}

async function createContact(contact) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(contact)
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create contact.");
        }

        const newContact = data.contact;

        if (!newContact || !newContact._id) {
            throw new Error("Contact was created, but its ID was not returned.");
        }

        alert("Contact created successfully!");
        window.location.href = "contact-details.html?id=" + encodeURIComponent(newContact._id);

    } 
    catch (error) 
    {
        console.error("Error creating contact:", error);
        alert(error.message || "Unable to create contact.");
    }
}