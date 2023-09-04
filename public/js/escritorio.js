
// Referencias html
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams( window.location.search ); //crea una url o extrae los querys

if ( !searchParams.has('escritorio') ) { // se vincula al name del form
    
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio'); //busca el query de escritorio
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';



const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;

});

socket.on('tickets-pendientes', ( pendientes ) => { // retorna los numeros de pendientes del server

    if ( pendientes === 0 ) {
        lblPendientes.style.display = 'none'
    }else{
        lblPendientes.innerText = pendientes;
        lblPendientes.style.display = ''
    }
})


btnAtender.addEventListener( 'click', () => {
    //decirle al bakcend que escuche un evento

    socket.emit('atender-ticket',{ escritorio }, ( { ok, ticket, msg } ) => {

        if ( !ok ) {
            lblTicket.innerText = `Nadie`
            return divAlerta.style.display = '';   
        }
        
        lblTicket.innerText = `Ticket ${ ticket.numero }`


        //console.log( payload ); // aca imprime el resultado del callback del listen del socket en el servvidor
    })


    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});