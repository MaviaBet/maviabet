let wallet_balance;
let wallet_bet;
let web3;
let abi=[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_layerZeroEndpoint","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidDelegate","type":"error"},{"inputs":[],"name":"InvalidEndpointCall","type":"error"},{"inputs":[],"name":"InvalidLocalDecimals","type":"error"},{"inputs":[{"internalType":"bytes","name":"options","type":"bytes"}],"name":"InvalidOptions","type":"error"},{"inputs":[],"name":"LzTokenUnavailable","type":"error"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"}],"name":"NoPeer","type":"error"},{"inputs":[{"internalType":"uint256","name":"msgValue","type":"uint256"}],"name":"NotEnoughNative","type":"error"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"OnlyEndpoint","type":"error"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"}],"name":"OnlyPeer","type":"error"},{"inputs":[],"name":"OnlySelf","type":"error"},{"inputs":[{"internalType":"bytes","name":"result","type":"bytes"}],"name":"SimulationResult","type":"error"},{"inputs":[{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"}],"name":"SlippageExceeded","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"},{"internalType":"bytes","name":"options","type":"bytes"}],"indexed":false,"internalType":"struct EnforcedOptionParam[]","name":"_enforcedOptions","type":"tuple[]"}],"name":"EnforcedOptionSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"inspector","type":"address"}],"name":"MsgInspectorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"guid","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"srcEid","type":"uint32"},{"indexed":true,"internalType":"address","name":"toAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLD","type":"uint256"}],"name":"OFTReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"guid","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"dstEid","type":"uint32"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountLD","type":"uint256"}],"name":"OFTSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"eid","type":"uint32"},{"indexed":false,"internalType":"bytes32","name":"peer","type":"bytes32"}],"name":"PeerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"preCrimeAddress","type":"address"}],"name":"PreCrimeSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"SEND","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SEND_AND_CALL","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"origin","type":"tuple"}],"name":"allowInitializePath","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"approvalRequired","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"uint16","name":"_msgType","type":"uint16"},{"internalType":"bytes","name":"_extraOptions","type":"bytes"}],"name":"combineOptions","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"composeMsgSender","outputs":[{"internalType":"address","name":"sender","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimalConversionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endpoint","outputs":[{"internalType":"contract ILayerZeroEndpointV2","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"}],"name":"enforcedOptions","outputs":[{"internalType":"bytes","name":"enforcedOption","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"bytes32","name":"_peer","type":"bytes32"}],"name":"isPeer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"_origin","type":"tuple"},{"internalType":"bytes32","name":"_guid","type":"bytes32"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"lzReceive","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"origin","type":"tuple"},{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes32","name":"guid","type":"bytes32"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"address","name":"executor","type":"address"},{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct InboundPacket[]","name":"_packets","type":"tuple[]"}],"name":"lzReceiveAndRevert","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"_origin","type":"tuple"},{"internalType":"bytes32","name":"_guid","type":"bytes32"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"lzReceiveSimulate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"msgInspector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"nextNonce","outputs":[{"internalType":"uint64","name":"nonce","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oApp","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oAppVersion","outputs":[{"internalType":"uint64","name":"senderVersion","type":"uint64"},{"internalType":"uint64","name":"receiverVersion","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"oftVersion","outputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"},{"internalType":"uint64","name":"version","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"}],"name":"peers","outputs":[{"internalType":"bytes32","name":"peer","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"preCrime","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"}],"name":"quoteOFT","outputs":[{"components":[{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"uint256","name":"maxAmountLD","type":"uint256"}],"internalType":"struct OFTLimit","name":"oftLimit","type":"tuple"},{"components":[{"internalType":"int256","name":"feeAmountLD","type":"int256"},{"internalType":"string","name":"description","type":"string"}],"internalType":"struct OFTFeeDetail[]","name":"oftFeeDetails","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"amountSentLD","type":"uint256"},{"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"internalType":"struct OFTReceipt","name":"oftReceipt","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"},{"internalType":"bool","name":"_payInLzToken","type":"bool"}],"name":"quoteSend","outputs":[{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"msgFee","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"},{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"_fee","type":"tuple"},{"internalType":"address","name":"_refundAddress","type":"address"}],"name":"send","outputs":[{"components":[{"internalType":"bytes32","name":"guid","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"},{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"fee","type":"tuple"}],"internalType":"struct MessagingReceipt","name":"msgReceipt","type":"tuple"},{"components":[{"internalType":"uint256","name":"amountSentLD","type":"uint256"},{"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"internalType":"struct OFTReceipt","name":"oftReceipt","type":"tuple"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_delegate","type":"address"}],"name":"setDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"},{"internalType":"bytes","name":"options","type":"bytes"}],"internalType":"struct EnforcedOptionParam[]","name":"_enforcedOptions","type":"tuple[]"}],"name":"setEnforcedOptions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_msgInspector","type":"address"}],"name":"setMsgInspector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"bytes32","name":"_peer","type":"bytes32"}],"name":"setPeer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_preCrime","type":"address"}],"name":"setPreCrime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sharedDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let maviaTokenAddress='0x24fcFC492C1393274B6bcd568ac9e225BEc93584';
let contract;
let fromAddress;
let recipientAddress='0xC6755Bf72Eb0F376B990327ab8b94fE2730f4de7';
let wallet_address_withdraw;
// noinspection JSUnresolvedReference
let window_ethereum=window.ethereum;
let user;
let my_transactionHash;
//////


