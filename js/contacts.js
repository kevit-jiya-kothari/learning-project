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
        const search = document.querySelector("#search").value.trim();
        const tag = document.querySelector("#tag").value;
        const sort = document.querySelector("#sort").value;

        // Convert frontend sorting options into backend parameters
        let sortBy = "name";
        let order = "asc";

        if (sort === "recent") {
            sortBy = "createdAt";
            order = "desc";
        } 
        else if (sort === "phone") {
            sortBy = "phone";
            order = "asc";
        }

        // Prepare query parameters
        const params = new URLSearchParams();

        if (search) {
            params.set("search", search);
        }

        if (tag) {
            params.set("tag", tag);
        }

        params.set("sortBy", sortBy);
        params.set("order", order);

        const response = await fetch(`${API_URL}?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch contacts.");
        }

        if (!Array.isArray(data.contact)) {
            throw new Error("Invalid contacts response from server.");
        }

        allContacts = data.contact;
        currentPage = 1;

        displayContacts();

    } 
    catch (error) {
        console.error("Error fetching contacts:", error);

        document.querySelector("#contactsTableBody").innerHTML =
            '<tr><td colspan="6">Unable to load contacts.</td></tr>';

        document.querySelector("#totalContacts").textContent = "0";
        document.querySelector("#pageNumber").textContent = "Page 0 of 0";
    }

}

function displayContacts() {
    const tableBody = document.querySelector("#contactsTableBody");
    tableBody.innerHTML = "";
    document.querySelector("#totalContacts").textContent = allContacts.length;

    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex =startIndex + contactsPerPage;
    const contactsToDisplay = allContacts.slice(startIndex, endIndex);

    if (allContacts.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="6">No contacts found.</td></tr>';

        updatePagination();
        return;
    }

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
    
        const tagsCell = document.createElement("td");
        tagsCell.textContent = Array.isArray(contact.tags) && contact.tags.length > 0
            ? contact.tags.join(", ")
            : "Not provided";
        row.appendChild(tagsCell);

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

// Search and filter contacts
document.querySelector("#searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    getContacts();
});

// Clear all filters
document.querySelector("#clearButton").addEventListener("click", function() {
    document.querySelector("#searchForm").reset();
    getContacts();
});

getContacts();

