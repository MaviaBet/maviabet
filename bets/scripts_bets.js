
const getRubiByCharId='https://script.google.com/macros/s/AKfycbwaaZlwSWjhhlq5J_HdqiWE5e9tJoujjGQNYfRjDf66CiyNQeKPdwEY4lpApMbMqfcs/exec';
const getMaviaAlerta='https://script.google.com/macros/s/AKfycbzwxzuDlvXvaB5PyBm4VjAriOFvG2_gunc3kA37UqbBC0xDWFisWFVkZGj1XaVyCVvl/exec';
const getPlayersTop10="https://script.google.com/macros/s/AKfycbx-qZDfK87hipYeeMgD2AF9XZLODSPf9Z963ulghSEnsybify0DvFScmFMXux4Lquok/exec";
const getWithdrawAlerta="https://script.google.com/macros/s/AKfycbx9egDNcg5u6LcYOqwCuV99FQMeqkXg-_qaZcri1z1bA0fXcMpkCYdvf0Z-CznROXJWDg/exec";
const getSendBetsAlerta='https://script.google.com/macros/s/AKfycbxNSE1Xa4HWrTxLZ4aR2FWhbFgeYKfYUOgx_4qt73_doYJHmJ97cI-CxsUTYcn9fe-w/exec';
const sendBetsAlerta='https://script.google.com/macros/s/AKfycbyIkLgIrRwpFyBZlfHAcP3ORdjt3vn23Mj1t_0VabGvizyJSH_NMxvb0javLjTNTAciVg/exec';
const sendBets='https://script.google.com/macros/s/AKfycbw0lQg-ZylrZHsLeBNbcOdWi5FFAyPFOuIErMYt9QZIByXtJDs6dm3SF91Luw-qKa6ovw/exec';

const rubi_por_voto=0.01;
let rubi_por_voto_multiplicador=1;

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

