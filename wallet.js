// Abrir y cerrar la modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Conectar WalletConnect
document.getElementById('connectButton').addEventListener('click', async () => {
    const status = document.getElementById('status');

    try {
        // Crear una nueva instancia del proveedor WalletConnect
        const provider = new WalletConnectProvider.default({
            rpc: {
                8453: "https://mainnet.base.org", // Nodo público de Base
            },
            // No utilizar QR
            qrcode: false,
        });

        // Conectar al proveedor
        await provider.enable();

        // Usar Web3 con el proveedor WalletConnect
        const web3 = new Web3(provider);

        // Obtener las cuentas conectadas
        const accounts = await web3.eth.getAccounts();
        status.innerText = `Conectado: ${accounts[0]}`;

    } catch (error) {
        status.innerText = 'Error al conectar WalletConnect';
        console.error(error);
    }
});
