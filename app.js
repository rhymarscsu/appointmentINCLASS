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
    {name: "James", day: "Wednesday", time: "3:30"},
    {name: "Lillie", day: "Friday", time: "1:00"}
];

let serverObj = http.createServer(function(req,res){
    let urlObj = url.parse(req.url,true);
    console.log(urlObj);
    switch (urlObj.pathname){
        case "/schedule":
            schedule(urlObj.query,res);
            break;
        case "/cancel":
            cancel(urlObj.query,res);
            break;
        case "/check":
            check(urlObj.query,res);
            break;
        default:
            res.writeHead(404,{'content-type':'text/plain'});
            res.end("pathname not found");
    }
});

function schedule(queryObj, res) {
    if(queryObj.name == undefined || queryObj.day == undefined || queryObj.time == undefined){
        res.end("missing query parameters");
        return;
    }

    if(availableTimes[queryObj.day].some(element => element == queryObj.time)){
        // reserve time
        let newTimes = [];
        for(let i = 0; i < availableTimes[queryObj.day].length; i++){
            if(availableTimes[queryObj.day][i] != queryObj.time){
                newTimes.push(availableTimes[queryObj.day][i]);
            }
        }
        availableTimes[queryObj.day] = newTimes;

        appointments.push({name: queryObj.name, day: queryObj.day, time: queryObj.time});
        res.end("scheduled");
    } else {
        res.end("not available");
    }
}

function cancel(queryObj, res){
    res.end("placeholder");
}

function check(queryObj, res){
    res.end("placeholder");
}

serverObj.listen(80, function(){
    console.log("server running");
});