let bottomMultiplicador;
let bottomSendBets;

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
  //log=document.getElementById('log');

  alertDialog = document.getElementById('alert-dialog');
  progressBarInner = document.querySelector('.progress-bar-inner');
  progressText = document.getElementById('progress-text');
  overlay = document.getElementById('overlay');
  percentage = 0;

  showDialog_Bets();
  updateProgressBar_Bets(10);

  const params = new URLSearchParams(window.location.search);
  chatId=params.get("chat_id");
  password=params.get("password");

  const withdrawAlerta=await getWithdrawAlerta_Bets(chatId,password);
  updateProgressBar_Bets(20);
  if(withdrawAlerta==='0') {
   const mavia_alerta = await getMaviaAlerta_Bets(chatId, password);
   updateProgressBar_Bets(30);
   if(mavia_alerta==='0'){

    warriors = await getWarriors_Bets(chatId, password);
    updateProgressBar_Bets(40);
    rubi = await getRubi_Bets(chatId, password);
    updateProgressBar_Bets(50);

    rubi_base = rubi;



    const userElement = document.getElementById('header-user');
    const rubiElement = document.getElementById('header-rubi');
    userElement.textContent = 'User : ' + chatId;
    rubiElement.textContent = 'Rubi : ' + rubi;

    const warriorListContainer = document.querySelector('.warrior-list');
    warriorListContainer.innerHTML = ''; // Limpia la lista de guerreros

    // Cronómetro
    timerElement = document.getElementById('timer_id');
    timerElement.innerHTML = formatTime_Bets(bettingTime);

    // Estado de bets
    bettingStateElement = document.getElementById('betting-state_id');
    bettingStateElement.innerHTML = bettingStates[currentState];

    bottomMultiplicador=document.getElementById('bottom-multiplicador');
    bottomMultiplicador.innerHTML =`x${rubi_por_voto_multiplicador}`;

    bottomMultiplicador.addEventListener('click', async function () {
     if(rubi_por_voto_multiplicador===1){rubi_por_voto_multiplicador=5;}else{
      if(rubi_por_voto_multiplicador===5){rubi_por_voto_multiplicador=10;}else{
      if(rubi_por_voto_multiplicador===10){rubi_por_voto_multiplicador=25;}else{
       if(rubi_por_voto_multiplicador===25){rubi_por_voto_multiplicador=50;}else{
        if(rubi_por_voto_multiplicador===50){rubi_por_voto_multiplicador=100;}else{
       rubi_por_voto_multiplicador=1;
     }}}}}

     bottomMultiplicador.innerHTML =`x${rubi_por_voto_multiplicador}`;
     });

    bottomSendBets=document.getElementById('bottom-send-bets');
    bottomSendBets.addEventListener('click', async function () {
     showDialog_Bets();
     const sendBetsAlerta=await getSendBetsAlertaM_Bets(chatId,password);
     //log.innerHTML='sendBetsAlerta : '+sendBetsAlerta;
     if(sendBetsAlerta==='0'){
     updateProgressBar_Bets(10);
const warrior1 = await getWarriorById_Bets('1'); // Obtén el guerrero
const bet1 = warrior1 ? warrior1.userVotes : 0; // Verifica si el guerrero fue encontrado
     updateProgressBar_Bets(20);
      const warrior2 = await getWarriorById_Bets('2'); // Obtén el guerrero
      const bet2 = warrior2 ? warrior2.userVotes : 0; // Verifica si el guerrero fue encontrado
     updateProgressBar_Bets(30);
      const warrior3 = await getWarriorById_Bets('3'); // Obtén el guerrero
      const bet3 = warrior3 ? warrior3.userVotes : 0; // Verifica si el guerrero fue encontrado
      updateProgressBar_Bets(40);
      const warrior4 = await getWarriorById_Bets('4'); // Obtén el guerrero
      const bet4 = warrior4 ? warrior4.userVotes : 0; // Verifica si el guerrero fue encontrado
      updateProgressBar_Bets(50);
      const warrior5 = await getWarriorById_Bets('5'); // Obtén el guerrero
      const bet5 = warrior5 ? warrior5.userVotes : 0; // Verifica si el guerrero fue encontrado
      updateProgressBar_Bets(60);
     await sendBetsM_Bets(chatId,password,`${bet1}_${bet2}_${bet3}_${bet4}_${bet5}`);
     updateProgressBar_Bets(80);
     await resetearVotos_Bets();
     updateProgressBar_Bets(90);
     await sendBetsAlertaM_Bets(chatId,password,'1');
     updateProgressBar_Bets(100);
     closeDialog_Bets();
     showModalAlert_Bets('Bets submitted');
     }else{
      closeDialog_Bets();
      showModalAlert_Bets('Processing bets');
     }
    });

    // Generar la lista de guerreros
    for (let i = 0; i < warriors.length; i++) {
     const warrior = warriors[i];
     const warriorItem = document.createElement('div');
     warriorItem.classList.add('warrior-item');
     warriorItem.setAttribute('data-id', warrior.id);
     warriorItem.innerHTML = `
                <div><img class="warrior-avatar" src="${warrior.avatar}" alt="-"></div>
                <div class="warrior-name">${await ajustarWarriorName_Bets(warrior.name)}</div>
                <div class="user-votes">${await ajustarVotos_Bets(warrior.userVotes)}</div>
                <div><button class="vote-button" data-id="${warrior.id}" disabled>Bet</button></div>
            `;
     //TODO -> futuro <div class="universal-votes">${await ajustarVotos(warrior.universalVotes)}</div>
     warriorListContainer.appendChild(warriorItem);
    }

    updateProgressBar_Bets(60);
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
    updateProgressBar_Bets(80);
    await loadVersion_Bets();
    updateProgressBar_Bets(100);
    closeDialog_Bets();


    // Iniciar el ciclo de bets
    setTimeout(startBettingCountdown_Bets, 10000);  // Simulación de preparación durante 3 segundos



   }else{
    if(mavia_alerta==='1'||mavia_alerta==='2'||mavia_alerta==='3'){
     showModalAlert_Bets('You have a deposit in process, once your deposit is completed you can place bets');
    }
   }
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
  let warrior=await getWarriorById_Bets(warriorId);
  const rubi_anterior=rubi;

  if (warrior) {


   //TODO RUBI POR CADA VOTO
   rubi=rubi-(rubi_por_voto*rubi_por_voto_multiplicador);//0.01 rubi es igual a un voto
   rubi=rubi.toFixed(2);

   if(rubi<0){
    rubi=rubi_anterior;
   }else{

// Incrementar los votos universales y los votos del usuario
    warrior.universalVotes = warrior.universalVotes+rubi_por_voto_multiplicador;
    warrior.userVotes = warrior.userVotes+rubi_por_voto_multiplicador;

    // Actualizar los valores en la interfaz
    const warriorElement = document.querySelector(`.warrior-item[data-id="${warriorId}"]`);
    //TODO -> FUTURO const universalVotesElement = warriorElement.querySelector('.universal-votes');
    const userVotesElement = warriorElement.querySelector('.user-votes');
    const rubiElement = document.getElementById('header-rubi');
// Uso en el código
    //TODO -> FUTURO universalVotesElement.innerHTML = await ajustarVotos(warrior.universalVotes);
    userVotesElement.innerHTML = await ajustarVotos_Bets(warrior.userVotes);
    rubiElement.textContent = 'Rubi : ' + rubi;

   }
  }
 }

