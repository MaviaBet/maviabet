
const getRubiByCharId='https://script.google.com/macros/s/AKfycbwaaZlwSWjhhlq5J_HdqiWE5e9tJoujjGQNYfRjDf66CiyNQeKPdwEY4lpApMbMqfcs/exec';
const getMaviaAlerta='https://script.google.com/macros/s/AKfycbzwxzuDlvXvaB5PyBm4VjAriOFvG2_gunc3kA37UqbBC0xDWFisWFVkZGj1XaVyCVvl/exec';
const updateMaviaAlerta='https://script.google.com/macros/s/AKfycbwK5ShC90SpgxHmLVDpNpuEjlHPCnU8WWFrM6yTiQHhbm-znekISUE-IsUQ7f4dt6f_dg/exec';
const getPlayersTop10="https://script.google.com/macros/s/AKfycbx-qZDfK87hipYeeMgD2AF9XZLODSPf9Z963ulghSEnsybify0DvFScmFMXux4Lquok/exec";
const getWithdrawAlerta="https://script.google.com/macros/s/AKfycbx9egDNcg5u6LcYOqwCuV99FQMeqkXg-_qaZcri1z1bA0fXcMpkCYdvf0Z-CznROXJWDg/exec";

const rubi_por_voto=0.01;

let chatId;
let rubi;
let rubi_base;
let password;

let alertDialog ;
let progressBarInner ;
let progressText ;
let overlay;
let percentage = 0;

const bettingTime_base= 60*3;/*3 Minutos*/ //Tiempo para apostar

let warriors;

let timerElement;
let bettingStateElement;

//let log;

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
let bettingTime =bettingTime_base ;  // Tiempo de bets en segundos
let countdownInterval;


// Función para cargar los datos en la página
async function loadPage_Bets() {


   // log=document.getElementById('log');

        const params = new URLSearchParams(window.location.search);
        chatId=params.get("chat_id");
       password=params.get("password");

    const withdrawAlerta=await getWithdrawAlerta_Bets(chatId,password);

    if(withdrawAlerta==='0') {
        warriors = await getWarriors(chatId, password);

        rubi = await getRubi_Bets(chatId, password);

        rubi_base = rubi;

        alertDialog = document.getElementById('alert-dialog');
        progressBarInner = document.querySelector('.progress-bar-inner');
        progressText = document.getElementById('progress-text');
        overlay = document.getElementById('overlay');
        percentage = 0;


        const userElement = document.getElementById('header-user');
        const rubiElement = document.getElementById('header-rubi');
        userElement.textContent = 'User : ' + chatId;
        rubiElement.textContent = 'Rubi : ' + rubi;

        const warriorListContainer = document.querySelector('.warrior-list');
        warriorListContainer.innerHTML = ''; // Limpia la lista de guerreros

        // Cargar el cronómetro y estado de bets (Parte derecha)
        ///const headerRight = document.createElement('div');
        //headerRight.classList.add('header-right');

        // Cronómetro
        timerElement = document.getElementById('timer_id');
        //timerElement.classList.add('timer');
        timerElement.innerHTML = formatTime_Bets(bettingTime);
        //headerRight.appendChild(timerElement);

        // Estado de bets
        bettingStateElement = document.getElementById('betting-state_id');
        //bettingStateElement.classList.add('betting-state');
        bettingStateElement.innerHTML = bettingStates[currentState];
        //headerRight.appendChild(bettingStateElement);

        //const header = document.querySelector('.header');
        //header.appendChild(headerRight);

        // Generar la lista de guerreros
        for (let i = 0; i < warriors.length; i++) {
            const warrior = warriors[i];
            const warriorItem = document.createElement('div');
            warriorItem.classList.add('warrior-item');
            warriorItem.setAttribute('data-id', warrior.id);
            warriorItem.innerHTML = `
                <div><img class="warrior-avatar" src="${warrior.avatar}" alt="-"></div>
                <div class="warrior-name">${await ajustarWarriorName(warrior.name)}</div>
                <div class="universal-votes">${await ajustarVotos(warrior.universalVotes)}</div>
                <div class="user-votes">${await ajustarVotos(warrior.userVotes)}</div>
                <div><button class="vote-button" data-id="${warrior.id}" disabled>Apostar</button></div>
            `;
            warriorListContainer.appendChild(warriorItem);
        }

        // Eventos para los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].addEventListener('click', async function () {
                const warriorId = this.getAttribute('data-id');
                if (currentState === 1) {  // Solo permitir bets en el estado de bets activas
                    await addVoteToWarrior_Bets(warriorId);
                }
            });
        }
        await loadVersion_Bets();
        // Iniciar el ciclo de bets
        setTimeout(startBettingCountdown_Bets, 10000);  // Simulación de preparación durante 3 segundos
    }else{

        if(withdrawAlerta==='1'||withdrawAlerta==='2'||withdrawAlerta==='3'){
        showModalAlert_Bets('You have a withdrawal in process, once your withdrawal is completed you can place bets');

    }
    }
}

