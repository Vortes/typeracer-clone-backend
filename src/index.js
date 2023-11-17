const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
      origin: "https://typeracer-clone-vortes.vercel.app/"
    }
});

app.use(cors())

io.on('connection', socket => {
    console.log("a user connected: " + socket.id)

    socket.on("send-wpm", (message, room) => {
        if(socket.to(room) !== "") {
            socket.to(room).emit("receive-message", message)
        }
    })

    socket.on("join-room", room => {
        socket.join(room)
    })

})

app.get("/api", (req, res) => {
    res.send({"data":"Hello world"})
})

server.listen(port, ()=> {
    console.log("listening on port 3000")
})