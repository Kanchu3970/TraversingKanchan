let inputCount = 0;

// Function to generate input fields based on the number of stations
document.getElementById("generateFieldsBtn").addEventListener("click", function() {
    const stationCount = parseInt(document.getElementById("stationCount").value);
    const inputContainer = document.getElementById("inputContainer");
    
    // Clear any existing fields
    inputContainer.innerHTML = "";
    inputCount = stationCount;

    // Create input fields for each station's angle and distance
    for (let i = 1; i <= stationCount; i++) {
        const newInputGroup = document.createElement("div");
        newInputGroup.classList.add("input-group");
        newInputGroup.innerHTML = `
            <label for="angle${i}">Angle (in degrees) for Station ${i}:</label>
            <input type="number" id="angle${i}" name="angle${i}" step="0.01" required>
            <label for="distance${i}">Distance (in meters) for Station ${i}:</label>
            <input type="number" id="distance${i}" name="distance${i}" step="0.01" required>
        `;
        inputContainer.appendChild(newInputGroup);
    }
});

// Function to calculate traverse for multiple inputs and display results
document.getElementById("traverseForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get initial Northing and Easting from user input
    let initialEasting = parseFloat(document.getElementById("initialEasting").value);
    let initialNorthing = parseFloat(document.getElementById("initialNorthing").value);

    let currentEasting = initialEasting;
    let currentNorthing = initialNorthing;

    const resultDialog = document.getElementById("resultDialog");
    const dialogContent = document.getElementById("dialogContent");
    let resultHtml = "<ul>";
    let tableRows = "";

    for (let i = 1; i <= inputCount; i++) {
        const angle = parseFloat(document.getElementById(angle${i}).value);
        const distance = parseFloat(document.getElementById(distance${i}).value);

        // Convert angle to radians for calculations
        const radian = angle * (Math.PI / 180);

        // Calculate new Northing and Easting for current station
        let newNorthing = currentNorthing + distance * Math.cos(radian);
        let newEasting = currentEasting + distance * Math.sin(radian);

        resultHtml += `
            <li>Set ${i}: Angle: ${angle.toFixed(2)}°, Northing: ${newNorthing.toFixed(2)} m, Easting: ${newEasting.toFixed(2)} m</li>
        `;

        // Add data to table
        tableRows += `
            <tr>
                <td>${i}</td>
                <td>${angle.toFixed(2)}</td>
                <td>${distance.toFixed(2)}</td>
                <td>${newNorthing.toFixed(2)}</td>
                <td>${newEasting.toFixed(2)}</td>
            </tr>
        `;

        // Update current position for the next iteration
        currentNorthing = newNorthing;
        currentEasting = newEasting;
    }

    resultHtml += "</ul>";
    dialogContent.innerHTML = resultHtml;

    // Append the calculated data to the table
    document.querySelector("#dataTable tbody").innerHTML = tableRows;

    // Show the dialog box with the results
    resultDialog.showModal();
});

// Close the dialog box
document.getElementById("closeDialog").addEventListener("click", function() {
    document.getElementById("resultDialog").close();
});

// Function to clear the form and table data
document.getElementById("removeDataBtn").addEventListener("click", function() {
    document.getElementById("traverseForm").reset();
    document.querySelector("#dataTable tbody").innerHTML = "";
    document.getElementById("inputContainer").innerHTML = "";
    inputCount = 0;
});