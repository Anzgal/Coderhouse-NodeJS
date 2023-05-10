import { Router } from "express";
import { generateToken } from "../utils.js";
import UserManager from "../dao/mongoManager/userManager.js";

const router = Router();

const userManager = new UserManager();


router.post("/login",async(req,res)=>{
    const {email,password} = req.body;  
    const user = await userManager.findUser(email,password);
    if(user){
        const token = generateToken(user);
        res.json({token})
    }
    else{
        res.json({mensaje:"error logeo"});
    }
    
})


export default router;