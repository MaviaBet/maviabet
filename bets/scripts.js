const getRubiByCharId="https://script.google.com/macros/s/AKfycbxYMuor05vsh7T1NjieWQP9CLcjyU4QYLG0nc0KccMoOZ34XDoistuQ849a4I55-y0q7w/exec";
const getMaviaAlerta="https://script.google.com/macros/s/AKfycbzwxzuDlvXvaB5PyBm4VjAriOFvG2_gunc3kA37UqbBC0xDWFisWFVkZGj1XaVyCVvl/exec";
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
        { id: 1, name: 'Player 1', avatar: 'user.png', universalVotes: 100, userVotes: 5 },
        { id: 2, name: 'Player 2', avatar: 'user.png', universalVotes: 200, userVotes: 3 },
        { id: 3, name: 'Player 3', avatar: 'user.png', universalVotes: 150, userVotes: 4 },
        { id: 4, name: 'Player 4', avatar: 'user.png', universalVotes: 300, userVotes: 7 },
        { id: 5, name: 'Player 5', avatar: 'user.png', universalVotes: 240, userVotes: 2 },
        { id: 6, name: 'Player 6', avatar: 'user.png', universalVotes: 110, userVotes: 1 },
    ];


    // Datos del encabezado (P0)
    //let headerData;

    // Función para cargar los datos en la página
   async function loadPage() {

        const params = new URLSearchParams(window.location.search);
        chatId=params.get("chat_id");
       password=params.get("password");
        rubi=await getRubi(chatId);


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
        timerElement.textContent = formatTime(bettingTime);
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
                    addVoteToWarrior(warriorId);
                }
            });
        }
       loadVersion();
    }

// Define la versión
    const version = "v1.0.0"; // Cambia este valor cuando necesites actualizar la versión

// Función para cargar la versión en el DOM
    function loadVersion() {
        const versionElement = document.getElementById("version");
        versionElement.textContent = version; // Asigna la versión al elemento
    }


    // Función para añadir un voto al guerrero
    function addVoteToWarrior(warriorId) {
        const warrior = warriors.find(warrior => warrior.id == warriorId);
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
    function startBettingCountdown() {
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
                timerElement.textContent = formatTime(bettingTime);
            } else {
                clearInterval(countdownInterval);
                endBetting();
            }
        }, 1000);
    }

    // Función para finalizar las bets
    function endBetting() {
        currentState = 2;  // Estado de bets finalizadas
        const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.textContent = bettingStates[currentState];

        // Deshabilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = true;
        }

        // Mostrar resultados después de una breve pausa
        setTimeout(showResults, 10000);
    }

    // Función para mostrar los resultados
    function showResults() {
        currentState = 3;  // Estado de mostrando resultados
        const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.textContent = bettingStates[currentState];

        // Reiniciar el ciclo después de unos segundos
        setTimeout(resetBettingCycle, 10000);
    }

    // Función para reiniciar el ciclo de bets
    function resetBettingCycle() {
        currentState = 0;  // Estado de preparando bets
        bettingTime = 30;  // Restablecer el tiempo de bets
        const timerElement = document.querySelector('.timer');
        const bettingStateElement = document.querySelector('.betting-state');
        timerElement.textContent = formatTime(bettingTime);
        bettingStateElement.textContent = bettingStates[currentState];

        // Deshabilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = true;
        }

        // Volver a empezar el ciclo
        setTimeout(startBettingCountdown, 10000);
    }

    // Iniciar la página la primera vez
    loadPage();

    // Iniciar el ciclo de bets
    setTimeout(startBettingCountdown, 10000);  // Simulación de preparación durante 3 segundos


    function formatTime(seconds) {
        // Calcula horas, minutos y segundos
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // Formatea a dos dígitos
        const formattedTime = [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(secs).padStart(2, '0')
        ].join(':');

        return formattedTime;
    }

});




setInterval(async function() {
    if(chatId!==undefined){
const mavia_alerta=await getMaviaAlertaM(chatId);
if(mavia_alerta==='2'){

const rubi=await getRubi(chatId);
    const userElement = document.getElementById('header-user');
    const rubiElement = document.getElementById('header-rubi');
    userElement.textContent = 'User : ' + chatId;
    rubiElement.textContent = 'Rubi : ' + rubi;
}
}
}, 10*1000); // Escanear cada 60 segundos


   async function getMaviaAlertaM(charId) {
        const url = `${getMaviaAlerta}?action=getMaviaAlerta&char_id=${charId}&password=${password}`;
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
            console.error('Error fetching rubi:', error);
            return 'Error fetching rubi:'+error;
        }
    }


 async function getRubi(charId) {
        const url = `${getRubiByCharId}?action=getRubi&char_id=${charId}&password=${password}`;
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
            console.error('Error fetching rubi:', error);
            return 'Error fetching rubi:'+error;
        }
    }