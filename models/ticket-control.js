import  fs  from 'node:fs';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url); //import.meta.url proporciona la ruta abosouta del modulo actual, el fileUrltoPath convierte en una rutta valida
const __dirname = path.dirname(__filename); // se alamcena en __driname porquer en es6 no existe esta variable global

class Ticket {
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = this.escritorio;
    }
}


export class TicketControl {

    constructor() {
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];

        this.dbPath = './db/data.json'
        this.init();
       
    }
    
    get toJson() {
       return{ 
        ultimo: this.ultimo,
        hoy     : this.hoy,
        tickets : this.tickets,
        ultimos4: this.ultimos4,
       }
    }
    
    //Methods

    init() {
        //leer el archivo JSON

        if(!fs.existsSync(this.dbPath)) return; //verifica si existe
        
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const { hoy, tickets, ultimos4, ultimo } = JSON.parse(info);
        // console.log(hoy, tickets, ultimos4, ultimo)

        if ( hoy === this.hoy ) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            //Es otro dia
            this.guardarDB()
        }
    }

    guardarDB() {
   
        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ))
    } 

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ) {
        //No tenemos tickets
        if ( this.tickets.length === 0 ) return null;

        const ticket = this.tickets[0];
        this.tickets.shift(); // quita el primer elemtno del array y lo retorna

        //atender el ticket nuevo
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket ); //mete en los ultimos4 al objeto ticket que contiene su numero y su mesa

        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.splice( 4 ) // elimina desde el 5to elemento del array para que siempre haigan 4
        }

        this.guardarDB();
        return ticket; // retorna un objeto con el numero de escritorio y numero de ticket

    }
}