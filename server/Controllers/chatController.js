const chatModel = require("../Models/chatModel");



// createChat
// getUserChats
// findChat


// createChat function
const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        // existing chat logic
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });
        //  if the chat already exists
        if (chat)
            return res.status(200).json(chat);

        // newChat logic 
        const newChat = await chatModel(
            { members: [firstId, secondId] },
        );

        const response = await newChat.save();
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};



// findUSerChat function all the chats for the particular user 
const findUserChat = async (req, res) => {

    const userId = req.params.userId;
    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });
        res.status(200).json(chats);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};


// it will give chat between two user 
const findChat = async (req, res) => {

    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        res.status(200).json(chat)

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
module.exports = { createChat, findUserChat, findChat };
