
const getRubiByCharId='https://script.google.com/macros/s/AKfycbwaaZlwSWjhhlq5J_HdqiWE5e9tJoujjGQNYfRjDf66CiyNQeKPdwEY4lpApMbMqfcs/exec';
const getMaviaAlerta='https://script.google.com/macros/s/AKfycbzwxzuDlvXvaB5PyBm4VjAriOFvG2_gunc3kA37UqbBC0xDWFisWFVkZGj1XaVyCVvl/exec';

let chatId;
let rubi;
let password;

document.addEventListener('DOMContentLoaded', function() {
// Estados de bets
const bettingStates = [
        'Preparing bets...',  // Estado 0: preparación
        'Betting in progress...',     // Estado 1: bets activas
        'Finalized bets...',  // Estado 2: bets cerradas
        'Showing results...'   // Estado 3: resultados
    ];
let currentState = 0;  // Inicialmente en "Preparando bets"

// Configuración del cronómetro
let bettingTime = 30;  // Tiempo de bets en segundos
let countdownInterval;

// Datos de guerreros (P1)
const warriors = [
        { id: 1, name: 'Player 1', avatar: 'user_bets.png', universalVotes: 100, userVotes: 5 },
        { id: 2, name: 'Player 2', avatar: 'user_bets.png', universalVotes: 200, userVotes: 3 },
        { id: 3, name: 'Player 3', avatar: 'user_bets.png', universalVotes: 150, userVotes: 4 },
        { id: 4, name: 'Player 4', avatar: 'user_bets.png', universalVotes: 300, userVotes: 7 },
        { id: 5, name: 'Player 5', avatar: 'user_bets.png', universalVotes: 240, userVotes: 2 },
        { id: 6, name: 'Player 6', avatar: 'user_bets.png', universalVotes: 110, userVotes: 1 },
    ];

// Función para cargar los datos en la página
async function loadPage_Bets() {

        const params = new URLSearchParams(window.location.search);
        chatId=params.get("chat_id");
       password=params.get("password");
        rubi=await getRubi_Bets(chatId,password);


       const userElement = document.getElementById('header-user');
       const rubiElement = document.getElementById('header-rubi');
       userElement.textContent = 'User : ' + chatId;
       rubiElement.textContent = 'Rubi : ' + rubi;

       const warriorListContainer = document.querySelector('.warrior-list');
       warriorListContainer.innerHTML = ''; // Limpia la lista de guerreros

       // Cargar el cronómetro y estado de bets (Parte derecha)
        const headerRight = document.createElement('div');
        headerRight.classList.add('header-right');

        // Cronómetro
        const timerElement = document.createElement('div');
        timerElement.classList.add('timer');
        timerElement.textContent = formatTime_Bets(bettingTime);
        headerRight.appendChild(timerElement);

        // Estado de bets
        const bettingStateElement = document.createElement('div');
        bettingStateElement.classList.add('betting-state');
        bettingStateElement.textContent = bettingStates[currentState];
        headerRight.appendChild(bettingStateElement);

       const header = document.querySelector('.header');
        header.appendChild(headerRight);

        // Generar la lista de guerreros
        for (let i = 0; i < warriors.length; i++) {
            const warrior = warriors[i];
            const warriorItem = document.createElement('div');
            warriorItem.classList.add('warrior-item');
            warriorItem.setAttribute('data-id', warrior.id);
            warriorItem.innerHTML = `
                <div><img class="warrior-avatar" src="${warrior.avatar}" alt="${warrior.name}"></div>
                <div class="warrior-name">${warrior.name}</div>
                <div class="universal-votes">${warrior.universalVotes}</div>
                <div class="user-votes">${warrior.userVotes}</div>
                <div><button class="vote-button" data-id="${warrior.id}" disabled>Apostar</button></div>
            `;
            warriorListContainer.appendChild(warriorItem);
        }

        // Eventos para los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].addEventListener('click', function() {
                const warriorId = this.getAttribute('data-id');
                if (currentState === 1) {  // Solo permitir bets en el estado de bets activas
                    addVoteToWarrior_Bets(warriorId);
                }
            });
        }
       loadVersion_Bets();
    }

// Define la versión
const version = "v1.0.0"; // Cambia este valor cuando necesites actualizar la versión

// Función para cargar la versión en el DOM
function loadVersion_Bets() {
        const versionElement = document.getElementById("version");
        versionElement.textContent = version; // Asigna la versión al elemento
    }

