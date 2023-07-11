const http = require("http");
const fs = require("fs");
const { execSync } = require("child_process");
const port = 8080;
const server = http.createServer((req, res) => {
    execSync("touch /tmp/usb_on");
    req.on("error", (err) => {
        console.error(err);
        res.statusCode = 400;
        res.end("400: Bad Request");
        return;
    });

    res.on("error", (err) => {
        console.error(err);
    });

    if (req.url === "/status" && req.method === "GET") {
        if (fs.existsSync("/tmp/usb_on")) {
            res.end("1");
        } else {
            res.end("0");
        }
    } else if (req.url === "/state/on" && req.method === "POST") {
        try {
            execSync("uhubctl -l 2 -a 1");
            execSync("touch /tmp/usb_on");
            res.end("1");
        } catch (err) {
            console.error(err);
        }
    } else if (req.url === "/state/off" && req.method === "POST") {
        try {
            execSync("uhubctl -l 2 -a 0");
            execSync("rm /tmp/usb_on");
            res.end("0");
        } catch (err) {
            console.error(err);
        }
    } else {
        res.statusCode = 404;
        res.end("404: File Not Found");
    }
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

