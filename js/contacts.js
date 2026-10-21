const API_URL =  "http://localhost:3000/api/contacts";
const userRole = localStorage.getItem("userRole");

if (userRole === "Viewer") {

    document.querySelector("#createContactLink").style.display = "none";

}

const contactsPerPage = 5;
let currentPage = 1;
let allContacts = [];

async function getContacts() {

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch contacts.");
        }

        const data = await response.json();

        if (!Array.isArray(data.contact)) {
            throw new Error("Expected an array in data.contacts. Check the backend response.");
        }

        allContacts = data.contact;

        sortContacts();
        displayContacts();
    } 
    catch (error) {
        console.error("Error fetching contacts:", error);

        const tableBody = document.querySelector("#contactsTableBody");

        tableBody.innerHTML =
            '<tr><td colspan="8">Unable to load contacts.</td></tr>';
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
        viewLink.href =  "contact-details.html?id=" + encodeURIComponent(contact._id);
        viewLink.textContent = "View";

        actionsCell.appendChild(viewLink);
        
        if(userRole === "Editor")
        {
            actionsCell.append(' | ');

            const editLink = document.createElement("a");
            editLink.href = "contact-edit.html?id=" + encodeURIComponent(contact._id);
            editLink.textContent = "Edit";

            actionsCell.appendChild(editLink);
            actionsCell.append(' | ');

            const deleteLink = document.createElement("a");
            deleteLink.href = "contact-delete.html?id=" + encodeURIComponent(contact._id);
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
    document.querySelector("#pageNumber").textContent = totalPages === 0 ? "Page 0 of 0" : `Page ${currentPage} of ${totalPages}`;
    document.querySelector("#previousButton").disabled = currentPage <= 1;
    document.querySelector("#nextButton").disabled = totalPages === 0 || currentPage >= totalPages;
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

