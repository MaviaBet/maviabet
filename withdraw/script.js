const getRubiByCharId="https://script.google.com/macros/s/AKfycbwaaZlwSWjhhlq5J_HdqiWE5e9tJoujjGQNYfRjDf66CiyNQeKPdwEY4lpApMbMqfcs/exec";

// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const chatId = params.get("chat_id") || "null";
const walletAddress = params.get("wallet_address") || "null";
const password=params.get("password");
// Cantidad total de rubíes disponible (esto debería provenir del servidor o base de datos)
let totalRubi = await getRubi(chatId,password); // Valor inicial de ejemplo

// Elementos del DOM
const chatIdElement = document.getElementById('chat_id');
const walletAddressElement = document.getElementById('wallet_Address');
const rubiInput = document.getElementById('rubiInput');
const maviaOutput = document.getElementById('maviaOutput');
const totalRubiDisplay = document.getElementById('totalRubi');
const recipientAddressInput = document.getElementById('recipientAddress');
const transferButton = document.getElementById('transferButton');

const modal = document.getElementById('modal');
const confirmChatId = document.getElementById('confirmChatId');
const confirmWalletAddress = document.getElementById('confirmWalletAddress');
const confirmRubi = document.getElementById('confirmRubi');
const confirmMavia = document.getElementById('confirmMavia');
const confirmRecipientAddress = document.getElementById('confirmRecipientAddress');
const confirmWithdrawButton = document.getElementById('confirmWithdraw');

// Función para convertir rubíes a Mavia
function convertirRubiAMavia(rubi) {
    return rubi / 100;
}

// Inicializar los datos del usuario en el DOM
async function initialize() {
    chatIdElement.textContent = `User: ${chatId}`;
    walletAddressElement.textContent = `Wallet: ${await format(walletAddress)}`;
    totalRubiDisplay.textContent = totalRubi.toFixed(2);
}

// Función para formatear el chat_id
async function format(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 12) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 6) + '...' + idString.substring(idString.length - 6);
}

// Actualizar los valores en tiempo real
rubiInput.addEventListener('input', function () {
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const maviaConvertido = convertirRubiAMavia(rubiIngresado);

    // Actualizar el valor de Mavia en la salida
    maviaOutput.textContent = maviaConvertido.toFixed(2);

    // Actualizar el total de rubíes disponibles en tiempo real
    const rubiRestantes = totalRubi - rubiIngresado;
    totalRubiDisplay.textContent = rubiRestantes >= 0 ? rubiRestantes.toFixed(2) : "0";
});

// Acción al hacer clic en el botón de transferencia
transferButton.addEventListener('click', async function () {
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const recipientAddress = recipientAddressInput.value.trim();

    if (rubiIngresado <= 0) {
        showModalAlert('Please enter a valid amount of rubies.');
        return;
    }

    if (rubiIngresado > totalRubi) {
        showModalAlert('You do not have enough rubies for this transfer.');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        showModalAlert('Please enter a valid Mavia address.');
        return;
    }

    const maviaTransferir = convertirRubiAMavia(rubiIngresado);

    // Llenar los datos en el modal
    confirmChatId.textContent = chatId;
    confirmWalletAddress.textContent = await format(walletAddress);
    confirmRubi.textContent = rubiIngresado.toFixed(2);
    confirmMavia.textContent = maviaTransferir.toFixed(2);
    confirmRecipientAddress.textContent = recipientAddress;

    // Mostrar el modal
    modal.style.display = "block";
});

// Funciones para mostrar y ocultar el modal
function closeModal() {
    modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Confirmar el retiro
confirmWithdrawButton.addEventListener('click', function () {
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const recipientAddress = recipientAddressInput.value.trim();
    const maviaTransferir = convertirRubiAMavia(rubiIngresado);

    // Aquí iría la lógica para realizar la transferencia de Mavia
    // Por ejemplo, interactuar con un contrato inteligente o una API backend

    // Simulación de la transferencia
    showModalAlert(`You have transferred ${maviaTransferir.toFixed(2)} Mavia to the address ${recipientAddress}.`);

    // Actualizar el total de rubíes disponibles
    totalRubi -= rubiIngresado;
    totalRubiDisplay.textContent = totalRubi.toFixed(2);

    // Limpiar los campos de entrada
    rubiInput.value = '';
    maviaOutput.textContent = '0';
    recipientAddressInput.value = '';

    // Cerrar el modal
    closeModal();
});

// Inicializar al cargar la página
window.onload = initialize;





function showModalAlert(message) {
    const modal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message; // Cambia el texto del mensaje
    modal.style.display = "block"; // Mostrar el modal
}

function closeModalAlert() {
    const modal = document.getElementById("errorModal");
    modal.style.display = "none"; // Ocultar el modal
}


// Asegúrate de cerrar el modal si el usuario hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById("errorModal");
    if (event.target === modal) {
        closeModalAlert();
    }
};

async function getRubi(charId,password) {
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

//0x467dF40a94fF60e14055d2aDf1991E5CE8e59999