//Al cargar la página por primera vez
window.onload=async function(){
//Ejecutar la función de restablecimiento.
await resetWebApp();
//Conectar Metamask.
await conectarMetamask();
//Cargar los datos del usuario.
await cargarDatosUsuario();
};



//Función para restablecer la página a su estado inicial
async function resetWebApp(){
// Limpiar almacenamiento local y de sesión
await localStorage.clear();
await sessionStorage.clear();
// Eliminar cualquier cache almacenada por service workers
if('serviceWorker' in navigator){
await navigator.serviceWorker.getRegistrations()
.then(async function(registrations){
for(let registration of registrations){
await registration.unregister().then();
}
});
}
// Reiniciar los elementos del DOM a su estado inicial
document.getElementById('wallet-user').innerText="N/A";
document.getElementById('wallet-bet').innerText="N/A";
document.getElementById('wallet-address').innerText="N/A";
document.getElementById('wallet-balance').innerText="N/A";
document.getElementById('transaction-hash').innerText="N/A";
document.getElementById('transaction-status').innerText="N/A";
// Limpiar los campos de entrada
document.getElementById('wallet-address-withdraw').value="";
document.getElementById('amount').value="";
await estilo_backup();
await restar_estilo();
}



async function conectarMetamask(){
//Asegurarse de estar en la red Base
await switchToBaseNetwork();
fromAddress=await initWeb3();
document.getElementById('wallet-address').innerText=reducirHash(fromAddress);
const input=document.getElementById('wallet-address');
// Cambia el color a verde oscuro para fondo y verde claro para borde
input.style.backgroundColor = '#0d1b2a'; // Fondo oscuro (similar a la imagen)
input.style.color = '#00ff85'; // Texto en verde brillante
input.style.border = '1px solid #00ff85'; // Borde verde claro
input.style.padding = '2px'; // Añadir relleno para dar espacio
input.style.borderRadius = '8px'; // Bordes redondeados
input.style.boxShadow = '0 0 5px #00ff85'; // Sombra verde claro para resaltar
input.style.fontSize = '16px'; // Ajustar el tamaño del texto
input.style.outline = 'none'; // Eliminar borde predeterminado al hacer foco
web3=await new Web3(window_ethereum);
contract=await new web3.eth.Contract(abi,maviaTokenAddress);
// Llama al contrato para consultar el balance
await getBalance();
document.getElementById('wallet-balance').innerText=`${wallet_balance} MAVIA`;
}



