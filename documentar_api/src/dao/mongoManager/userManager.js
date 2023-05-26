import { usersModel } from "../models/user.model.js";
import { hashPassword } from "../../utils.js";
import { comparePasswords } from "../../utils.js";
import CustomError from "../../errors/customError.js";
import { errors } from "../../errors/errors.dictionary.js";

export default class UserManager {
	async createUser(userInfo) {
		const { email, password, first_name, last_name } = userInfo;
		if (!first_name || !last_name || !email || !password) {
			CustomError.createError(errors.BadRequest);
		}
		const existUser = await usersModel.find({ email });
		if (existUser.length) {
			return null;
		} else {
			if (userInfo.password === " ") {
				return existUser[0];
			} else {
				const hashNewPassword = password !== " " ? await hashPassword(password) : password;

				const newUser =
					email === "coderAdmin@gmail.com"
						? {
								...userInfo,
								password: hashNewPassword,
								rol: "Administrador",
						  }
						: {
								...userInfo,
								password: hashNewPassword,
						  };
				return await usersModel.create(newUser);
			}
		}
	}

	async findUser(email, password) {
		const correctUser = await usersModel.find({ email }).lean();
		if (correctUser.length) {
			const isPassword = await comparePasswords(password, correctUser[0].password);
			if (isPassword) {
				return correctUser[0];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	async updateUser(email, updateId) {
		const response = await usersModel.findOneAndUpdate(
			{ email },
			{ associatedCart: updateId },
			{ new: true }
		);
		return response;
	}
}
