import { ticketModel } from "../models/ticket.model.js";

export default class TicketManager {
	async createTicket(newTicket) {
		const response = await ticketModel.create(newTicket);
		return response;
	}

	async getTickets() {
		const ticketsData = await ticketModel.find({});
		return ticketsData;
	}
	async deleteAll() {
		const response = await ticketModel.deleteMany({});
		return response;
	}
	async deleteById(id) {
		const response = await ticketModel.findByIdAndDelete(id);
		return response;
	}
}
