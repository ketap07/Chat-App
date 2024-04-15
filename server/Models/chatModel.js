const mongoose = require ("mongoose");


const chatSchmea = new mongoose.Schema(
    {
        members: Array,
    },
    {
        timestamps:true,
    }


);

const chatModel =mongoose.model("Chat",chatSchmea);
module.exports = chatModel;
