import { Router } from "express";
import UserManager from "../persistencia/dao/userManager.js";

const router = Router();

const userManager = new UserManager();

router.get("/",async(req,res)=>{
    try {
        await userManager.findUser()
    } catch (error) {
        console.log(error)
    }
});

export default router