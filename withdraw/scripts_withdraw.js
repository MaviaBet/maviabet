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

async function sleep_withdraw(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

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
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const recipientAddress = recipientAddressInput.value.trim();

    if (rubiIngresado <= 0) {
        showModalAlert_withdraw('Please enter a valid amount of rubies.');
        return;
    }

    if (rubiIngresado > rubi) {
        showModalAlert_withdraw('You do not have enough rubies for this transfer.');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        showModalAlert_withdraw('Please enter a valid Mavia address.');
        return;
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

// Funciones para mostrar y ocultar el modal
function closeModal_withdraw() {
modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal_withdraw();
    }
}

// Confirmar el retiro
confirmWithdrawButton.addEventListener('click', async function () {
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const recipientAddress = recipientAddressInput.value.trim();
    const maviaTransferir = await convertirRubiAMavia_withdraw(rubiIngresado);

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





//?chat_id=6838756361&wallet_address=0x8281a31a2da91539d79146b0d7595c2f520796dd&password=RGjGj6tXPenAsBGc4L7uYFi0pvlOTnGO
//0x1234567890123456789012345678901234567890