// Función para añadir un voto al guerrero
function addVoteToWarrior_Bets(warriorId) {
        const warrior = warriors.find(warrior => warrior.id === warriorId);
        if (warrior) {
            // Incrementar los votos universales y los votos del usuario
            warrior.universalVotes += 1;
            warrior.userVotes += 1;

            // Actualizar los valores en la interfaz
            const warriorElement = document.querySelector(`.warrior-item[data-id="${warriorId}"]`);
            const universalVotesElement = warriorElement.querySelector('.universal-votes');
            const userVotesElement = warriorElement.querySelector('.user-votes');

            universalVotesElement.textContent = warrior.universalVotes;
            userVotesElement.textContent = warrior.userVotes;

            //console.log(`Apostaste por el guerrero: ${warrior.name}. Votos universales: ${warrior.universalVotes}, Votos del usuario: ${warrior.userVotes}`);
        }
    }

// Función para iniciar el cronómetro
function startBettingCountdown_Bets() {
        currentState = 1;  // Estado de bets activas
        const timerElement = document.querySelector('.timer');
        const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.textContent = bettingStates[currentState];

        // Habilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = false;
        }

        countdownInterval = setInterval(function() {
            if (bettingTime > 0) {
                bettingTime--;
                timerElement.textContent = formatTime_Bets(bettingTime);
            } else {
                clearInterval(countdownInterval);
                endBetting_Bets();
            }
        }, 1000);
    }

// Función para finalizar las bets
function endBetting_Bets() {
        currentState = 2;  // Estado de bets finalizadas
        const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.textContent = bettingStates[currentState];

        // Deshabilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = true;
        }

        // Mostrar resultados después de una breve pausa
        setTimeout(showResults_Bets, 10000);
    }

// Función para mostrar los resultados
function showResults_Bets() {
        currentState = 3;  // Estado de mostrando resultados
        const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.textContent = bettingStates[currentState];

        // Reiniciar el ciclo después de unos segundos
        setTimeout(resetBettingCycle_Bets, 10000);
    }

// Función para reiniciar el ciclo de bets
function resetBettingCycle_Bets() {
        currentState = 0;  // Estado de preparando bets
        bettingTime = 30;  // Restablecer el tiempo de bets
        const timerElement = document.querySelector('.timer');
        const bettingStateElement = document.querySelector('.betting-state');
        timerElement.textContent = formatTime_Bets(bettingTime);
        bettingStateElement.textContent = bettingStates[currentState];

        // Deshabilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = true;
        }

        // Volver a empezar el ciclo
        setTimeout(startBettingCountdown_Bets, 10000);
    }

// Iniciar la página la primera vez
// noinspection JSIgnoredPromiseFromCall
loadPage_Bets();

// Iniciar el ciclo de bets
setTimeout(startBettingCountdown_Bets, 10000);  // Simulación de preparación durante 3 segundos

function formatTime_Bets(seconds) {
        // Calcula horas, minutos y segundos
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // Formatea a dos dígitos
    return [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(secs).padStart(2, '0')
        ].join(':');
    }


 setInterval(async function() {
    if(chatId!==undefined&&password!==undefined){
const mavia_alerta=await getMaviaAlerta_Bets(chatId,password);
if(mavia_alerta==='2'){

const rubi=await getRubi_Bets(chatId,password);
    const userElement = document.getElementById('header-user');
    const rubiElement = document.getElementById('header-rubi');
    userElement.textContent = 'User : ' + chatId;
    rubiElement.textContent = 'Rubi : ' + rubi;
}
}
}, 10*1000); // Escanear cada 60 segundos



async function getMaviaAlerta_Bets(charId,password) {
        const url = `${getMaviaAlerta}?action=getMaviaAlerta&char_id=${charId}&password=${password}`;
       return await load_url_Bets(url);
    }


async function getRubi_Bets(charId, password) {
        const url = `${getRubiByCharId}?action=getRubi&char_id=${charId}&password=${password}`;
       return await load_url_Bets(url);
    }
    

    async function load_url_Bets(url){
 try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain', // O 'application/json' si es JSON
                },
            });
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return `HTTP error! Status: ${response.status}`;
            }
            // O .json() si es JSON
            return await response.text();
        } catch (error) {
            console.error('Error fetching :', error);
            return 'Error fetching :'+error;
        }
    }

});




