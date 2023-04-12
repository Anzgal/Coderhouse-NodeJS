import { Router } from "express";
import UserManager from "../dao/mongoManager/userManager.js";
import passport from "passport";

const router = Router();

const userManager = new UserManager();

router.get("/", async (req, res) => {
  try {
    await userManager.findUser();
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/registroGithub",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get("/github", passport.authenticate("github"), (req, res) => {
  req.session.email = req.user.email;
  res.redirect("/products");
});

export default router;