// Define la versión
const version = "v1.0.0"; // Cambia este valor cuando necesites actualizar la versión

// Función para cargar la versión en el DOM
async function loadVersion_Bets() {
        const versionElement = document.getElementById("version");
        versionElement.textContent = version; // Asigna la versión al elemento
    }

// Función para añadir un voto al guerrero
async function addVoteToWarrior_Bets(warriorId) {
        let warrior=await getWarriorById(warriorId);
        const rubi_anterior=rubi;

        if (warrior) {


            //TODO RUBI POR CADA VOTO
            rubi=rubi-rubi_por_voto;//0.01 rubi es igual a un voto
            rubi=rubi.toFixed(2);
            
            if(rubi<0){
                rubi=rubi_anterior;
            }else{

// Incrementar los votos universales y los votos del usuario
warrior.universalVotes += 1;
warrior.userVotes += 1;

            // Actualizar los valores en la interfaz
            const warriorElement = document.querySelector(`.warrior-item[data-id="${warriorId}"]`);
            const universalVotesElement = warriorElement.querySelector('.universal-votes');
            const userVotesElement = warriorElement.querySelector('.user-votes');
            const rubiElement = document.getElementById('header-rubi');
// Uso en el código
                universalVotesElement.innerHTML = await ajustarVotos(warrior.universalVotes);
                userVotesElement.innerHTML = await ajustarVotos(warrior.userVotes);
                rubiElement.textContent = 'Rubi : ' + rubi;

            //console.log(`Apostaste por el guerrero: ${warrior.name}. Votos universales: ${warrior.universalVotes}, Votos del usuario: ${warrior.userVotes}`);
        }
        }
    }

// Función para iniciar el cronómetro
function startBettingCountdown_Bets() {
        currentState = 1;  // Estado de bets activas
        //const timerElement = document.querySelector('.timer');
        //const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.innerHTML = bettingStates[currentState];

        // Habilitar los botones de apostar
        const voteButtons = document.querySelectorAll('.vote-button');
        for (let i = 0; i < voteButtons.length; i++) {
            voteButtons[i].disabled = false;
        }

        countdownInterval = setInterval(function() {
            if (bettingTime > 0) {
                bettingTime--;
                timerElement.innerHTML = formatTime_Bets(bettingTime);
            } else {
                clearInterval(countdownInterval);
                endBetting_Bets();
            }
        }, 1000);
    }

// Función para finalizar las bets
function endBetting_Bets() {
        currentState = 2;  // Estado de bets finalizadas
        //const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.innerHTML = bettingStates[currentState];

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
        //const bettingStateElement = document.querySelector('.betting-state');
        bettingStateElement.innerHTML = bettingStates[currentState];

        // Reiniciar el ciclo después de unos segundos
        setTimeout(resetBettingCycle_Bets, 10000);
    }

