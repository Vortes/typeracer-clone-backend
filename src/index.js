const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const getRandomParagraph = require("./utils/getRandomParagraph.js");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: process.env.DEVELOPMENT_MODE
            ? "http://localhost:3001"
            : "https://typeracer-clone-vortes.vercel.app",
    },
});

app.use(cors());

const makeNewParagraph = () => {
    return getRandomParagraph(100).join(" ");
};

const paragraphsByRoom = new Map();

io.on("connection", (socket) => {
    console.log("a user connected: " + socket.id);

    socket.on("send-wpm", (message, room) => {
        if (socket.to(room) !== "") {
            socket.to(room).emit("receive-message", message);
        }
    });

    socket.on("join-room", (roomName, cb) => {
        socket.join(roomName);

        if (!paragraphsByRoom.has(roomName)) {
            paragraphsByRoom.set(roomName, makeNewParagraph());
        }

        const roomParagraph = paragraphsByRoom.get(roomName);
        cb(roomParagraph);
    });
});

app.get("/api", (req, res) => {
    res.send({ data: "Hello world" });
});

server.listen(port, () => {
    console.log("listening on port 3000");
});
