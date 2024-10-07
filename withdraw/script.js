// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const chatId = params.get("chat_id") || "null";
const walletAddress = params.get("wallet_address") || "null";

// Cantidad total de rubíes disponible (esto debería provenir del servidor o base de datos)
let totalRubi = 1000; // Valor inicial de ejemplo

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
function initialize() {
    chatIdElement.textContent = `User: ${chatId}`;
    walletAddressElement.textContent = `Wallet: ${walletAddress}`;
    totalRubiDisplay.textContent = totalRubi.toFixed(2);
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
transferButton.addEventListener('click', function () {
    const rubiIngresado = parseFloat(rubiInput.value) || 0;
    const recipientAddress = recipientAddressInput.value.trim();

    if (rubiIngresado <= 0) {
        alert('Please enter a valid amount of rubies.');
        return;
    }

    if (rubiIngresado > totalRubi) {
        alert('You do not have enough rubies for this transfer.');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        alert('Please enter a valid Mavia address.');
        return;
    }

    const maviaTransferir = convertirRubiAMavia(rubiIngresado);

    // Llenar los datos en el modal
    confirmChatId.textContent = chatId;
    confirmWalletAddress.textContent = walletAddress;
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
    alert(`You have transferred ${maviaTransferir.toFixed(2)} Mavia to the address ${recipientAddress}.`);

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

//0x467dF40a94fF60e14055d2aDf1991E5CE8e59999