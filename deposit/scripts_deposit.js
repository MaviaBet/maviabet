let walletAddress; // Dirección de depósito
const contractAddress = "0x24fcFC492C1393274B6bcd568ac9e225BEc93584"; // Dirección del contrato del token Mavia en la red Base
const decimals = 18; // Decimales del token Mavia (puede variar, pero comúnmente es 18)
let chatId;
let password;
const updateMaviaAlerta="https://script.google.com/macros/s/AKfycbwK5ShC90SpgxHmLVDpNpuEjlHPCnU8WWFrM6yTiQHhbm-znekISUE-IsUQ7f4dt6f_dg/exec";
// Define la versión
const version = "v1.0.0"; // Cambia este valor cuando necesites actualizar la versión

//chat_id=1234567&wallet_address=0x123456789012345678
// Llamar a la función initialize_Deposit al cargar la página
window.onload = initialize_Deposit;

// Función para cargar la versión en el DOM
function loadVersion_Deposit() {
    const versionElement = document.getElementById("version");
    versionElement.textContent = version; // Asigna la versión al elemento
}


// Acceder a los datos del usuario proporcionados por Telegram
// Comprobar si window.Telegram.WebApp está definido
async function initialize_Deposit() {
// Obtener la dirección de la wallet desde la URL
    const params = new URLSearchParams(window.location.search);
    chatId=  params.get("chat_id");
    walletAddress = params.get("wallet_address");
    password=params.get("password");
///////////////////////////////////////////////////
    let formattedChatId;
    let formattedWalletAddress;
    const chatIdElement = document.getElementById("chat_id");
    const walletAddressElement = document.getElementById("wallet_Address");
    if (chatId === null) {
        formattedChatId = "Chat ID not available [A]";  // Mensaje alternativo
    } else {
// Formatear el chat_id a "123...789"
       //formattedChatId = await format(chatId);
    }
    if (walletAddress === null) {
        formattedWalletAddress = "WalletAddress not available [A]";  // Mensaje alternativo
    } else {
// Formatear el chat_id a "123...789"
        formattedWalletAddress = await format_Deposit(walletAddress);
    }
    chatIdElement.textContent = "User : " + chatId;
    walletAddressElement.textContent = formattedWalletAddress;
    loadVersion_Deposit();
}


// Función para mostrar un diálogo y cerrar la ventana
function showAlertAndClose_Deposit() {
    //alert("Chat ID is not available. It is not possible to make the deposit.");
    //TODO ELIMINAR ESTA LINEA DE CODIGO PARA PRUEBAS
    window.close();  // Cierra la ventana
}


// Función para formatear el chat_id
async function format_Deposit(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 12) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 6) + '...' + idString.substring(idString.length - 6);
}


function toTokenAmount_Deposit(value, decimals) {
    return (value * Math.pow(10, decimals)).toString();
}


function updateQR_Deposit() {
    let maviaAmount = document.getElementById('maviaAmount').value;
    let rubi = (maviaAmount * 100).toFixed(2); // Redondea a 2 decimales
    document.getElementById('rubiesAmount').textContent = rubi; // Actualiza el valor de rubíes

    if (maviaAmount > 0) {
        let tokenAmount = toTokenAmount_Deposit(maviaAmount, decimals);
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
    const qrData = updateQR_Deposit(); // Llama a la función y obtiene el qrData
    if (qrData) {
        document.getElementById('openLink').onclick = async function() {

            window.open(qrData, '_blank'); // Abre el enlace en una nueva pestaña
            await updateMaviaAlerta_Deposit(chatId,'1');
        };
        document.getElementById('scanQR').onclick = async function() {
            document.getElementById('modal').style.display = "none";
            await updateMaviaAlerta_Deposit(chatId,'1');
        };
    }
});


document.getElementById('maviaAmount').addEventListener('change', updateQR_Deposit); // Para móviles


function generateQR_Deposit() {
    const qrData = updateQR_Deposit(); // Asegúrate de que se genera el QR
    showModal_Deposit(qrData); // Pasa el qrData al modal
}


// Funciones para mostrar y ocultar el modal
function showModal_Deposit() {
    let modal = document.getElementById('modal');
    modal.style.display = "block";
}


async function closeModal_Deposit() {
document.getElementById('modal').style.display = "none";
}


// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    let modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal_Deposit();
    }
}


async function updateMaviaAlerta_Deposit(charId, newMavia) {
    // URL del Web App con parámetros char_id y new_mavia_alerta
    const url = `${updateMaviaAlerta}?action=updateMaviaAlerta&char_id=${charId}&new_mavia_alerta=${newMavia}&password=${password}`;

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
            const responseData = await response.text(); // O .json() si es JSON
            return responseData;
        } else {
            // Manejar el error de la solicitud
            console.error(`Error en la solicitud GET. Código de estado: ${response.status}`);
            return `Error en la solicitud GET. Código de estado: ${response.status}`;
        }
    } catch (error) {
        // Manejar errores de red o de conexión
        console.error('Error al actualizar Mavia:', error);
        return `Error al actualizar Mavia: ${error}`;
    }
}