// Función para reiniciar el ciclo de bets
function resetBettingCycle_Bets() {
        currentState = 0;  // Estado de preparando bets
        bettingTime = bettingTime_base;  // Restablecer el tiempo de bets
        //const timerElement = document.querySelector('.timer');
        //const bettingStateElement = document.querySelector('.betting-state');
        timerElement.innerHTML= formatTime_Bets(bettingTime);
        bettingStateElement.innerHTML = bettingStates[currentState];

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
    showDialog_Bets();
    const rubi_actualizado=await getRubi_Bets(chatId,password);
    const rubi_depositado=rubi_actualizado-rubi_base;
    rubi_base=rubi_depositado;
    rubi_base=rubi_base.toFixed(2);
    rubi=rubi+rubi_depositado;
    rubi=rubi.toFixed(2);
    updateProgressBar_Bets(50); // Update the progress bar to 50%
    const userElement = document.getElementById('header-user');
    const rubiElement = document.getElementById('header-rubi');
    userElement.textContent = 'User : ' + chatId;
    rubiElement.textContent = 'Rubi : ' + rubi;
    await updateMaviaAlerta_Bets(chatId,'0',password);
    updateProgressBar_Bets(1000); // Update the progress bar to 50%
    closeDialog_Bets();
}
}
}, 10*1000); // Escanear cada 60 segundos


async function updateMaviaAlerta_Bets(charId, newMavia,password) {
// URL del Web App con parámetros char_id y new_mavia_alerta
const url = `${updateMaviaAlerta}?action=updateMaviaAlerta&char_id=${charId}&new_mavia_alerta=${newMavia}&password=${password}`;
return await load_url_Bets(url);
}


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




// Function to show the dialog
function showDialog_Bets(){
    overlay.style.display = 'block'; /* Muestra el overlay */
    alertDialog.style.display = 'block'; /* Muestra la barra de progreso */
}

// Function to close the dialog
function closeDialog_Bets() {
    overlay.style.display = 'none'; /* Oculta el overlay */
    alertDialog.style.display = 'none'; /* Oculta la barra de progreso */
}