async function switchToBaseNetwork(){
try{
// Verifica si MetaMask está instalado
if(typeof window_ethereum !== 'undefined'){
const baseNetwork = {
chainId: '0x2105', // ID de la red Base en hexadecimal (8451 en decimal)
chainName: 'Base',
nativeCurrency: {
name: 'ETH',
symbol: 'ETH',
decimals: 18
},
rpcUrls: ['https://mainnet.base.org'], // URL RPC de Base
blockExplorerUrls: ['https://basescan.org/'] // Explorador de bloques de Base
};
// Solicita a MetaMask agregar la red Base
await window_ethereum.request({
method:'wallet_addEthereumChain',
params:[baseNetwork]
});
console.log('Base network added successfully!');
await alert('Base network added successfully!\'');
}else{
console.error('MetaMask is not installed.');
await alert('MetaMask is not installed.');
}
}catch(error){
console.error('Error adding Base network : ',error);
await alert('Error adding Base network : '+error);
}
}



async function initWeb3(){
if(typeof window_ethereum!=='undefined'){
try{
//Solicitar acceso a la cuenta del usuario
const accounts = await window_ethereum.request({method:'eth_requestAccounts'});
const userAddress = accounts[0];
console.log('Connected to the Base network : '+userAddress);
await alert('Connected to the Base network : '+userAddress);
return userAddress;
}catch(error){
console.error('Could not connect to MetaMask. Make sure you have it installed and enabled.',error);
await alert('Could not connect to MetaMask. Make sure you have it installed and enabled.');
}
}else{
console.error('Please install MetaMask to continue.');
await alert('Please install MetaMask to continue.');
}
}



async function getBalance(){
// noinspection JSUnresolvedReference
await contract.methods.balanceOf(fromAddress).call()
.then(async (balance)=>{
console.log("wallet_balance_wei : ", balance);
// El balance normalmente está en Wei, así que puedes convertirlo a su unidad usando Web3
wallet_balance=await web3.utils.fromWei(balance, 'ether');
console.log("wallet_balance : ",wallet_balance);
}).catch(async (err) => {
console.error("Error al consultar wallet_balance : ", err);
});
}



// Función para cargar los datos del usuario desde JS
async function cargarDatosUsuario(){
user='@666';
wallet_bet = 3;//Ejemplo de balance
document.getElementById('wallet-user').innerText=user;
document.getElementById('wallet-bet').innerText=`${wallet_bet} MAVIA`;
}



// Evento para manejar el botón de retirar
document.getElementById('withdraw-btn').addEventListener('click', async () => {
wallet_address_withdraw=document.getElementById('wallet-address-withdraw').value;
const amount=document.getElementById('amount').value;
if(address&&amount>0){
await alert(`Withdraw ${amount} MAVIA for the address : ${wallet_address_withdraw}`);
document.getElementById('last-transaction').innerText = `Retiro de ${amount} MAV`;
await limpiarCampos();
}else{
await alert("Please enter a valid address and quantity.");
}
});




// Limpiar los campos de texto después de una transacción
async function limpiarCampos() {
document.getElementById('wallet-address-withdraw').value = "";
document.getElementById('amount').value = "";
}
// Forzar siempre una nueva carga de la página sin caché
window.addEventListener("beforeunload", async function () {
//Limpiar almacenamiento local y sesión para evitar que se guarden datos
await localStorage.clear();
await sessionStorage.clear();
});



// Evento para manejar el botón de depositar
document.getElementById('deposit-btn').addEventListener('click', async () => {
document.getElementById('wallet-address-withdraw').innerText=recipientAddress;
const amount = document.getElementById('amount').value;
if (amount > 0) {
await alert(`You will deposit ${amount} MAVIA to the address : ${recipientAddress}`);
await restar_estilo();
await depositMaviaBase(amount); // La cantidad ya está en formato correcto
} else {
await alert("Please provide a valid amount.");
}
});



