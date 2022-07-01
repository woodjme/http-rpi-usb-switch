const http = require("http");
const fs = require("fs");
const { execSync } = require("child_process");
const port = 8080;
const server = http.createServer((req, res) => {
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
        const stdout = execSync("ls");
        if (fs.existsSync("/sys/bus/usb/drivers/usb/1-1")) {
            res.end("1");
        } else {
            res.end("0");
        }
    } else if (req.url === "/state/on" && req.method === "POST") {
        try {
            execSync("uhubctl -l 2 -a 1");
            execSync("echo '1-1' |sudo tee /sys/bus/usb/drivers/usb/bind");
            res.end("1");
        } catch (err) {
            console.error(err);
        }
    } else if (req.url === "/state/off" && req.method === "POST") {
        try {
            execSync("uhubctl -l 2 -a 0");
            execSync("echo '1-1' |sudo tee /sys/bus/usb/drivers/usb/unbind");
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
