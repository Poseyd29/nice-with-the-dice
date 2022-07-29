const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 8081;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


// Handle socket connection request from web client. Allow two, ignore after first two.
const connections = [null, null]

// Configuring Socket IO, handle socket connection request from web client
io.on('connection', socket => {
    console.log('NEW WS Connection')
})

io.on('connection', socket => {
    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
        // if connections[i] === null which it will, then playerIndex will become i, it breaks because we found a player. if playerIndex = -1 then we know theres two connections already so it remains at -1
        if (connections[i] === null)
            playerIndex = i
        break
    }

    // Tell connecting client what player number they are
    socket.emit('player-number', playerIndex)

    console.log(`Player ${playerIndex} has connected`)

    // ignoring extra players
    if (playerIndex === -1) return
    // connections[playerIndex] = false

    // Tell everyone what player number just connected by using broadcast
    socket.broadcast.emit('player-connection', playerIndex)
})


let firstPlayerScore = 0
let secondPlayerScore = 0

function rollDice() {
    for (let j = 0; j < 9; j++) {

        const firstRandomNum = Math.floor(Math.random() * 6) + 1
        const secondRandomNum = Math.floor(Math.random() * 6) + 1
        firstPlayerScore += firstRandomNum
        secondPlayerScore += secondRandomNum
        console.log(firstPlayerScore)
        console.log(secondPlayerScore)
    }


}

// console.log(rollDice())