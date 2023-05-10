import { createNewUser, checkUser } from "../services/users.service.js";
import logger from "../utils/winston.js";

export const createUser = async (req, res, next) => {
	try {
		const { userInfo } = req.body;
		const response = await createNewUser(userInfo);
		res.json({ mensaje: "User created", usuario: response });
		logger.info("User created");
	} catch (error) {
		next(error);
	}
};

export const findUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const response = await checkUser(email, password);
		res.json({ mensaje: response });
		logger.info("User found");
	} catch (error) {
		next(error);
	}
};

export const profileRender = async (req, res, next) => {
	try {
		if (req.session.userInfo.rol === "Administrador") {
			res.render("products", {
				userData: req.session.userInfo,
				adminData: req.session.userInfo.rol,
			});
			logger.info("Admin profile");
		} else {
			res.render("products", { userData: req.session.userInfo });
			logger.info("User profile");
		}
	} catch (error) {
		next(error);
	}
};

export const userLogin = async (req, res, next) => {
	try {
		req.session.userInfo = req.user;
		res.redirect("/products");
		logger.info("User logged");
	} catch (error) {
		next(error);
	}
};

export const userLogOut = async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				res.send("Logout Error");
				logger.error("Logout error");
			} else {
				res.status(400).redirect("/");
				logger.info("User logged out");
			}
		});
	} catch (error) {
		next(error);
	}
};
