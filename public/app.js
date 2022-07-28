
let ready = false;
let playerNum = 0;
let currentPlayer = 'player 1'
let infoDisplay = document.querySelector('.info')
let oneScore = document.querySelector('.playerOneScore')
let twoScore = document.querySelector('.playerTwoScore')
let startButton = document.querySelector('.start-game')




// Start game

startButton.addEventListener('click', startGame)

function startGame() {

    const socket = io();
    //Get player number
    socket.on('player-number', num => {
        if (num === -1) {
            infoDisplay.innerHTML = "sorry, two players are already connected"
        } else {
            playerNum = parseInt(num)
            if (playerNum === 1) currentPlayer = "player 2"
            console.log(playerNum)
        }
    })

    // Another player has connected or disconnected
    socket.on('player-connection', num => {
        console.log(`Player number ${num} has connected or disconnected`)
    })

}


function startMultiPlayer() {
    gameMode = 'multiPlayer'

    const socket = io();

    // Get your player number
    socket.on('player-number', num => {
        if (num === -1) {
            infoDisplay.innerHTML = "Sorry, the server is full"
        } else {
            playerNum = parseInt(num)
            if (playerNum === 1) currentPlayer = "enemy"

            console.log(playerNum)

            // Get other player status
            socket.emit('check-players')
        }
    })

    // Another player has connected or disconnected
    socket.on('player-connection', num => {
        console.log(`Player number ${num} has connected or disconnected`)
        playerConnectedOrDisconnected(num)
    })

}