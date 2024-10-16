// Borramos el cache y demás para que sea como la primera vez que se abrió la página
window.onload = function() {
    localStorage.clear();
    sessionStorage.clear();
    load();
    //history.clearStorage();
};

let chat_id;
let password;
let walletAddress;
let myAddress;
const get_transactions="https://script.google.com/macros/s/AKfycbw3nT2CPyHuB4z05ymar7DF3KP-qR6pHn7Wvhp6P9k4TzWjelRHv7_momcVVrsMk_T5/exec";
const getStatusGoogleDrive="https://script.google.com/macros/s/AKfycbyQ7yYShnu8NwmEw3CC4tTFupHhB6382P2WiOaObpf8BwKaC3KfWlGK7OJzxI9ffeRk/exec";
//let div_log;

async function load(){

const params = new URLSearchParams(window.location.search);
chat_id=params.get("chat_id");
password=params.get("password");
walletAddress=params.get("wallet_address");
myAddress=params.get("my_address");

//div_log= document.getElementById('log');

// Creamos la lista de transacciones
const transactionList = document.getElementById('transaction-list');

const transactions=await getTransactions(chat_id,password);
let hashes = transactions.split(",");
hashes = hashes.reverse();

//const ids = [0, 1, 2];
//const types = ['deposit', 'deposit', 'withdraw'];
//const dates = ['2022-01-01', '2022-01-02', '2022-01-02'];
//const statuses = ['pendiente', 'completado', 'fallido'];
//const hashes = ['0x1234567890abcdef', '0x234567890abcdef1', '0x234567890abcdef1'];
//const froms = ['0x1234567890abcdef', '0x234567890abcdef1', '0x234567890abcdef1'];
//const tos = ['0x9876543210abcdef', '0x1234567890abcdef', '0x1234567890abcdef'];
//const amounts = [1.23, 4.56, 6.23];

const transactions_list = [];

for (let i = 0; i < hashes.length; i++) {


const transactions_data=hashes[i];//await getTransactionsData(chat_id,password,hash);
let datas = transactions_data.split(".");

let hash_=datas[0];
let date_ = await getDate(datas[1]);
let status_=await getStatusGoogleDriveM(chat_id,password,hash_);
let from_=datas[2];
let to__=datas[3];
let amount_=datas[4]/Math.pow(10, 18);
let type_;

if(myAddress.toLowerCase()===from_.toLowerCase()){
type_='withdraw';
}else{
type_='deposit';
}

    transactions_list[i] = {
        id: i,
        type: type_,
        date: date_,
        status: status_,
        hash: hash_,
        from:from_ ,
        to_: to__,
        amount: amount_
    };
}

await createTransactionList();

// Creamos la lista de transacciones
    async function createTransactionList() {
        for (const transaction of transactions_list) {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
      <span class="date"><span class="label">type : </span>${transaction.type}</span>
      <span class="date"><span class="label">date : </span>${transaction.date}</span>
      <span class="status" style="color: ${await getColorByStatus(transaction.status)}"><span class="label">status : </span>${transaction.status}</span>
      <span class="hash"><span class="label">hash : </span>${await format(transaction.hash)}
        <button class="copy-button" data-copy="${transaction.hash}">
          <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
        </button>
      </span>
      <span class="from"><span class="label">from : </span>${await format(transaction.from)}
        <button class="copy-button" data-copy="${transaction.from}">
          <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
        </button>
      </span>
      <span class="to"><span class="label">to : </span>${await format(transaction.to_)}
        <button class="copy-button" data-copy="${transaction.to_}">
          <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
        </button>
      </span>
      <span class="amount"><span class="label">amount : </span>${transaction.amount} MAVIA
        
      </span>
    `;
            transactionList.appendChild(transactionItem);

            // Agregamos el evento de click para copiar al portapapeles
            const copyButtons = transactionItem.querySelectorAll('.copy-button');
            copyButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const textToCopy = button.getAttribute('data-copy');
                    navigator.clipboard.writeText(textToCopy);
                    button.querySelector('.copy-icon').src = 'check-icon.png';
                    setTimeout(() => {
                        button.querySelector('.copy-icon').src = 'copy-icon.png';
                    }, 1000); // Cambiamos la imagen después de 1 segundo
                });
            });
        }
    }


   async function getColorByStatus(status) {
        switch (status) {
            case 'pending':
                return '#f7dc6f'; // Color para el estatus pendiente
            case 'success':
                return '#4CAF50'; // Color para el estatus completada
            case 'fail':
                return '#E91E63'; // Color para el estatus no realizada
            default:
                return '#66d9ef'; // Color por defecto
        }
    }
}



async function getTransactions(charId,password) {
const url = `${get_transactions}?action=getTransactions&char_id=${charId}&password=${password}`;



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



async function getStatusGoogleDriveM(charId,password,hash) {
const url = `${getStatusGoogleDrive}?action=getStatusGoogleDrive&char_id=${charId}&password=${password}&hash=${hash}`;

    //div_log.innerHTML =url;
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


 // Función para formatear el chat_id
async function format(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 12) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 6) + '...' + idString.substring(idString.length - 6);
}


async function getDate(data) {
    return new Date(data * 1000).toLocaleString('en-GB', {
        hour12: false, // Desactiva el formato de 12 horas
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC', // Establece la zona horaria en UTC
        timeZoneName: 'short' // Opcional: agrega la zona horaria
    });
}

// Ejemplo de uso
//const montoTransferido = 800000000000000; // Monto en formato de entero
//const montoDecimal = convertirMonto(montoTransferido);
//console.log(montoDecimal); // Salida: 0.0008
//async function getDatos(url){
//const a=await fetch(url);//.then(response => ).then(data => {
//const b=await a.json();
//let status_final;
//const status = b.result.value;
//return a.text();
//}


//?chat_id=6838756361&wallet_address=0xe7f7b219fea99ec4b351be88bc8b6cf5e1a5d0ba&my_address=0x55F701D40222b645bAD3778079CC45B81B97D568&password=UGbeeCeyivDzUp2bOoHdIhCcDFXoz8An