// Function to update the progress bar
function updateProgressBar_Bets(percentage) {
    progressBarInner.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% Complete`;
}


async function getWarriors(chatId,password){
await loadWarriorsData(chatId,password);
return [
        { id: '1', name: warrior_data_name_1, avatar: warrior_data_avatar_1, universalVotes: 0, userVotes: 0 },
        { id: '2', name: warrior_data_name_2, avatar: warrior_data_avatar_2, universalVotes: 0, userVotes: 0 },
        { id: '3', name: warrior_data_name_3, avatar: warrior_data_avatar_3, universalVotes: 0, userVotes: 0 },
        { id: '4', name: warrior_data_name_4, avatar: warrior_data_avatar_4, universalVotes: 0, userVotes: 0 },
        { id: '5', name: warrior_data_name_5, avatar: warrior_data_avatar_5, universalVotes: 0, userVotes: 0 }
        //{ id: '6', name: 'Player 6', avatar: 'user_bets.png', universalVotes: 110, userVotes: 0 },
    ];
}


async function getWarriorById(id) {

    for (let i = 0; i < warriors.length; i++) {
        if (warriors[i].id === id) { // Comparar el ID
            return warriors[i]; // Retornar el guerrero encontrado
        }
    }
    return null; // Retornar null si no se encuentra el guerrero
}


let warrior_data_name_1;
let warrior_data_name_2;
let warrior_data_name_3;
let warrior_data_name_4;
let warrior_data_name_5;

let warrior_data_avatar_1;
let warrior_data_avatar_2;
let warrior_data_avatar_3;
let warrior_data_avatar_4;
let warrior_data_avatar_5;


async function loadWarriorsData(chatId,password){
const playersTop10=await getPlayersTop10M(chatId,password);
//log.innerHTML=playersTop10;
const separacion='Vs8GaPUY0Sz2c8zbnWijaWh';
const lista_warriors=playersTop10.split(separacion);
const url0='https://prod-mavia-avatars.s3.us-west-1.amazonaws.com/';
const url1='/avatar.jpeg';
/////////////////////////////////////
let dataA1=lista_warriors[0];dataA1=dataA1.substring(3);
warrior_data_name_1=dataA1;
let dataB1=lista_warriors[1];dataB1=dataB1.substring(3);dataB1=dataB1.replaceAll('_','-');
let dataC1=lista_warriors[2];dataC1=dataC1.substring(3);
if(dataC1==='0'){
warrior_data_avatar_1='user_bets.png'
}else{
warrior_data_avatar_1=url0+dataB1+url1;
}
///////////////////////////////////////
let dataA2=lista_warriors[3];dataA2=dataA2.substring(3);
warrior_data_name_2=dataA2;
let dataB2=lista_warriors[4];dataB2=dataB2.substring(3);dataB2=dataB2.replaceAll('_','-');
let dataC2=lista_warriors[5];dataC2=dataC2.substring(3);
if(dataC2==='0'){
warrior_data_avatar_2='user_bets.png'
}else{
warrior_data_avatar_2=url0+dataB2+url1;
}
///////////////////////////////////////
let dataA3=lista_warriors[6];dataA3=dataA3.substring(3);
warrior_data_name_3=dataA3;
let dataB3=lista_warriors[7];dataB3=dataB3.substring(3);dataB3=dataB3.replaceAll('_','-');
let dataC3=lista_warriors[8];dataC3=dataC3.substring(3);
if(dataC3==='0'){
warrior_data_avatar_3='user_bets.png'
}else{
warrior_data_avatar_3=url0+dataB3+url1;
}
///////////////////////////////////////
let dataA4=lista_warriors[9];dataA4=dataA4.substring(3);
warrior_data_name_4=dataA4;
let dataB4=lista_warriors[10];dataB4=dataB4.substring(3);dataB4=dataB4.replaceAll('_','-');
let dataC4=lista_warriors[11];dataC4=dataC4.substring(3);
if(dataC4==='0'){
warrior_data_avatar_4='user_bets.png'
}else{
warrior_data_avatar_4=url0+dataB4+url1;
}
///////////////////////////////////////
let dataA5=lista_warriors[12];dataA5=dataA5.substring(3);
warrior_data_name_5=dataA5;
let dataB5=lista_warriors[13];dataB5=dataB5.substring(3);dataB5=dataB5.replaceAll('_','-');
let dataC5=lista_warriors[14];dataC5=dataC5.substring(3);
if(dataC5==='0'){
warrior_data_avatar_5='user_bets.png'
}else{
warrior_data_avatar_5=url0+dataB5+url1;
}
///////////////////////////////////////
}

async function getPlayersTop10M(charId, password) {
const url = `${getPlayersTop10}?action=getPlayersTop10&char_id=${charId}&password=${password}`;
return await load_url_Bets(url);
}


    async function ajustarWarriorName(name) {
        // Si el nombre es más largo que 12 caracteres, lo truncamos a 12 caracteres
        if (name.length > 12) {
            return name.substring(0, 12);
        }
        // Si el nombre es más corto que 12 caracteres, lo rellenamos con espacios al final
        else if (name.length < 12) {
            return name.padEnd(12, ' ');
        }
        // Si el nombre ya tiene 12 caracteres, lo devolvemos tal cual
        else {
            return name;
        }
    }



    async function ajustarVotosA(votos) {
        // Convertir el voto a cadena
        const votos_s = votos.toString();

        // Si el voto tiene exactamente 7 caracteres, lo retornamos tal cual
        if (votos_s.length === 7) {
            return votos_s;
        }
        // Si el voto tiene menos de 7 caracteres, lo rellenamos con ceros a la izquierda
        else if (votos_s.length < 7) {
            return votos_s.padStart(7, '0');
        }
        // Si el voto es más largo que 7 caracteres, lo truncamos a 7 caracteres
        else {
            return votos_s.substring(0, 7);
        }
    }

    async function ajustarVotos(votos) {
        // Asegúrate de que votos sea un número
        let votosDisplay = await ajustarVotosA(votos); // Llama a ajustarVotosA para obtener el formato adecuado

        // Manejar los ceros a la izquierda
         // Envuelve solo los ceros a la izquierda
        return votosDisplay.replace(/^0+/, (match) => `<span class="vote-zero">${match}</span>`); // Devuelve el número con el estilo aplicado
    }

    async function getWithdrawAlerta_Bets(charId,password) {
        const url = `${getWithdrawAlerta}?action=getWithdrawAlerta&char_id=${charId}&password=${password}`;
        return await load_url_Bets(url);
    }


});


function showModalAlert_Bets(message) {
    const modal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message; // Cambia el texto del mensaje
    modal.style.display = "block"; // Mostrar el modal
}


function closeModalAlert_Bets() {
    const modal = document.getElementById("errorModal");
    modal.style.display = "none"; // Ocultar el modal
}

//a1=Andrey001Vs8GaPUY0Sz2c8zbnWijaWhb1=b5cfe23b-562a-456b-943f-227494c7419dVs8GaPUY0Sz2c8zbnWijaWhc1=1Vs8GaPUY0Sz2c8zbnWijaWha2=coronel TVs8GaPUY0Sz2c8zbnWijaWhb2=7689a82c-8597-4efd-8677-d83b2378f8adVs8GaPUY0Sz2c8zbnWijaWhc2=0Vs8GaPUY0Sz2c8zbnWijaWha3=AmedeoVs8GaPUY0Sz2c8zbnWijaWhb3=ebe1873c-7647-4088-af1a-92408607bd56Vs8GaPUY0Sz2c8zbnWijaWhc3=0Vs8GaPUY0Sz2c8zbnWijaWha4=InfernunsmindVs8GaPUY0Sz2c8zbnWijaWhb4=2c69e2be-6b3f-428e-97bf-15782e6dbc00Vs8GaPUY0Sz2c8zbnWijaWhc4=0Vs8GaPUY0Sz2c8zbnWijaWha5=Roman^Vs8GaPUY0Sz2c8zbnWijaWhb5=f39a8425-3417-46e8-9c74-e47f2cd6d89aVs8GaPUY0Sz2c8zbnWijaWhc5=0Vs8GaPUY0Sz2c8zbnWijaWhy=182169Vs8GaPUY0Sz2c8zbnWijaWhz=182159


//?chat_id=6838756361&wallet_address=0xefd6aea31b1c75dcb120a886d89750f1f562ca75&password=4moWeQxIgc1HYpmMRHPk5Kiv1pe1upim

//a1_Andrey001Vs8GaPUY0Sz2c8zbnWijaWhb1_b5cfe23b_562a_456b_943f_227494c7419dVs8GaPUY0Sz2c8zbnWijaWhc1_1Vs8GaPUY0Sz2c8zbnWijaWha2_coronel_TVs8GaPUY0Sz2c8zbnWijaWhb2_7689a82c_8597_4efd_8677_d83b2378f8adVs8GaPUY0Sz2c8zbnWijaWhc2_0Vs8GaPUY0Sz2c8zbnWijaWha3_AmedeoVs8GaPUY0Sz2c8zbnWijaWhb3_ebe1873c_7647_4088_af1a_92408607bd56Vs8GaPUY0Sz2c8zbnWijaWhc3_0Vs8GaPUY0Sz2c8zbnWijaWha4_InfernunsmindVs8GaPUY0Sz2c8zbnWijaWhb4_2c69e2be_6b3f_428e_97bf_15782e6dbc00Vs8GaPUY0Sz2c8zbnWijaWhc4_0Vs8GaPUY0Sz2c8zbnWijaWha5_Roman_Vs8GaPUY0Sz2c8zbnWijaWhb5_f39a8425_3417_46e8_9c74_e47f2cd6d89aVs8GaPUY0Sz2c8zbnWijaWhc5_0Vs8GaPUY0Sz2c8zbnWijaWhy_182169Vs8GaPUY0Sz2c8zbnWijaWhz_182159_

