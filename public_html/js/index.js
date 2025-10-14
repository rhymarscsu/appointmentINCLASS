window.onload = function() {
    // Inputs
    var nameInput = document.getElementById("name");
    var dayInput = document.getElementById("day");
    var timeInput = document.getElementById("time");

    // Buttons
    var scheduleBtn = document.getElementById("scheduleBtn");
    var cancelBtn = document.getElementById("cancelBtn");
    var checkBtn = document.getElementById("checkBtn");

    // Results div
    var resultsDiv = document.getElementById("results");

    // Schedule button
    scheduleBtn.onclick = function() {
        var url = "/schedule?name=" + nameInput.value + "&day=" + dayInput.value + "&time=" + timeInput.value;
        fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            resultsDiv.innerText = text;
        });
    };

    // Cancel button
    cancelBtn.onclick = function() {
        var url = "/cancel?name=" + nameInput.value + "&day=" + dayInput.value + "&time=" + timeInput.value;
        fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            resultsDiv.innerText = text;
        });
    };

    // Check button
    checkBtn.onclick = function() {
        var url = "/check?day=" + dayInput.value + "&time=" + timeInput.value;
        fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            resultsDiv.innerText = text;
        });
    };
};
