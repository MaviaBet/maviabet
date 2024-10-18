const getRubiByCharId="https://script.google.com/macros/s/AKfycbwaaZlwSWjhhlq5J_HdqiWE5e9tJoujjGQNYfRjDf66CiyNQeKPdwEY4lpApMbMqfcs/exec";
let chatId;
let rubi;
let rubiIngresado;
let rubiRestantes;
let password;

// Elementos del DOM
let chatIdElement ;
let walletAddressElement ;
let rubiInput;
let maviaOutput ;
let totalRubiDisplay ;
let recipientAddressInput;
let transferButton ;
let modal;
let confirmChatId ;
let confirmWalletAddress ;
let confirmRubi;
let confirmMavia ;
let confirmRecipientAddress ;
let confirmWithdrawButton ;

const updateWithdrawAlerta='https://script.google.com/macros/s/AKfycbzwEO6xCQD3isToSqKOeI5CT0u2U1StC1N3oeECQ1v_Vix5nAXlRJMkzOsCfwnHu_7Z/exec';
const updateWithdrawMavia='https://script.google.com/macros/s/AKfycbwrNGrorYXQG1sw3dzqp6BYssesUNwAI9RAAMkM4mnXsUr6IHRG3P4HKPbt2XTb1CGZ5g/exec';
const updateWithdrawAddress='https://script.google.com/macros/s/AKfycbxhnX-7UPMrH7sOEoLK7eI0m4XBQotOLi8wX97fqp8ULqcI1bI4RKFpRtvtKllHcUUmcw/exec';
let recipientAddress;

let alertDialog ;
let closeBtn;
let progressBarInner ;
let progressText ;
let overlay;

let percentage = 0;

const getMaviaAlerta="https://script.google.com/macros/s/AKfycbzE8pu8S0CZEW8vG-drlUNZ-K2g_DR4hTfAqmOpl6JHFwvz74O6RhSrRvDb6LB_56uJ7Q/exec";


document.addEventListener('DOMContentLoaded', function() {
   // Elementos del DOM
       chatIdElement = document.getElementById('chat_id');
       walletAddressElement = document.getElementById('wallet_Address');
       rubiInput = document.getElementById('rubiInput');
       maviaOutput = document.getElementById('maviaOutput');
       totalRubiDisplay = document.getElementById('totalRubi');
       recipientAddressInput = document.getElementById('recipientAddress');
       transferButton = document.getElementById('transferButton');

       modal = document.getElementById('modal');
       confirmChatId = document.getElementById('confirmChatId');
       confirmWalletAddress = document.getElementById('confirmWalletAddress');
       confirmRubi = document.getElementById('confirmRubi');
       confirmMavia = document.getElementById('confirmMavia');
       confirmRecipientAddress = document.getElementById('confirmRecipientAddress');
       confirmWithdrawButton = document.getElementById('confirmWithdraw');

alertDialog = document.getElementById('alert-dialog');
closeBtn = document.getElementById('close-btn');
progressBarInner = document.querySelector('.progress-bar-inner');
progressText = document.getElementById('progress-text');
overlay = document.getElementById('overlay');
percentage = 0;


// Función para cargar los datos en la página
async function loadPage_withdraw() {


        const params = new URLSearchParams(window.location.search);
        chatId=params.get("chat_id");
       password=params.get("password");
       walletAddress=params.get("wallet_address")
        rubi=await getRubi_withdraw(chatId,password);
       if (typeof rubi === 'number') {
       rubi=rubi.toFixed(2);
       }

       totalRubiDisplay.textContent = rubi;
       chatIdElement.textContent = `User: ${chatId}`;
       walletAddressElement.textContent = `Wallet: ${await format_withdraw(walletAddress)}`;

   }

// Actualizar los valores en tiempo real
rubiInput.addEventListener('input', async function () {
        rubiIngresado = parseFloat(rubiInput.value) || 0;
        if (typeof rubiIngresado === 'number') {
        rubiIngresado=rubiIngresado.toFixed(2);
        }
        // Actualizar el valor de Mavia en la salida
        maviaOutput.textContent = await convertirRubiAMavia_withdraw(rubiIngresado);
        // Actualizar el total de rubíes disponibles en tiempo real
        rubiRestantes = rubi - rubiIngresado;
        if (typeof rubiRestantes === 'number') {
        rubiRestantes=rubiRestantes.toFixed(2);
        }
        totalRubiDisplay.textContent = rubiRestantes >= 0 ? rubiRestantes : "0";
    });


async function getMaviaAlerta_Withdraw(charId,password) {
        const url = `${getMaviaAlerta}?action=getMaviaAlerta&char_id=${charId}&password=${password}`;
       return await load_url_Withdraw(url);
    }

async function load_url_Withdraw(url){
 try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain', // O 'application/json' si es JSON
                },
            });
            if (!response.ok) {
                console.error(`HTTP error! Status : ${response.status}`);
                return `HTTP error! Status : ${response.status}`;
            }
            // O .json() si es JSON
            return await response.text();
        } catch (error) {
            console.error('Error fetching :', error);
            return 'Error fetching :'+error;
        }
    }





