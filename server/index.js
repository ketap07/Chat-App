const express = require("express");
const cors = require("cors"); //allow to communicate with front-end
const mongoose = require("mongoose"); // Database 
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");


//  this are middleware this add extra capbalities to the application
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// CRUD - create , read, update and delete
//  this get is to check srver in connected to that port or not 
app.get("/", (req, res) => {
    res.send("Welcome our CHAT-APP APIs.. ")

});



const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
    console.log(`Server running on port :${port}`);

});


// connecting database 
mongoose.connect(uri).then(() => {
    console.log("MongoDB connection established");
}).catch((error) => {
    console.log("MongoDB connection failed:", error.message)

});
