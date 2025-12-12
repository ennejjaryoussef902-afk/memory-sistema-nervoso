// --- JAVASCRIPT: SISTEMA SCHELETRICO ---

// Definisci le coppie di carte (Ossa)
const bonePairs = [
    { name: "Femore", type: "text" },
    { name: "Femore", type: "description", content: "L'osso più lungo del corpo" },
    { name: "Cranio", type: "text" },
    { name: "Cranio", type: "description", content: "Protegge il cervello" },
    { name: "Costole", type: "text" },
    { name: "Costole", type: "description", content: "Proteggono cuore e polmoni" },
    { name: "Omero", type: "text" },
    { name: "Omero", type: "description", content: "Osso del braccio superiore" }
];

let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0; // Nuovo contatore
const totalPairs = bonePairs.length / 2;
const gameBoard = document.getElementById('game-board');
const statusMessage = document.getElementById('status-message');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeGame() {
    gameBoard.innerHTML = ''; 
    gameCards = [...bonePairs, ...bonePairs];
    shuffle(gameCards);
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    statusMessage.textContent = `Coppie trovate: 0 | Tentativi: 0`;

    // Regola la griglia per 8 carte (4x2)
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => flipCard(cardElement));

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${card.type === 'description' ? card.content : card.name}</div>
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
            statusMessage.textContent = `Coppie trovate: ${matchedPairs} | Tentativi: ${attempts}`;
            setTimeout(checkForMatch, 1000); 
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.name === card2.dataset.name;

    if (isMatch) {
        card1.classList.add('is-matched');
        card2.classList.add('is-matched');
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';

        matchedPairs++;
        statusMessage.textContent = `Coppie trovate: ${matchedPairs} | Tentativi: ${attempts}`;
        
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                statusMessage.textContent = `🎉 Complimenti! Hai completato il Memory Game Scheletrico in ${attempts} tentativi! 🎉`;
            }, 500);
        }
    } else {
        card1.classList.remove('is-flipped');
        card2.classList.remove('is-flipped');
        statusMessage.textContent = `Riprova... Coppie trovate: ${matchedPairs} | Tentativi: ${attempts}`;
    }
    flippedCards = [];
}

document.addEventListener('DOMContentLoaded', initializeGame);