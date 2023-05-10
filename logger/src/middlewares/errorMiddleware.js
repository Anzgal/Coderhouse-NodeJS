import logger from "../utils/winston.js";

export const errorsMiddleware = (error, req, res, next) => {
	res.status(error.code).send({
		error: error.name,
		cause: error.cause,
		message: error.message,
	});
	if (error) {
		logger.error(
			`Method: ${req.method} - URL: ${req.url} - date: ${Date().toString()} - error: ${
				error.message
			}`
		);
	}

	next();
};
