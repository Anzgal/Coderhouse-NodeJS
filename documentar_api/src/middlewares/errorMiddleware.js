import { logger } from "../utils/log/logger.js";

export const errorsMiddleware = (error, req, res, next) => {
	logger.error(`${error.name} ${error.code}`);
	res.status(error.code).render("invalidUrl", { error });
};
