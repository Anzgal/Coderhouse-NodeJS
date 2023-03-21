import { messagesModel } from "../models/messages.model.js";

export default class MessagesManager {
   async getMessages(){
    try {
        const messages = await messagesModel.find();
        return messages
        
    } catch (error) {
        console.log("Error: ", error);
    }
}

async createMessages(message){
    try {
        const newMessage = await messagesModel.create(message)
        return newMessage
    } catch (error) {
        console.log("ERROR: ", error)
    }
}
}

