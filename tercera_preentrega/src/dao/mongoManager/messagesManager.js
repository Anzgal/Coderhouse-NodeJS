import { MessagesModel } from "../models/messages.model.js";

export default class MessagesManager {
   async getMessages(){
    try {
        const messages = await MessagesModel.find();
        return messages
        
    } catch (error) {
        console.log("Error: ", error);
    }
}

async createMessages(message){
    try {
        const newMessage = await MessagesModel.create(message)
        return newMessage
    } catch (error) {
        console.log("ERROR: ", error)
    }
}
}

