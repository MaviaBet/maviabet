const walletAddress = "0xC6755Bf72Eb0F376B990327ab8b94fE2730f4de7"; // Dirección de depósito
const contractAddress = "0x24fcFC492C1393274B6bcd568ac9e225BEc93584"; // Dirección del contrato del token Mavia en la red Base
const decimals = 18; // Decimales del token Mavia (puede variar, pero comúnmente es 18)

function toTokenAmount(value, decimals) {
    return (value * Math.pow(10, decimals)).toString();
}

function updateQR() {
    let maviaAmount = document.getElementById('maviaAmount').value;
    let rubies = (maviaAmount * 100).toFixed(2); // Redondea a 2 decimales
    document.getElementById('rubiesAmount').textContent = rubies; // Actualiza el valor de rubíes

    if (maviaAmount > 0) {
        let tokenAmount = toTokenAmount(maviaAmount, decimals);
        let qrData = `https://metamask.app.link/send/${contractAddress}@8453/transfer?address=${walletAddress}&uint256=${tokenAmount}`;

        // Actualiza el QR en tiempo real
        QRCode.toCanvas(document.getElementById('qrcode'), qrData, function (error) {
            if (error) console.error(error);
        });
    }
}

// Evento que escucha la entrada de Mavia y actualiza el QR y los rubíes en tiempo real
document.getElementById('maviaAmount').addEventListener('input', updateQR); // Para escritorio
document.getElementById('maviaAmount').addEventListener('change', updateQR); // Para móviles

function generateQR() {
    updateQR();
    showModal();
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
