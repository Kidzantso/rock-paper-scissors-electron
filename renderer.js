const fs = require('fs');
const path = require('path');

let playerScore = 0;
let computerScore = 0;
let turnCount = 0;
let roundNumber = 1;
let roundTurns = [];
let gameLog = [];

const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll('button[data-choice]');
const turnResult = document.getElementById('turn-result');
const currentScore = document.getElementById('current-score');
const roundsLog = document.getElementById('rounds-log');
const nextRoundBtn = document.getElementById('next-round');

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) return "win";
  return "lose";
}

function updateScore(result) {
  if (result === "win") playerScore++;
  else if (result === "lose") computerScore++;
  turnCount++;
}

function displayScore() {
  currentScore.textContent = `Current Round Score: You ${playerScore} - ${computerScore} Computer`;
}

function saveGameLog() {
  const filePath = path.join(__dirname, 'game_log.json');
  fs.writeFileSync(filePath, JSON.stringify(gameLog, null, 2));
}

function finishRound() {
  const roundResult = {
    round: roundNumber,
    finalScore: {
      player: playerScore,
      computer: computerScore
    },
    turns: roundTurns
  };

  gameLog.push(roundResult);
  saveGameLog();

  const li = document.createElement('li');
  li.innerHTML = `Round ${roundNumber}: You ${playerScore} - ${computerScore} Computer`;

  const turnDetails = document.createElement('div');
  turnDetails.classList.add('turn-details');

  roundTurns.forEach((t, i) => {
    const turnText = document.createElement('p');
    turnText.innerHTML = `
      Turn ${i + 1}: You chose ${t.player}, Computer chose ${t.computer} → ${t.result.toUpperCase()}
    `;
    turnDetails.appendChild(turnText);
  });

  li.appendChild(turnDetails);
  li.addEventListener('click', () => {
    turnDetails.style.display = turnDetails.style.display === "none" ? "block" : "none";
  });

  roundsLog.appendChild(li);

  // Reset for next round
  nextRoundBtn.style.display = 'inline-block';
  buttons.forEach(btn => btn.disabled = true);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const player = button.getAttribute('data-choice');
    const computer = getComputerChoice();
    const result = getResult(player, computer);

    if (result === "draw") {
      turnResult.textContent = `It's a draw! You both chose ${player}.`;
      return;
    }

    updateScore(result);

    roundTurns.push({
      player,
      computer,
      result
    });

    turnResult.textContent = `You chose ${player}, computer chose ${computer}. You ${result}.`;
    displayScore();

    if (playerScore === 3 || computerScore === 3) {
      finishRound();
    }
  });
});

nextRoundBtn.addEventListener('click', () => {
  playerScore = 0;
  computerScore = 0;
  turnCount = 0;
  roundTurns = [];
  roundNumber++;

  turnResult.textContent = "New round started! Pick your move.";
  currentScore.textContent = `Current Round Score: You 0 - 0 Computer`;
  buttons.forEach(btn => btn.disabled = false);
  nextRoundBtn.style.display = 'none';
});
