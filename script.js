// Variáveis globais
let currentPlayer = 'X'; // 'X' é o jogador humano, 'O' é o computador
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isHumanTurn = true; // Controla de quem é a vez

// Elementos do DOM
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const themeToggleButton = document.getElementById('theme-toggle');
const bodyElement = document.body;

// Função para criar o tabuleiro
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
}

// Função para lidar com o clique em uma célula (jogada do humano)
function handleCellClick(event) {
    if (!isHumanTurn || !gameActive) return; // Só permite jogadas do humano na vez dele

    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] === '') {
        makeMove(index, currentPlayer); // Jogada do humano
        if (gameActive) {
            isHumanTurn = false; // Passa a vez para o computador
            setTimeout(computerMove, 500); // Computador joga após 500ms
        }
    }
}

// Função para fazer uma jogada
function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player);

    if (checkWinner()) {
        statusElement.textContent = player === 'X' ? translations[currentLanguage]["playerXWins"] : translations[currentLanguage]["playerOWins"];
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        statusElement.textContent = translations[currentLanguage]["draw"];
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Alterna o jogador
    statusElement.textContent = translations[currentLanguage]["playerTurn"].replace("X", currentPlayer);
}

// Função para a jogada do computador usando Minimax
function computerMove() {
    if (!gameActive) return;

    const bestMove = getBestMove();
    makeMove(bestMove, 'O'); // Computador sempre joga como 'O'
    isHumanTurn = true; // Passa a vez de volta para o humano
}

// Função para encontrar a melhor jogada usando Minimax
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // Faz uma jogada simulada
            const score = minimax(board, 0, false); // Calcula a pontuação da jogada
            board[i] = ''; // Desfaz a jogada simulada

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Algoritmo Minimax
function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1, // Vitória do humano
        O: 1,  // Vitória do computador
        draw: 0 // Empate
    };

    // Verifica se há um vencedor ou empate
    const winner = checkWinner();
    if (winner === 'X') return scores.X;
    if (winner === 'O') return scores.O;
    if (board.every(cell => cell !== '')) return scores.draw;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // Jogada do computador
                const score = minimax(board, depth + 1, false);
                board[i] = ''; // Desfaz a jogada
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Jogada do humano
                const score = minimax(board, depth + 1, true);
                board[i] = ''; // Desfaz a jogada
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Função para verificar o vencedor
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Retorna o jogador vencedor ('X' ou 'O')
        }
    }
    return null; // Nenhum vencedor
}

// Função para reiniciar o jogo
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    isHumanTurn = true;
    statusElement.textContent = translations[currentLanguage]["playerTurn"].replace("X", currentPlayer);
    boardElement.innerHTML = '';
    createBoard();
}

// Função para alternar entre os modos claro e escuro
function toggleTheme() {
    if (bodyElement.classList.contains('light-mode')) {
        bodyElement.classList.remove('light-mode');
        bodyElement.classList.add('dark-mode');
        themeToggleButton.textContent = 'Modo Claro';
    } else {
        bodyElement.classList.remove('dark-mode');
        bodyElement.classList.add('light-mode');
        themeToggleButton.textContent = 'Modo Escuro';
    }
}

// Traduções
const translations = {
    pt: {
        title: "Jogo da Velha",
        darkMode: "Modo Escuro",
        changeLanguage: "Change to Portuguese",
        playerTurn: "Vez do jogador X",
        resetGame: "Reiniciar Jogo",
        playerXWins: "Jogador X venceu!",
        playerOWins: "Jogador O venceu!",
        draw: "Empate!",
    },
    en: {
        title: "Tic Tac Toe",
        darkMode: "Dark Mode",
        changeLanguage: "Mudar para Inglês",
        playerTurn: "Player X's turn",
        resetGame: "Reset Game",
        playerXWins: "Player X wins!",
        playerOWins: "Player O wins!",
        draw: "It's a draw!",
    },
};

let currentLanguage = "pt"; // Idioma padrão

// Função para atualizar os textos na página
function updateTexts() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        element.textContent = translations[currentLanguage][key];
    });

    // Atualiza o texto do botão de idioma
    const languageToggleButton = document.getElementById("language-toggle");
    languageToggleButton.textContent =
        currentLanguage === "pt"
            ? translations["en"]["changeLanguage"]
            : translations["pt"]["changeLanguage"];
}

// Função para alternar o idioma
function toggleLanguage() {
    currentLanguage = currentLanguage === "pt" ? "en" : "pt";
    updateTexts();
}

// Inicializa os textos
updateTexts();

// Inicializa o jogo
createBoard();
resetButton.addEventListener('click', resetGame);
themeToggleButton.addEventListener('click', toggleTheme);
document.getElementById("language-toggle").addEventListener("click", toggleLanguage);