async function updateWithdrawAlertaM_Withdraw(charId, withdraw_alerta) {
    // URL del Web App con parámetros char_id y new_mavia_alerta
const url=`${updateWithdrawAlerta}?action=updateWithdrawAlerta&char_id=${charId}&withdraw_alerta=${withdraw_alerta}&password=${password}`;
    try {
        // Realizar la solicitud GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain' // O 'application/json' si el servidor devuelve JSON
            }
        });

        // Comprobar si la solicitud fue exitosa (código 200)
        if (response.ok) {
            // Leer y devolver el contenido de la respuesta
             // O .json() si es JSON
            return await response.text();
        } else {
            // Manejar el error de la solicitud
            console.error(`Error updateWithdrawAlerta en la solicitud GET. Código de estado: ${response.status}`);
            return `Error updateWithdrawAlerta en la solicitud GET. Código de estado: ${response.status}`;
        }
    } catch (error) {
        // Manejar errores de red o de conexión
        console.error('Error updateWithdrawAlerta:', error);
        return `Error updateWithdrawAlerta: ${error}`;
    }
}
async function updateWithdrawMaviaM_Withdraw(charId, withdraw_mavia) {
    // URL del Web App con parámetros char_id y new_mavia_alerta
const url=`${updateWithdrawMavia}?action=updateWithdrawMavia&char_id=${charId}&withdraw_mavia=${withdraw_mavia}&password=${password}`;

    try {
        // Realizar la solicitud GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain' // O 'application/json' si el servidor devuelve JSON
            }
        });

        // Comprobar si la solicitud fue exitosa (código 200)
        if (response.ok) {
            // Leer y devolver el contenido de la respuesta
             // O .json() si es JSON
            return await response.text();
        } else {
            // Manejar el error de la solicitud
            console.error(`Error updateWithdrawMaviaM en la solicitud GET. Código de estado: ${response.status}`);
            return `Error updateWithdrawMaviaM en la solicitud GET. Código de estado: ${response.status}`;
        }
    } catch (error) {
        // Manejar errores de red o de conexión
        console.error('Error updateWithdrawMaviaM:', error);
        return `Error updateWithdrawMaviaM: ${error}`;
    }
}
async function updateWithdrawAddressM_Withdraw(charId, withdraw_address) {
    // URL del Web App con parámetros char_id y new_mavia_alerta
const url=`${updateWithdrawAddress}?action=updateWithdrawAddress&char_id=${charId}&withdraw_address=${withdraw_address}&password=${password}`;
    try {
        // Realizar la solicitud GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain' // O 'application/json' si el servidor devuelve JSON
            }
        });

        // Comprobar si la solicitud fue exitosa (código 200)
        if (response.ok) {
            // Leer y devolver el contenido de la respuesta
             // O .json() si es JSON
            return await response.text();
        } else {
            // Manejar el error de la solicitud
            console.error(`Error updateWithdrawAddressM en la solicitud GET. Código de estado: ${response.status}`);
            return `Error updateWithdrawAddressM en la solicitud GET. Código de estado: ${response.status}`;
        }
    } catch (error) {
        // Manejar errores de red o de conexión
        console.error('Error updateWithdrawAddressM :', error);
        return `Error updateWithdrawAddressM : ${error}`;
    }
}






