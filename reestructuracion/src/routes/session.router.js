import { Router } from "express";
import UserManager from "../dao/mongoManager/userManager.js";
import passport from "passport";

const router = Router();

const userManager = new UserManager();

router.get("/", async (req, res) => {
  res.json(req.session);
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.send("Logout Error");
      } else {
        res.status(400).json({ status: true });
      }
    });
  } catch (error) {
    return { error };
  }
});

//OLD LOGIN
/* router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const correctUser = await userManager.findUser(email, password);
  if (correctUser !== null) {
    req.session.userInfo = correctUser;
    req.session.email = email;
    res.redirect("/products");
  } else {
    res.render("loginError");
  }
}); */

//PASSPORT LOGIN
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/loginError",
    passReqToCallBack: true,
  }),
  async (req, res) => {
    req.session.userInfo = req.user;
    req.session.email = req.body.email;
    res.redirect("/products");
  }
);

//OLD REGISTER
/* router.post("/registro", async (req, res) => {
  try {
    const newUserInfo = req.body;
    const newUser = await userManager.createUser(newUserInfo);

    if (!newUser) {
      res.render("registroFailed");
    } else {
      res.render("registroSuccess");
    }
  } catch (error) {
    return { error };
  }
}); */

//PASSPORT REGISTER
router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/registroFailed",
    successRedirect: "/registroSuccess",
    passReqToCallBack: true,
  })
);

export default router;
