class TicketManager {
  #precioBaseDeGanancia = 0.15;
  constructor() {
    this.eventos = [];
  }

  getEventos() {
    return this.eventos;
  }

  agregarEvento(nombre, lugar, precio, capacidad = 50, fecha = new Date()) {
    const evento = {
        id: this.#generarId(),
        nombre,
        lugar,
        precio: precio + this.#precioBaseDeGanancia,
        capacidad,
        fecha,
        participantes: [],
    }
    this.eventos.push(evento)
  }
  
  agregarUsuario(idEvento, idUsuario){
    const evento = this.#evaluarEvento(idEvento);
    if (evento) {
        if (evento.participantes.includes(idUsuario)) {
            console.log("Participante ya está incluido en este evento!");
        } else {
            evento.participantes.push(idUsuario);
            console.log("Participante incluido con éxito.");
        }
    } else {
        console.log("Evento no existe!");
    }
  }

  ponerEventoEnGira(idEvento, nuevaLocalidad, nuevaFecha){
    const evento = this.#evaluarEvento(idEvento);
    if (evento) {
        const nuevoEvento = {
            ...evento,
            id: this.#generarId(),
            lugar: nuevaLocalidad,
            fecha: nuevaFecha,
            participantes: [],
        }
        this.eventos.push(nuevoEvento);
        console.log("Evento clonado con éxito.");
    } else {
        console.log("Evento no existe!");
    }
  }

  #generarId(){
    let id = 1;
    if (this.eventos.length !== 0) {
        id = this.eventos[this.eventos.length-1].id + 1;
    }
    return id
  }
  #evaluarEvento(idEvento){
    return this.eventos.find(evento => evento.id === idEvento)
  }

}

const ticketManager1 = new TicketManager();
ticketManager1.agregarEvento("Evento 1", "Lugar 1", 3, 100);
ticketManager1.agregarEvento("Evento 2", "Lugar 2", 5, 300);
ticketManager1.agregarEvento("Evento 3", "Lugar 3", 6, 400);
ticketManager1.agregarUsuario(2,1);
ticketManager1.agregarUsuario(2,1);
ticketManager1.ponerEventoEnGira(1, "Nuevo Lugar", new Date('01/10/2023'))
console.log(ticketManager1.getEventos());
