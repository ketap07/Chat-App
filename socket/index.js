const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connsection", socket.id);


    //listen to connection 

    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId)
        //  if the !onlineUser if the user id === userid at that time the condition will be true negation of true is false means no need to push 
        onlineUsers.push(
            {
                userId,
                socketId: socket.id
            });
        console.log("onlineUser", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);

    });
    // add message 
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId)
        // io.to is for specific user 
        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotifications", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    })



    //  to disconnect the user when the user is logged out
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        console.log("disconect ", onlineUsers);

        io.emit("getOnlineUsers", onlineUsers);


    });
});

io.listen(3000);