// Función para iniciar el cronómetro
 function startBettingCountdown_Bets() {
  currentState = 1;  // Estado de bets activas
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
  bettingStateElement.innerHTML = bettingStates[currentState];

  // Reiniciar el ciclo después de unos segundos
  setTimeout(resetBettingCycle_Bets, 10000);
 }

// Función para reiniciar el ciclo de bets
 async function resetBettingCycle_Bets() {
  currentState = 0;  // Estado de preparando bets
  bettingTime = bettingTime_base;  // Restablecer el tiempo de bets
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


 async function getWarriors_Bets(chatId,password){
  await loadWarriorsData_Bets(chatId,password);
  return [
   { id: '1', name: warrior_data_name_1, avatar: warrior_data_avatar_1, universalVotes: 0, userVotes: 0 },
   { id: '2', name: warrior_data_name_2, avatar: warrior_data_avatar_2, universalVotes: 0, userVotes: 0 },
   { id: '3', name: warrior_data_name_3, avatar: warrior_data_avatar_3, universalVotes: 0, userVotes: 0 },
   { id: '4', name: warrior_data_name_4, avatar: warrior_data_avatar_4, universalVotes: 0, userVotes: 0 },
   { id: '5', name: warrior_data_name_5, avatar: warrior_data_avatar_5, universalVotes: 0, userVotes: 0 }
   //{ id: '6', name: 'Player 6', avatar: 'user_bets.png', universalVotes: 110, userVotes: 0 },
  ];
 }


 async function getWarriorById_Bets(id) {

  for (let i = 0; i < warriors.length; i++) {
   if (warriors[i].id === `${id}`) { // Comparar el ID
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


 async function loadWarriorsData_Bets(chatId,password){
  const playersTop10=await getPlayersTop10M_Bets(chatId,password);
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

 async function getPlayersTop10M_Bets(charId, password) {
  const url = `${getPlayersTop10}?action=getPlayersTop10&char_id=${charId}&password=${password}`;
  return await load_url_Bets(url);
 }


 async function ajustarWarriorName_Bets(name) {
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



 async function ajustarVotosA_Bets(votos) {
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

 async function ajustarVotos_Bets(votos) {
  // Asegúrate de que votos sea un número
  let votosDisplay = await ajustarVotosA_Bets(votos); // Llama a ajustarVotosA para obtener el formato adecuado

  // Manejar los ceros a la izquierda
  // Envuelve solo los ceros a la izquierda
  return votosDisplay.replace(/^0+/, (match) => `<span class="vote-zero">${match}</span>`); // Devuelve el número con el estilo aplicado
 }

 async function getWithdrawAlerta_Bets(charId,password) {
  const url = `${getWithdrawAlerta}?action=getWithdrawAlerta&char_id=${charId}&password=${password}`;
  return await load_url_Bets(url);
 }


 async function getSendBetsAlertaM_Bets(charId,password) {
  // URL del Web App con parámetros char_id y new_mavia_alerta
  const url = `${getSendBetsAlerta}?action=getSendBetsAlerta&char_id=${charId}&password=${password}`;
return await load_url_Bets(url);
 }

 async function sendBetsAlertaM_Bets(charId,password,betsAlerta) {
  // URL del Web App con parámetros char_id y new_mavia_alerta
  const url = `${sendBetsAlerta}?action=updateSendBetsAlerta&char_id=${charId}&betsAlerta=${betsAlerta}&password=${password}`;
 return await load_url_Bets(url);
 }

 async function sendBetsM_Bets(charId,password,bets) {
  // URL del Web App con parámetros char_id y new_mavia_alerta
  const url = `${sendBets}?action=updateSendBets&char_id=${charId}&bets=${bets}&password=${password}`;
return await load_url_Bets(url);
 }


 async function resetearVotos_Bets(){
  for(let id=1;id<6;id++){
  const warriorElement = document.querySelector(`.warrior-item[data-id="${id}"]`);
  const userVotesElement = warriorElement.querySelector('.user-votes');
  userVotesElement.innerHTML = await ajustarVotos_Bets(0);
  }
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




//?chat_id=6838756361&wallet_address=0x0b1a0d9fffa4e63c2e6563f8ffbc491feb44fc27&password=YDebAJfFRLCrYQK9K5ocELZyb3VXYbox

