'use strict';

import { wordBank } from './wordbank.js';

let score = 0;
let timer = 15;
let currentWord = '';
let timerInterval;

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const wordInput = document.getElementById('word-input');
const wordDisplay = document.getElementById('word-display');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const music = document.getElementById('background-music');

// EventListener
startBtn.addEventListener('click', () => {
    playMusic();
    initializeGame();
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    playMusic();
    initializeGame();
});

// Music play/stop
function playMusic() {
    music.play();
}

function stopMusic() {
    music.pause();
    music.currentTime = 0;
}

function initializeGame() {
    score = 0;
    timer = 15;
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    startBtn.hidden = true;
    restartBtn.hidden = false;

    // Show initial score and timer
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time Left: ${timer}s`;

    loadNewWord();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `Time Left: ${timer}s`;

        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function loadNewWord() {
    currentWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    wordDisplay.textContent = currentWord;
}

wordInput.addEventListener('input', () => {
    if (wordInput.value === currentWord) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        wordInput.value = '';
        loadNewWord();
    }
});

function endGame() {
    wordInput.disabled = true;
    wordDisplay.textContent = 'Game Over!';
    stopMusic();

    // display final score
    saveScore(score);
    updateScoreboard();
}

const scoresKey = 'wordRushScores';
const scoreboard = document.getElementById('scoreboard');
let scores = JSON.parse(localStorage.getItem(scoresKey)) || [];

function saveScore(hits) {
    const date = new Date().toLocaleDateString();
    scores.push({ hits, date });

    scores.sort((a, b) => b.hits - a.hits); // Sort by hits in descending order
    scores.splice(6); // top 6

    localStorage.setItem(scoresKey, JSON.stringify(scores));
}

function updateScoreboard() {
    scoreboard.innerHTML = '';

    if (scores.length === 0) {
        scoreboard.innerHTML = '<li>No games played yet.</li>';
        return;
    }

    scores.forEach((score, index) => {
        const scoreEntry = document.createElement('li');
        scoreEntry.textContent = `#${index + 1} - ${score.hits} words ${score.date}`;
        scoreboard.appendChild(scoreEntry);
    });
}