async function depositMaviaBase(amount){
try{
const amountInWei=await web3.utils.toWei(amount.toString(),'ether');
// Obtén el precio del gas directamente desde el mercado (red actual)
// noinspection JSUnresolvedReference
const gasPrice=await web3.eth.getGasPrice();
console.log('Gas price from market (in wei):',gasPrice);
// Opcional: Estimar el gas limit necesario para la transacción
const gasLimit=await contract.methods.transfer(recipientAddress, amountInWei)
.estimateGas({from: fromAddress});
// Enviar la transacción con el gasPrice del mercado y el gasLimit estimado
my_transactionHash=await contract.methods.transfer(recipientAddress,amountInWei).send({
from:fromAddress,
gasPrice:gasPrice, // Gas del mercado
gas:gasLimit// Límite de gas estimado
});
console.log('Transaction hash:',my_transactionHash.transactionHash);
await checkTransactionStatus();
}catch(error){
console.error('Error during deposit:', error);
}
}



// Función para verificar el estado de la transacción en la red Base
async function checkTransactionStatus() {
const transactionStatus = document.getElementById("transaction-status");
const transactionHashElement = document.getElementById("transaction-hash");
// Muestra el hash de la transacción
transactionHashElement.textContent = reducirHash(my_transactionHash.transactionHash);
// Cambia el color a verde oscuro para fondo y verde claro para borde
transactionHashElement.style.backgroundColor = '#0d1b2a'; // Fondo oscuro (similar a la imagen)
transactionHashElement.style.border = '1px solid #00ff85'; // Borde verde claro
transactionHashElement.style.padding = '2px'; // Añadir relleno para dar espacio
transactionHashElement.style.borderRadius = '8px'; // Bordes redondeados
transactionHashElement.style.boxShadow = '0 0 5px #00ff85'; // Sombra verde claro para resaltar
transactionHashElement.style.fontSize = '16px'; // Ajustar el tamaño del texto
transactionHashElement.style.outline = 'none'; // Eliminar borde predeterminado al hacer foco

    try {
        // Consulta el estado de la transacción periódicamente
        const interval = setInterval(async () => {
            // noinspection JSUnresolvedReference
            const receipt = await web3.eth.getTransactionReceipt(my_transactionHash.transactionHash);

            if (receipt) {
                if (receipt.status) {
                    // La transacción fue exitosa
                    transactionStatus.textContent = "Confirmed transaction";
                    transactionHashElement.style.color = "green";
                    transactionStatus.style.color = "green";
                } else {
                    // La transacción falló
                    transactionStatus.textContent = "Failed transaction";
                    transactionHashElement.style.color = "red";
                    transactionStatus.style.color = "red";
                }
                clearInterval(interval); // Detén la verificación cuando se obtiene un estado final
            } else {
                // Transacción pendiente
                transactionStatus.textContent = "Pending transaction...";
                transactionHashElement.style.color = "orange";
                transactionStatus.style.color = "orange";
            }
        }, 1000); // Revisa el estado cada 5 segundos
    } catch (error) {
        transactionStatus.textContent = "Error getting transaction status";
        transactionHashElement.style.color = "red";
        transactionStatus.style.color = "red";
        console.error(error);
    }
}



// Función para copiar el hash al portapapeles
document.getElementById('copy-hash-btn').addEventListener('click', function() {
    //const transactionHash = document.getElementById('transaction-hash').textContent;
    const copyStatus = document.getElementById('copy-status');
    const copyBtn = document.getElementById('copy-hash-btn');

    // Copiar al portapapeles
    navigator.clipboard.writeText(my_transactionHash.transactionHash).then(() => {
        // Muestra "Copied" temporalmente
        copyStatus.style.display = "inline";
        copyStatus.textContent = "Copied";

        // Cambia el icono al check
        copyBtn.innerHTML = '<img src="check-icon.png" alt="Copied" class="check-icon">';

        // Después de 2 segundos, oculta el mensaje y vuelve a mostrar el icono original
        setTimeout(() => {
            copyStatus.style.display = "none";
            copyBtn.innerHTML = '<img src="copy-icon.png" alt="Copy" class="copy-icon">';
        }, 2000);

    }).catch(err => {
        console.error('Error al copiar el hash: ', err);
    });
});



