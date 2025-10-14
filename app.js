const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};

const appointments = [
    { name: "James", day: "Wednesday", time: "3:30" },
    { name: "Lillie", day: "Friday", time: "1:00" }
];

let serverObj = http.createServer(function(req, res) {
    let urlObj = url.parse(req.url, true);
    console.log("Request for:", urlObj.pathname);

    switch (urlObj.pathname) {
        case "/schedule":
            schedule(urlObj.query, res);
            break;
        case "/cancel":
            cancel(urlObj.query, res);
            break;
        case "/check":
            check(urlObj.query, res);
            break;
        default:
            var filePath = './public_html' + urlObj.pathname;
            if (urlObj.pathname === '/') filePath = './public_html/index.html';
            sendFile(filePath, res);
            break;
    }
});

function schedule(queryObj, res) {
    if (queryObj.name == undefined || queryObj.day == undefined || queryObj.time == undefined) {
        res.end("missing query parameters");
        return;
    }

    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
        availableTimes[queryObj.day] = availableTimes[queryObj.day].filter(t => t !== queryObj.time);
        appointments.push({ name: queryObj.name, day: queryObj.day, time: queryObj.time });
        res.end("scheduled");
    } else {
        res.end("not available");
    }
}

function cancel(queryObj, res) {
    if (queryObj.name == undefined || queryObj.day == undefined || queryObj.time == undefined) {
        res.end("missing query parameters");
        return;
    }

    var found = false;
    for (var i = 0; i < appointments.length; i++) {
        if (appointments[i].name == queryObj.name &&
            appointments[i].day == queryObj.day &&
            appointments[i].time == queryObj.time) {

            appointments.splice(i, 1);
            availableTimes[queryObj.day].push(queryObj.time);

            res.end("Appointment has been canceled");
            found = true;
            break;
        }
    }

    if (!found) {
        res.end("Appointment not found");
    }
}

function check(queryObj, res) {
    if (queryObj.day == undefined || queryObj.time == undefined) {
        res.end("missing query parameters");
        return;
    }

    if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
        res.end("available");
    } else {
        res.end("not available");
    }
}

function sendFile(filePath, res) {
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("404: File not found");
            return;
        }

        let ext = path.extname(filePath);
        let contentType = 'text/html';
        switch (ext) {
            case '.html': contentType = 'text/html'; break;
            case '.js': contentType = 'application/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.json': contentType = 'application/json'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
            case '.gif': contentType = 'image/gif'; break;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

serverObj.listen(80, function() {
    console.log("server running");
});
