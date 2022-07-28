
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

    // On enemy ready
    socket.on('enemy-ready', num => {
        enemyReady = true
        playerReady(num)
        if (ready) playGameMulti(socket)
    })

    // Check player status
    socket.on('check-players', players => {
        players.forEach((p, i) => {
            if (p.connected) playerConnectedOrDisconnected(i)
            if (p.ready) {
                playerReady(i)
                if (i !== playerReady) enemyReady = true
            }
        })
    })

    // On Timeout
    socket.on('timeout', () => {
        infoDisplay.innerHTML = 'You have reached the 10 minute limit'
    })

    // Ready button click
    startButton.addEventListener('click', () => {
        if (allShipsPlaced) playGameMulti(socket)
        else infoDisplay.innerHTML = "Please place all ships"
    })

    // Setup event listeners for firing
    computerSquares.forEach(square => {
        square.addEventListener('click', () => {
            if (currentPlayer === 'user' && ready && enemyReady) {
                shotFired = square.dataset.id
                socket.emit('fire', shotFired)
            }
        })
    })

    // On Fire Received
    socket.on('fire', id => {
        enemyGo(id)
        const square = userSquares[id]
        socket.emit('fire-reply', square.classList)
        playGameMulti(socket)
    })

    // On Fire Reply Received
    socket.on('fire-reply', classList => {
        revealSquare(classList)
        playGameMulti(socket)
    })

    function playerConnectedOrDisconnected(num) {
        let player = `.p${parseInt(num) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green')
        if (parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold'
    }
}