async function getRubi_withdraw(charId,password) {
        const url = `${getRubiByCharId}?action=getRubi&char_id=${charId}&password=${password}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain', // O 'application/json' si es JSON
                },
            });
            if (!response.ok) {
                //console.error(`HTTP error! Status: ${response.status}`);
                return '888';
                //return `HTTP error! Status: ${response.status}`;
            }
            // O .json() si es JSON
            return await response.text();
        } catch (error) {
            //console.error('Error fetching rubi:', error);
            return '999';
            //return 'Error fetching rubi:'+error;
        }
    }

//async function sleep_withdraw(ms) {
//return new Promise(resolve => setTimeout(resolve, ms));
//}

// Función para convertir rubíes a Mavia
async function convertirRubiAMavia_withdraw(rubi) {
return rubi / 100;
}

// Función para formatear el chat_id
async function format_withdraw(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 12) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 6) + '...' + idString.substring(idString.length - 6);
}

// Acción al hacer clic en el botón de transferencia
transferButton.addEventListener('click', async function () {

    showDialog();
    updateProgressBar_deposit(50); // Update the progress bar to 50%
    //Comprobar si hay un deposito en proceso
    const depositoPendiente=await getMaviaAlerta_Withdraw(chatId,password);
    updateProgressBar_deposit(100); // Update the progress bar to 100%
    closeDialog();
    if(depositoPendiente==='0'){
        showModalAlert_withdraw('Your withdraw cannot be processed at this time, please try again in a few minutes');
       return;
    }


    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    recipientAddress = recipientAddressInput.value.trim();

    if (rubiIngresado <= 0) {
        showModalAlert_withdraw('Please enter a valid amount of rubies.');
        return;
    }

    if (rubiIngresado > rubi) {
        showModalAlert_withdraw('You do not have enough rubies for this transfer.');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        if(recipientAddress==='test'){
            recipientAddress='0xBEa7e4697823c02719850D9C2450432a0D631084';
        }else{
        showModalAlert_withdraw('Please enter a valid Mavia address.');
        return;
        }
    }

    const maviaTransferir = await convertirRubiAMavia_withdraw(rubiIngresado);

    // Llenar los datos en el modal
    confirmChatId.textContent = chatId;
    confirmWalletAddress.textContent = await format_withdraw(walletAddress);
    confirmRubi.textContent = rubiIngresado;
    confirmMavia.textContent = maviaTransferir;
    confirmRecipientAddress.textContent = recipientAddress;

    // Mostrar el modal
    modal.style.display = "block";
});



// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal_withdraw();
    }
}

// Confirmar el retiro
confirmWithdrawButton.addEventListener('click', async function () {
    
    showDialog();
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    updateProgressBar(20); // Update the progress bar to 20%
    //const recipientAddress = recipientAddressInput.value.trim();
    const maviaTransferir = await convertirRubiAMavia_withdraw(rubiIngresado);
    updateProgressBar(40); // Update the progress bar to 40%
    await updateWithdrawAddressM_Withdraw(chatId,recipientAddress);
    updateProgressBar(60); // Update the progress bar to 60%
    await updateWithdrawMaviaM_Withdraw(chatId,maviaTransferir);
    updateProgressBar(80); // Update the progress bar to 80%
    await updateWithdrawAlertaM_Withdraw(chatId,'1');
    updateProgressBar(100); // Update the progress bar to 100%
    closeDialog();
    // Aquí iría la lógica para realizar la transferencia de Mavia
    // Por ejemplo, interactuar con un contrato inteligente o una API backend

    // Simulación de la transferencia
    showModalAlert_withdraw(`You have transferred ${maviaTransferir} Mavia to the address ${recipientAddress}.`);

    // Actualizar el total de rubíes disponibles
    rubi -= rubiIngresado;
    if (typeof rubi === 'number') {
    rubi=rubi.toFixed(2);
    }
    totalRubiDisplay.textContent = rubi;

    // Limpiar los campos de entrada
    rubiInput.value = '';
    maviaOutput.textContent = '0';
    recipientAddressInput.value = '';

    // Cerrar el modal
    closeModal_withdraw();
});

// Iniciar la página la primera vez
// noinspection JSIgnoredPromiseFromCall
loadPage_withdraw();

});




// Function to show the dialog
function showDialog(){
    overlay.style.display = 'block'; /* Muestra el overlay */
    alertDialog.style.display = 'block'; /* Muestra la barra de progreso */
}

// Function to close the dialog
function closeDialog() {
    overlay.style.display = 'none'; /* Oculta el overlay */
    alertDialog.style.display = 'none'; /* Oculta la barra de progreso */
}

// Function to update the progress bar
function updateProgressBar(percentage) {
progressBarInner.style.width = `${percentage}%`;
progressText.textContent = `${percentage}% Complete`;
}




// Funciones para mostrar y ocultar el modal
function closeModal_withdraw() {
    modal.style.display = "none";
}

function showModalAlert_withdraw(message) {
    const modal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message; // Cambia el texto del mensaje
    modal.style.display = "block"; // Mostrar el modal
}


function closeModalAlert_withdraw() {
    const modal = document.getElementById("errorModal");
    modal.style.display = "none"; // Ocultar el modal
}


// Asegúrate de cerrar el modal si el usuario hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById("errorModal");
    if (event.target === modal) {
        closeModalAlert_withdraw();
    }
};




//0xBEa7e4697823c02719850D9C2450432a0D631084

//?chat_id=6838756361&wallet_address=0x1f170b707cc37c9db885c38f32b3777db07629e9&password=947Wji3Rzo6n2CmrbYMv42Cyp0rWZhz3

