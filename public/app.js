
let ready = false;
let playerNum = 0;
let currentPlayer = 'player 1'
let infoDisplay = document.querySelector('.info')
let oneScore = document.querySelector('.playerOneScore')
let twoScore = document.querySelector('.playerTwoScore')
let startButton = document.querySelector('.start-game')
let rollButton = document.querySelector('.start-game')




// Start game

startButton.addEventListener('click', startGame)
rollButton.addEventListener('click', rollDice)

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

// when roll is clicked 
let firstPlayerScore = 0
let secondPlayerScore = 0

function rollDice() {
    for (let j = 0; j < 12; j++) {

        const firstRandomNum = Math.floor(Math.random() * 6) + 1
        const secondRandomNum = Math.floor(Math.random() * 6) + 1
        firstPlayerScore += firstRandomNum
        secondPlayerScore += secondRandomNum
        console.log(firstPlayerScore)
        // console.log(secondPlayerScore)
    }

    // console.log(rollDice())

    const firstDiceImage = 'img/dice.png' + firstRandomNum + '.png';
    document.querySelector('img')[0].setAttribute('src', firstDiceImage)


    const secondDiceImage = 'img/dice.png' + secondRandomNum + '.png';
    document.querySelector('img')[1].setAttribute('src', firstDiceImage)

    if (firstRandomNum > secondRandomNum) {
        document.querySelector('h1').innerHTML = 'The winner is player 1'
    } else if (firstRandomNum < secondRandomNum) {
        document.querySelector('h1').innerHTML = 'The winner is player 2'
    } else {
        document.querySelector('h1').innerHTML = 'Its a draw'
    }

}