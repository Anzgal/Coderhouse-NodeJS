import { transporter } from "../messaging/nodemailer.js";
import { client } from "../messaging/twilio.js";
import dotenv from "dotenv";

dotenv.config();

export const mailController = async (req, res, next) => {
	try {
		await transporter.sendMail({
			from: "Tienda Coderhouse",
			to: "agalvan70@hotmail.com",
			subject: "Subject Test",
			text: "Testing mail body",
		});
		res.send("Email sent");
	} catch (error) {
		next(error);
	}
};

export const twilioController = async (req, res, next) => {
	try {
		await client.messages.create({
			body: "Testing Twilio",
			from: process.env.TWILIO_PHONE_NUMBER,
			to: "+525510225867",
		});

		res.send("Twilio message sent");
	} catch (error) {
		next(error);
	}
};
