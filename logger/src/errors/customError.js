export default class CustomError {
	static createCustomError({ name = "Custom error", cause, message }) {
		const newError = new Error(message, { cause });
		newError.name = name;
		throw newError;
	}
}