// Objeto para almacenar los estilos originales
let backupStyles = {};
let backupStyles2 = {};

// Función para hacer el backup del estilo actual usando getComputedStyle
async function estilo_backup() {
    const transactionHashElement = document.getElementById("transaction-hash");
    const computedStyles = getComputedStyle(transactionHashElement);

    // Almacenar estilos originales en el objeto backupStyles
    backupStyles.backgroundColor = computedStyles.backgroundColor;
    backupStyles.border = computedStyles.border;
    backupStyles.padding = computedStyles.padding;
    backupStyles.borderRadius = computedStyles.borderRadius;
    backupStyles.boxShadow = computedStyles.boxShadow;
    backupStyles.fontSize = computedStyles.fontSize;
    backupStyles.outline = computedStyles.outline;
    backupStyles.color = computedStyles.color;

    const transactionStatus = document.getElementById("transaction-status");
    const computedStyles2 = getComputedStyle(transactionStatus);

    // Almacenar estilos originales en el objeto backupStyles
    backupStyles2.backgroundColor = computedStyles2.backgroundColor;
    backupStyles2.border = computedStyles2.border;
    backupStyles2.padding = computedStyles2.padding;
    backupStyles2.borderRadius = computedStyles2.borderRadius;
    backupStyles2.boxShadow = computedStyles2.boxShadow;
    backupStyles2.fontSize = computedStyles2.fontSize;
    backupStyles2.outline = computedStyles2.outline;
    backupStyles2.color = computedStyles2.color;
}

// Función para restaurar el estilo original
async function restar_estilo() {
    const transactionHashElement = document.getElementById("transaction-hash");
    transactionHashElement.innerText = "N/A";

    // Restaurar estilos desde el objeto backupStyles
    transactionHashElement.style.backgroundColor = backupStyles.backgroundColor;
    transactionHashElement.style.border = backupStyles.border;
    transactionHashElement.style.padding = backupStyles.padding;
    transactionHashElement.style.borderRadius = backupStyles.borderRadius;
    transactionHashElement.style.boxShadow = backupStyles.boxShadow;
    transactionHashElement.style.fontSize = backupStyles.fontSize;
    transactionHashElement.style.outline = backupStyles.outline;
    transactionHashElement.style.color= backupStyles.color;

    const transactionStatus = document.getElementById("transaction-status");
    transactionStatus.innerText = "N/A";

    transactionStatus.style.backgroundColor = backupStyles2.backgroundColor;
    transactionStatus.style.border = backupStyles2.border;
    transactionStatus.style.padding = backupStyles2.padding;
    transactionStatus.style.borderRadius = backupStyles2.borderRadius;
    transactionStatus.style.boxShadow = backupStyles2.boxShadow;
    transactionStatus.style.fontSize = backupStyles2.fontSize;
    transactionStatus.style.outline = backupStyles2.outline;
    transactionStatus.style.color= backupStyles2.color;
}

// Función para reducir el hash
function reducirHash(cadena) {
    // Verificar que el hash sea lo suficientemente largo
    if (cadena.length > 10) {
        const primerosCaracteres = cadena.slice(0, 6);  // Primeros 6 caracteres
        const ultimosCaracteres = cadena.slice(-6);     // Últimos 6 caracteres
        return `${primerosCaracteres}...${ultimosCaracteres}`;  // Combinar con puntos suspensivos
    }
    return cadena;  // Si el hash es muy corto, lo devuelve tal cual
}
