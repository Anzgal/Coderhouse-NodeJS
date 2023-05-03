import { Router } from "express";
import { userLogin, userLogOut } from "../middlewares/userLogin.js";
import passport from "passport";

const router = Router();

router.get("/", async (req, res) => {
	res.json(req.session);
});

router.get("/logout", userLogOut);

router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/loginError",
		passReqToCallBack: true,
	}),
	userLogin
);

export default router;
