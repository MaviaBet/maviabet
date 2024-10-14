// Borramos el cache y demás para que sea como la primera vez que se abrió la página
window.onload = function() {
    localStorage.clear();
    sessionStorage.clear();
    load();
    //history.clearStorage();
};

let userId;

function load(){

// Creamos la lista de transacciones
const transactionList = document.getElementById('transaction-list');

// Simulamos datos de transacciones (reemplaza con tu API o datos reales)
const transactions = [
    {
        id: 1,
        type:'deposit',
        date: '2022-01-01',
        status: 'pendiente',
        hash: '0x1234567890abcdef',
        from: '0x1234567890abcdef',
        to: '0x9876543210abcdef',
        amount: 1.23
    },
    {
        id: 2,
        type:'deposit',
        date: '2022-01-02',
        status: 'completado',
        hash: '0x234567890abcdef1',
        from: '0x234567890abcdef1',
        to: '0x1234567890abcdef',
        amount: 4.56
    },

    {
        id: 3,
        type:'withdraw',
        date: '2022-01-02',
        status: 'fallido',
        hash: '0x234567890abcdef1',
        from: '0x234567890abcdef1',
        to: '0x1234567890abcdef',
        amount: 6.23
    },
    // ...
];

// Creamos la lista de transacciones
    transactions.forEach((transaction, index) => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
        <span class="date"><span class="label">type : </span>${transaction.type}</span>
        <span class="date"><span class="label">date : </span>${transaction.date}</span>
<span class="status" style="color: ${getColorByStatus(transaction.status)}"><span class="label">status : </span>${transaction.status}</span>
        <span class="hash"><span class="label">hash : </span>${transaction.hash}
            <button class="copy-button" data-copy="${transaction.hash}">
                <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
            </button>
        </span>
        <span class="from"><span class="label">from : </span>${transaction.from}
            <button class="copy-button" data-copy="${transaction.from}">
                <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
            </button>
        </span>
        <span class="to"><span class="label">to : </span>${transaction.to}
            <button class="copy-button" data-copy="${transaction.to}">
                <img src="copy-icon.png" alt="Copiar" class="copy-icon" width="16" height="16">
            </button>
        </span>
        <span class="amount"><span class="label">amount : </span>${transaction.amount}
          
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
    });

    function getColorByStatus(status) {
        switch (status) {
            case 'pendiente':
                return '#f7dc6f'; // Color para el estatus pendiente
            case 'completado':
                return '#4CAF50'; // Color para el estatus completada
            case 'fallido':
                return '#E91E63'; // Color para el estatus no realizada
            default:
                return '#66d9ef'; // Color por defecto
        }
    }
}