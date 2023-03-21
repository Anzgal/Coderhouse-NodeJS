import passport from "passport";
import { usersModel } from "../persistencia/models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPassword, comparePasswords } from "../utils.js";
import { Strategy as GitHubStrategy } from "passport-github2";
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
      console.log({ email, password });
      const user = await usersModel.findOne({ email });
      if (user) {
        return done(null, false);
      }
      const hashNewPassword = await hashPassword(password);
      const newUser = { ...req.body, password: hashNewPassword };
      const newUserBD = await usersModel.create(newUser);
      done(null, newUserBD);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const correctUser = await usersModel.findOne({ email });
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          correctUser.rol = "Admin";
          correctUser.save();
          return done(null, correctUser);
        } else {
          if (correctUser) {
            const isPassword = comparePasswords(password, correctUser.password);
            if (isPassword) {
              return done(null, correctUser);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }
        }
      } catch (error) {
        console.log(error);
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
      const user = await usersModel.findOne({ email: profile._json.email });
      if (!user) {
        console.log("PROFILE:", profile);
        const newUser = {
          first_name: profile._json.name ? profile._json.name.split(" ")[0]: "FIRST_NAME",
          last_name: profile._json.name ? profile._json.split(" ")[1] || " " : "LAST_NAME",
          email: profile._json.email || profile._json.login + "@mail.com",
          password: " ",
        };
        const userBD = await usersModel.create(newUser);
        done(null, userBD);
      } else {
        done(null, user);
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
