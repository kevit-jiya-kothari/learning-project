const API_URL = "https://jsonplaceholder.typicode.com/users";

const userRole = localStorage.getItem("userRole");

if (userRole === "Viewer") {

    document.querySelector("#createContactLink").style.display = "none";

}

const contactsPerPage = 5;
let currentPage = 1;
let allContacts = [];

async function getContacts() {

    const storedContacts = localStorage.getItem("contacts");

    if (storedContacts) {

        const contacts = JSON.parse(storedContacts);

        if(contacts.length >0) {
            allContacts = contacts;
            sortContacts();
            displayContacts();
            return;
        }
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Request Failed");
        }

        const contacts = await response.json();

        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );

        allContacts = contacts;
        sortContacts();
        displayContacts(contacts);
    }
    catch (error) {
        console.error("Error:", error);
        const tableBody = document.querySelector("#contactsTableBody");
        tableBody.innerHTML = '<tr><td colspan="8">Unable to load contacts.</td></tr>';
    }
}

function sortContacts() {

    allContacts.sort(function(a, b) {

        return a.name.localeCompare(b.name);

    });

}

function displayContacts() {
    const tableBody = document.querySelector("#contactsTableBody");
    tableBody.innerHTML = "";
    document.querySelector("#totalContacts").textContent = allContacts.length;


    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex =startIndex + contactsPerPage;
    const contactsToDisplay = allContacts.slice(startIndex, endIndex);

    for(let i=0; i < contactsToDisplay.length; i++) {
        const contact = contactsToDisplay[i];
        const row = document.createElement("tr");
        
        const numberCell = document.createElement("td");
        numberCell.textContent = startIndex +i + 1;
        row.appendChild(numberCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = contact.name;
        row.appendChild(nameCell);  

        const phoneCell = document.createElement("td");
        phoneCell.textContent = contact.phone;
        row.appendChild(phoneCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = contact.email;
        row.appendChild(emailCell);

        // const companyCell = document.createElement("td");
        // if(contact.company)
        // {
        //     companyCell.textContent = contact.company.name;     
        // }         
        // else
        // {
        //     companyCell.textContent = "Not provided";     
        // }         
        // row.appendChild(companyCell);        
        
        const tagsCell = document.createElement("td");
        tagsCell.textContent = contact.tags || "Not provided";
        row.appendChild(tagsCell);

        // const statusCell = document.createElement("td");
        // statusCell.textContent = "Not provided";
        // row.appendChild(statusCell);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

        const actionsCell = document.createElement("td");    

        const viewLink = document.createElement("a");
        viewLink.href = "contact-details.html?id=" + contact.id;
        viewLink.textContent = "View";

        actionsCell.appendChild(viewLink);
        
        if(userRole === "Editor")
        {
            actionsCell.append(' | ');

            const editLink = document.createElement("a");
            editLink.href = "contact-edit.html?id=" + contact.id;
            editLink.textContent = "Edit";

            actionsCell.appendChild(editLink);
            actionsCell.append(' | ');

            const deleteLink = document.createElement("a");
            deleteLink.href = "contact-delete.html?id=" + contact.id;
            deleteLink.textContent = "Delete";

            actionsCell.appendChild(deleteLink);
        }
        row.appendChild(actionsCell);
        tableBody.appendChild(row);

    }
    updatePagination();
}   

function updatePagination() {

    const totalPages = Math.ceil(allContacts.length / contactsPerPage);
    document.querySelector("#pageNumber").textContent = "Page " + currentPage + " of " + totalPages;

}

document.querySelector("#previousButton").addEventListener( "click", function(event) {

        event.preventDefault();

        if (currentPage > 1) {

            currentPage--;
            displayContacts();

        }
    }
);


document.querySelector("#nextButton").addEventListener("click", function(event) {

        event.preventDefault();

        const totalPages = Math.ceil(allContacts.length / contactsPerPage);

        if (currentPage < totalPages) {

            currentPage++;
            displayContacts();

        }
    }
);

getContacts();

