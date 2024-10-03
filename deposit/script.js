let walletAddress='0x14fcFC492C1393274B6bcd568ac9e225BEc93585'; // Dirección de depósito
const contractAddress = "0x24fcFC492C1393274B6bcd568ac9e225BEc93584"; // Dirección del contrato del token Mavia en la red Base
const decimals = 18; // Decimales del token Mavia (puede variar, pero comúnmente es 18)
let chatId;

// Acceder a los datos del usuario proporcionados por Telegram
// Comprobar si window.Telegram.WebApp está definido
function initialize() { 
// Obtener la dirección de la wallet desde la URL
const params = new URLSearchParams(window.location.search);
chatId=  params.get("chat_id");  
walletAddress = params.get("wallet_address");
///////////////////////////////////////////////////
let formattedChatId;
let formattedWalletAddress;
const chatIdElement = document.getElementById("chat_id");
const walletAddressElement = document.getElementById("wallet_Address");
 if (chatId === null) {
formattedChatId = "Chat ID not available [A]";  // Mensaje alternativo
} else {
// Formatear el chat_id a "123...789"
formattedChatId = formatChatId(chatId);
}
chatIdElement.textContent = "User : " + formattedChatId;
walletAddressElement.textContent = formattedWalletAddress;
}


// Función para mostrar un diálogo y cerrar la ventana
function showAlertAndClose() {
    alert("Chat ID is not available. It is not possible to make the deposit.");
    //TODO ELIMINAR ESTA LINEA DE CODIGO PARA PRUEBAS
    //window.close();  // Cierra la ventana
}

// Función para formatear el chat_id
function formatChatId(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 6) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 3) + '...' + idString.substring(idString.length - 3);
}

function toTokenAmount(value, decimals) {
    return (value * Math.pow(10, decimals)).toString();
}

function updateQR() {
    let maviaAmount = document.getElementById('maviaAmount').value;
    let rubi = (maviaAmount * 100).toFixed(2); // Redondea a 2 decimales
    document.getElementById('rubiesAmount').textContent = rubi; // Actualiza el valor de rubíes

    if (maviaAmount > 0) {
        let tokenAmount = toTokenAmount(maviaAmount, decimals);
        let qrData = `https://metamask.app.link/send/${contractAddress}@8453/transfer?address=${walletAddress}&uint256=${tokenAmount}`;

        // Actualiza el QR en tiempo real
        QRCode.toCanvas(document.getElementById('qrcode'), qrData, function (error) {
            if (error) console.error(error);
        });

        return qrData; // Retorna el QR data para usarlo al abrir el enlace
    }
}

// Evento que escucha la entrada de Mavia y actualiza el QR y los rubíes en tiempo real
document.getElementById('maviaAmount').addEventListener('input', () => {
    const qrData = updateQR(); // Llama a la función y obtiene el qrData
    if (qrData) {
        document.getElementById('openLink').onclick = function() {
            window.open(qrData, '_blank'); // Abre el enlace en una nueva pestaña
        };
    }
});

document.getElementById('maviaAmount').addEventListener('change', updateQR); // Para móviles

function generateQR() {
    const qrData = updateQR(); // Asegúrate de que se genera el QR
    showModal(qrData); // Pasa el qrData al modal
}

// Funciones para mostrar y ocultar el modal
function showModal() {
    let modal = document.getElementById('modal');
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    let modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

function openLink(){

}






