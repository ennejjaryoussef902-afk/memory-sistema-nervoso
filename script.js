// --- FILE: script.js (Sistema Nervoso - Nomi Estesi) ---

// PERCORSO: Stringa vuota "" perché i file sono nella cartella radice
const IMAGE_PATH_PREFIX = ""; 

// IMPOSTA L'ESTENSIONE CORRETTA QUI
const FILE_EXTENSION = ".jpg"; 

const bonePairs = [
    // 11 Coppie totali (22 carte) per il Sistema Nervoso
    
    // Strutture Principali
    { name: "Cervello", type: "text" }, { name: "Cervello", type: "image", content: "cervello" + FILE_EXTENSION },
    { name: "Cervelletto", type: "text" }, { name: "Cervelletto", type: "image", content: "cervelletto" + FILE_EXTENSION },
    { name: "Midollo Allungato", type: "text" }, { name: "Midollo Allungato", type: "image", content: "midollo_allungato" + FILE_EXTENSION },
    { name: "Midollo Spinale", type: "text" }, { name: "Midollo Spinale", type: "image", content: "midollo_spinale" + FILE_EXTENSION },
    
    // Strutture Neuronali
    { name: "Neurone", type: "text" }, { name: "Neurone", type: "image", content: "neurone" + FILE_EXTENSION },
    { name: "Corpo Cellulare", type: "text" }, { name: "Corpo Cellulare", type: "image", content: "corpo_cellulare" + FILE_EXTENSION },
    { name: "Assone", type: "text" }, { name: "Assone", type: "image", content: "assone" + FILE_EXTENSION },
    { name: "Dendriti", type: "text" }, { name: "Dendriti", type: "image", content: "dendriti" + FILE_EXTENSION },
    { name: "Sinapsi", type: "text" }, { name: "Sinapsi", type: "image", content: "sinapsi" + FILE_EXTENSION },
    
    // Divisioni del Sistema Nervoso (Nomi Completi)
    { name: "Sistema Nervoso Centrale", type: "text" }, { name: "Sistema Nervoso Centrale", type: "image", content: "sistema_nervoso_centrale" + FILE_EXTENSION },
    { name: "Sistema Nervoso Periferico", type: "text" }, { name: "Sistema Nervoso Periferico", type: "image", content: "sistema_nervoso_periferico" + FILE_EXTENSION },
    { name: "Sistema Nervoso Neurovegetativo", type: "text" }, { name: "Sistema Nervoso Neurovegetativo", type: "image", content: "sistema_nervoso_neurovegetativo" + FILE_EXTENSION }
];

let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0; 
const totalPairs = bonePairs.length / 2;
const gameBoard = document.getElementById('game-board');
const statusMessage = document.getElementById('status-message');

// Variabili per Timer e Audio
let timerInterval;
let seconds = 0;
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts-display');
const matchSound = document.getElementById('match-sound');
const failSound = document.getElementById('fail-sound');


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = '0:00';

    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function playSound(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play();
}


function initializeGame() {
    gameBoard.innerHTML = ''; 
    gameCards = [...bonePairs];
    shuffle(gameCards);
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;

    statusMessage.textContent = `Coppie trovate: 0 | Inizia il gioco!`;
    attemptsDisplay.textContent = '0';
    
    startTimer(); 

    // 11 coppie (22 carte), torniamo alla griglia 6x4 (24 spazi) che è la più adatta
    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)'; 
    
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => flipCard(cardElement));

        let cardContent;
        if (card.type === 'image') {
            const imagePath = IMAGE_PATH_PREFIX + card.content; 
            cardContent = `<img src="${imagePath}" alt="${card.name}" onerror="this.outerHTML='[MANCA IMMAGINE: ${card.name.toUpperCase()}]'">`;
        } else {
            cardContent = card.name;
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${cardContent}</div>
            </div>
        `;
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(cardElement) {
    if (flippedCards.length < 2 && 
        !cardElement.classList.contains('is-flipped') && 
        !cardElement.classList.contains('is-matched')) {
            
        cardElement.classList.add('is-flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsDisplay.textContent = attempts;
            setTimeout(checkForMatch, 1000); 
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.name === card2.dataset.name;

    if (isMatch) {
        playSound(matchSound);

        card1.classList.add('is-matched');
        card2.classList.add('is-matched');
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';

        matchedPairs++;
        statusMessage.textContent = `Coppia Trovata! Coppie trovate: ${matchedPairs}`;
        
        if (matchedPairs === totalPairs) {
            stopTimer();
            const finalTime = timerDisplay.textContent;
            setTimeout(() => {
                statusMessage.textContent = `🎉 Complimenti! Hai completato il Memory Game Sistema Nervoso in ${attempts} tentativi e in ${finalTime}! 🎉`;
            }, 500);
        }
    } else {
        playSound(failSound);
        
        card1.classList.remove('is-flipped');
        card2.classList.remove('is-flipped');
        statusMessage.textContent = `Riprova... Coppie trovate: ${matchedPairs}`;
    }
    flippedCards = [];
}

initializeGame();