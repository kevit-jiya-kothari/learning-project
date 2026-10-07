// const API_URl = "https://jsonplaceholder.typicode.com/users";

// const contactForm = document.querySelector("#contactForm");

// contactForm.addEventListener("submit", function(event) {

//     event.preventDefault();

//     const name = document.querySelector('#name').value;
//     const phone = document.querySelector('#phone').value;
//     const email = document.querySelector('#email').value;
//     const tags = document.querySelector('#tags').value;

//     const contact = {
//         name: name,
//         phone: phone,
//         email: email,
//         tags: tags
//     };

//     createContact(contact);

// });

// async function createContact(contact) {

//     try {

//         const response = await fetch(API_URl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(contact)
//         });

//         if (!response.ok) {
//             throw new Error("Failed to create contact");
//         }

//         const newContact = await response.json();
//         console.log("Contact created:", newContact);

//          const storedContacts = localStorage.getItem("contacts");

//         if (storedContacts) {

//             const contacts = JSON.parse(storedContacts);
//             contacts.push(newContact);

//             localStorage.setItem(
//                 "contacts",
//                 JSON.stringify(contacts)
//             );

//         } 
//         else {

//             const contacts = [];
//             contacts.push(newContact);

//             localStorage.setItem(
//                 "contacts",
//                 JSON.stringify(contacts)
//             );
//         }

//         alert("Contact created successfully");
        
//         window.location.href = "contact-details.html?id=" + newContact.id;

//     } 
//     catch (error) {
//         console.error("Error:", error);
//         alert("Unable to create contact");

//     }
// }

const API_URL = "https://jsonplaceholder.typicode.com/users";
const contactForm = document.querySelector("#contactForm");

const userRole = localStorage.getItem("userRole");

if (userRole !== "Editor") {

    alert("You do not have permission to create contacts.");
    window.location.href = "contacts.html";

}

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    const email = document.querySelector("#email").value;
    const tags = document.querySelector("#tags").value;

    const contact = {

        name: name,
        phone: phone,
        email: email,
        tags: tags,

    };

    createContact(contact);

});


async function createContact(contact) {

    try {

        const response =  await fetch(API_URL, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(contact)

            });


        if (!response.ok) {

            throw new Error(
                "Failed to create contact"
            );

        }


        const apiContact =
            await response.json();


        console.log("Created contact from API:",apiContact);

        const storedContacts = localStorage.getItem("contacts");
        let contacts = [];

        if (storedContacts) {

            contacts = JSON.parse(storedContacts);

        }

        let newId = 1;

        if (contacts.length > 0) {

            const ids =
                contacts.map(function(contact) {

                    return Number(contact.id);

                });

            newId = Math.max(...ids) + 1;

        }

        const newContact = {

            id: newId,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            tags: contact.tags

        };


        contacts.push(newContact);
        localStorage.setItem("contacts",JSON.stringify(contacts));
        alert( "Contact created successfully");

        window.location.href = "contact-details.html?id=" + newId;

    }
    catch (error) {

        console.log( "Error:", error);
        alert("Unable to create contact");

    }

}