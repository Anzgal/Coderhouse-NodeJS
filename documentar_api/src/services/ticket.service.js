import { ticketsDao } from "../dao/factory.js";

export const createATicket = async (ticketData) => {
	const allTickets = await getTicket();
	let ticketCode = 10000;

	if (allTickets.length) {
		ticketCode = allTickets[allTickets.length - 1].ticketCode + 1;
	}
	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes().toString().padStart(2, "0");

	const dateTimeString = `${day}/${month} ${hour}:${minute}`;

	let newTicket = {
		ticketCode,
		purchase_dateTime: dateTimeString,
		amount: ticketData.amount,
		purchaser: ticketData.purchaser,
	};

	const response = await ticketsDao.createTicket(newTicket);
	return response;
};

export const getTickets = async () => {
	const response = await ticketsDao.getTickets();
	return response;
};

export const deleteTicket = async(id)=>{
    const response = await ticketsDao.deleteById(id);
    return response
}

export const deleteAllTickets = async()=>{
    const response = await ticketsDao.deleteAll();
    return response
}