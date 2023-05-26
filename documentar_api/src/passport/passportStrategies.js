import passport from "passport";
import { usersModel } from "../dao/models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPassword, comparePasswords } from "../utils.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import { createNewUser, checkUser } from "../services/users.service.js";
import { logger } from "../utils/log/logger.js";
import * as dotenv from "dotenv";

dotenv.config();

passport.use(
	"registro",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const user = await createNewUser(req.body);
				if (!user) {
					logger.warning("Usuario existente");
					return done(null, false);
				}
				logger.info(`Usuario creado: ${user}`);
				done(null, user);
			} catch (error) {
				return done("Error al obtener el usuario:", error);
			}
		}
	)
);

passport.use(
	"login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const correctUser = await checkUser(email, password);
				if (correctUser) {
					logger.info(`User logged in: ${correctUser}`);
					return done(null, correctUser);
				} else {
					return done(null, false);
				}
			} catch (error) {
				return done(null, false, { message: "Password or unvalid user" });
			}
		}
	)
);

passport.use(
	"github",
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/api/users/github",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const newUserGitHub = {
					first_name: profile._json.name
						? profile._json.name.split(" ")[0]
						: "FIRST_NAME",
					last_name: profile._json.name
						? profile._json.split(" ")[1] || " "
						: "LAST_NAME",
					email: profile._json.email || profile._json.login + "@mail.com",
					password: " ",
				};

				const user = await createNewUser(newUserGitHub);
				if (!user) {
					done(null, user);
				} else {
					done(null, user);
				}
			} catch (error) {
				return done, error;
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	const user = await usersModel.findById({ _id: id });

	done(null, user);
});
