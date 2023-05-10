import { Router } from "express";
import { createUser, findUser } from "../controllers/users.controller.js";
import passport from "passport";

const router = Router();

router.get("/", findUser);

router.get(
	"/registroGithub",
	passport.authenticate("github", {
		scope: ["user:email"],
	})
);

router.get("/github", passport.authenticate("github"), async (req, res) => {
	req.session.userInfo = req.user;
	res.redirect("/products");
});

router.post(
	"/registro",
	passport.authenticate("registro", {
		failureRedirect: "/registroFailed",
		successRedirect: "/registroSuccess",
		passReqToCallBack: true,
	})
);

export default router;
