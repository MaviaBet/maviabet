
const get_transactions='https://script.google.com/macros/s/AKfycbw3nT2CPyHuB4z05ymar7DF3KP-qR6pHn7Wvhp6P9k4TzWjelRHv7_momcVVrsMk_T5/exec';
const getStatusGoogleDrive='https://script.google.com/macros/s/AKfycbyQ7yYShnu8NwmEw3CC4tTFupHhB6382P2WiOaObpf8BwKaC3KfWlGK7OJzxI9ffeRk/exec';

let chat_id;
let password;
let walletAddress;
let myAddress;
//let div_log;

let alertDialog ;
let closeBtn;
let progressBarInner ;
let progressText ;
let overlay;
let porciento_total;


document.addEventListener('DOMContentLoaded', function() {
    localStorage.clear();
    sessionStorage.clear();
    load_transactions();

async function load_transactions(){

const params = new URLSearchParams(window.location.search);
chat_id=params.get("chat_id");
password=params.get("password");
walletAddress=params.get("wallet_address");
myAddress=params.get("my_address");


    alertDialog = document.getElementById('alert-dialog');
    closeBtn = document.getElementById('close-btn');
    progressBarInner = document.querySelector('.progress-bar-inner');
    progressText = document.getElementById('progress-text');
    overlay = document.getElementById('overlay');

//div_log= document.getElementById('log');

// Creamos la lista de transacciones
const transactionList = document.getElementById('transaction-list');

showDialog_transactions();
await updateProgressBar_transactions(5); // Update the progress bar to 50%

const transactions=await getTransactions_transactions(chat_id,password);
await updateProgressBar_transactions(10); // Update the progress bar to 50%

 if(transactions==='999'||
  transactions==='888'||
  transactions==='Invalid action or missing parameters'||
  transactions==='Char ID not found'){
     await updateProgressBar_transactions(100); // Update the progress bar to 50%
     closeDialog_transactions();
     return;
 }


let hashes = transactions.split(",");
hashes = hashes.reverse();

const transactions_list = [];

const hashes_length=hashes.length;
const i0=90;
const i1=i0/hashes_length;//Porciento por hash
//let i2=i1/2;//Porciento en 2 pasos por hash
//i2=i2.toFixed(2);
porciento_total=10;

for (let i = 0; i < hashes.length; i++) {
//div_log.innerHTML ='A : '+i+'/'+hashes_length;
const transactions_data=hashes[i];//await getTransactionsData(chat_id,password,hash);
let datas = transactions_data.split(".");

let hash_=datas[0];
let date_ = await getDate_transactions(datas[1]);

let status_=await getStatusGoogleDriveM_transactions(chat_id,password,hash_);
porciento_total=porciento_total+i1;

updateProgressBar_transactions(porciento_total); // Update the progress bar to 50%

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

await createTransactionList_transactions();

closeDialog_transactions();

// Creamos la lista de transacciones
    async function createTransactionList_transactions() {
        for (const transaction of transactions_list) {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
      <span class="date"><span class="label">type : </span>${transaction.type}</span>
      <span class="date"><span class="label">date : </span>${transaction.date}</span>
      <span class="status" style="color: ${await getColorByStatus_transactions(transaction.status)}"><span class="label">status : </span>${transaction.status}</span>
      <span class="hash"><span class="label">hash : </span>${await format_transactions(transaction.hash)}
        <button class="copy-button" data-copy="${transaction.hash}">
          <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
        </button>
      </span>
      <span class="from"><span class="label">from : </span>${await format_transactions(transaction.from)}
        <button class="copy-button" data-copy="${transaction.from}">
          <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
        </button>
      </span>
      <span class="to"><span class="label">to : </span>${await format_transactions(transaction.to_)}
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


   async function getColorByStatus_transactions(status) {
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



async function getTransactions_transactions(charId,password) {
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



async function getStatusGoogleDriveM_transactions(charId,password,hash) {
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
async function format_transactions(id) {
    const idString = id.toString();  // Convertir a cadena
    if (idString.length <= 12) {
        return idString;  // Si el ID es corto, retornar tal cual
    }
    // Retornar solo los primeros 3 y últimos 3 dígitos
    return idString.substring(0, 6) + '...' + idString.substring(idString.length - 6);
}


async function getDate_transactions(data) {
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



// Function to show the dialog
function showDialog_transactions(){
    overlay.style.display = 'block'; /* Muestra el overlay */
    alertDialog.style.display = 'block'; /* Muestra la barra de progreso */
}

// Function to close the dialog
function closeDialog_transactions() {
    overlay.style.display = 'none'; /* Oculta el overlay */
    alertDialog.style.display = 'none'; /* Oculta la barra de progreso */
}

// Function to update the progress bar
function updateProgressBar_transactions(percentage) {
    progressBarInner.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% Complete`;
}

});

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


//?chat_id=6838756361&wallet_address=0xefd6aea31b1c75dcb120a886d89750f1f562ca75&my_address=0x55F701D40222b645bAD3778079CC45B81B97D568&password=4moWeQxIgc1HYpmMRHPk5Kiv1pe1upim
