let walletAddress; // Dirección de depósito
const contractAddress = "0x24fcFC492C1393274B6bcd568ac9e225BEc93584"; // Dirección del contrato del token Mavia en la red Base
const decimals = 18; // Decimales del token Mavia (puede variar, pero comúnmente es 18)
let chatId;
let password;
const updateMaviaAlerta="https://script.google.com/macros/s/AKfycbwK5ShC90SpgxHmLVDpNpuEjlHPCnU8WWFrM6yTiQHhbm-znekISUE-IsUQ7f4dt6f_dg/exec";
const getMaviaAlerta="https://script.google.com/macros/s/AKfycbzE8pu8S0CZEW8vG-drlUNZ-K2g_DR4hTfAqmOpl6JHFwvz74O6RhSrRvDb6LB_56uJ7Q/exec";
// Define la versión
const version = "v1.0.0"; // Cambia este valor cuando necesites actualizar la versión

let alertDialog ;
let progressBarInner ;
let progressText ;
let overlay;
let percentage = 0;


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
    alertDialog = document.getElementById('alert-dialog');
    progressBarInner = document.querySelector('.progress-bar-inner');
progressText = document.getElementById('progress-text');
overlay = document.getElementById('overlay');
percentage = 0;


    let formattedWalletAddress;
    const chatIdElement = document.getElementById("chat_id");
    const walletAddressElement = document.getElementById("wallet_Address");

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
     // Redondea a 2 decimales
    document.getElementById('rubiesAmount').textContent = (maviaAmount * 100).toFixed(2); // Actualiza el valor de rubíes

    if (maviaAmount > 0) {
        let tokenAmount = toTokenAmount_Deposit(maviaAmount, decimals);
        let qrData = `https://metamask.app.link/send/${contractAddress}@8453/transfer?address=${walletAddress}&uint256=${tokenAmount}`;

        // Actualiza el QR en tiempo real
        // noinspection JSUnresolvedReference
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


async function generateQR_Deposit() {
let maviaAmount = document.getElementById('maviaAmount').value;
if(maviaAmount===''){
    return;
}
let valorNumerico = parseFloat(maviaAmount);

if (!isNaN(valorNumerico) && valorNumerico === 0) {
  console.log("El valor es 0");
} else {
    const qrData = updateQR_Deposit(); // Asegúrate de que se genera el QR
    showDialog_deposit();
    updateProgressBar_deposit(50); // Update the progress bar to 50%
    //Comprobar si hay un deposito en proceso
    const depositoPendiente=await getMaviaAlerta_Deposit(chatId,password);
    updateProgressBar_deposit(100); // Update the progress bar to 100%
    closeDialog_deposit();

        if(depositoPendiente==='0'){
            showModal_Deposit(qrData); // Pasa el qrData al modal
        }else{
            showModalAlert_deposit('Your deposit cannot be processed at this time, please try again in a few minutes');
        }
}
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
    if (event.target === modal) {
        // noinspection JSIgnoredPromiseFromCall
        closeModal_Deposit();
    }
}


async function updateMaviaAlerta_Deposit(charId, newMavia) {
    // URL del Web App con parámetros char_id y new_mavia_alerta
    const url = `${updateMaviaAlerta}?action=updateMaviaAlerta&char_id=${charId}&new_mavia_alerta=${newMavia}&password=${password}`;
    return await load_url_Deposit(url);
}



async function getMaviaAlerta_Deposit(charId,password) {
        const url = `${getMaviaAlerta}?action=getMaviaAlerta&char_id=${charId}&password=${password}`;
       return await load_url_Deposit(url);
    }


    async function load_url_Deposit(url){
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




 function showModalAlert_deposit(message) {
    const modal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message; // Cambia el texto del mensaje
    modal.style.display = "block"; // Mostrar el modal
}


function closeModalAlert_deposit() {
    const modal = document.getElementById("errorModal");
    modal.style.display = "none"; // Ocultar el modal
}





// Function to show the dialog
function showDialog_deposit(){
    overlay.style.display = 'block'; /* Muestra el overlay */
    alertDialog.style.display = 'block'; /* Muestra la barra de progreso */
}

// Function to close the dialog
function closeDialog_deposit() {
    overlay.style.display = 'none'; /* Oculta el overlay */
    alertDialog.style.display = 'none'; /* Oculta la barra de progreso */
}

// Function to update the progress bar
function updateProgressBar_deposit(percentage) {
progressBarInner.style.width = `${percentage}%`;
progressText.textContent = `${percentage}% Complete`;
}
