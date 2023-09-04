import { TicketControl } from '../models/ticket-control.js';

const ticketControl = new TicketControl();


export const socketController = (socket) => {

    //* Estos eventos se disparan cuando un nuevo cliente o socket se conecta
    //emitir respuesta al que mando el evento
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    //Se deispara cuando el socket se conecte
    socket.emit( 'estado-actual', ticketControl.ultimos4 );

    socket.emit('tickets-pendientes', ticketControl.tickets.length )
    


    //escucha el evento que se emite y lo ejecuta
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback( siguiente )
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length ) // envia la creacion de tickets a los demas menos a el

        // Notificar que hay un nuevo ticket pendiente de asignar
    })

    socket.on('atender-ticket', ({ escritorio }, callback ) => {
        
        if ( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        //TODO: Notificar cambio en los ultimos 4

        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        socket.emit('tickets-pendientes', ticketControl.tickets.length )
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length )


        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket
            })
        }
    });

}

