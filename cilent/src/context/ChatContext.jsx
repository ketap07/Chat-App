import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setuserChats] = useState(null);
  const [userChatsError, setuserChatsError] = useState(null);
  const [userChatsLoading, setuserChatsLoading] = useState(false);
  const [potentialChats, setpotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications)


  // intalize socket 


  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    console.log("new socket ", newSocket);

    return () => {
      newSocket.disconnect()
    }
  }, [user]);

  //  for socket 

  //  addonline users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id)
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);

    });
    //  this will disconnnect the user and status will be change 
    return () => {
      socket.off("getOnlineUsers");
    }
  }, [socket])


  // send message to the server 


  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id)

    socket.emit("sendMessage", { ...newMessage, recipientId })
  }, [newMessage])

  // receive message and Notification

  useEffect(() => {
    if (socket === null) return;


    socket.on("getMessage", res => {

      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res])

    });
    socket.on("getNotifications", res => {

      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev])
      } else {
        setNotifications((prev) => [res, ...prev])
      }
    })

    // clean up function '
    return () => {
      socket.off("getMessage")
      socket.off("getNotifications")
    }
  }, [socket, currentChat])

  //  useEffect this function will check if the logged user kets have already created chat with the  person he /she wants to have  chat if not then it will let user create a new chat will create from this function (createChat)
  useEffect(() => {

    const getUsers = async () => {

      const response = await getRequest(`${baseUrl}/users`)

      if (response.error) {
        return console.log("Error fetching users", response);
      }


      const pChats = response.filter((u) => {
        let isChatCreated = false;
        // if login user ===current user then dont add to pChats
        if (user?._id === u._id) return false;

        //  if chat already exists for the particular then for that no need to create newchat 
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id
          });
        }
        return !isChatCreated

      });
      setpotentialChats(pChats);
      setAllUsers(response);
    }
    getUsers()

  }, [userChats])

  // for eg i have logged in as kets and i want create chat with new person rather then abhishek and keta at that  time this function will create a new chat with third person for this PotentialChats component 

  const createChat = useCallback(async (firstId, secondId) => {


    const response = await postRequest(`${baseUrl}/chats/`, { firstId, secondId })

    if (response.error) {
      return console.log("Error fetching users", response);
    }


    setuserChats((prev) => [...prev, response]);

  }, [])



  //  use effect  i have logged in as kets and i want to see with whom i have created the chat ,for eg i have created chat with abhishek and keta then it will show that two user for this the componet is (Chat.jsx )
  useEffect(() => {

    const getUserChats = async () => {

      if (user?._id) {
        setuserChatsLoading(true);
        setuserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

        setuserChatsLoading(false);

        if (response.error) {
          return setuserChatsError(response)
        }


        setuserChats(response)

      }


    };
    getUserChats()

  }, [user , notifications])

  // this updateCurrentChat for onclick get current  stateof the message 

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat)


  }, [])



  //  get message when the user click on the particular user for eg i have clicked  on abhishek  then it will open  the chatbox in that i will see the messages 

  useEffect(() => {

    const getMessages = async () => {

      setMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)

      setuserChatsLoading(false);

      if (response.error) {
        return setMessagesError(response)
      }


      setMessages(response)




    };
    getMessages()

  }, [currentChat])

  //  send Text Message for eg i have logged as kets i want to send message to abhishek i will click on the chat it will open chat box there i will write meesage i will send to abhishek

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {


      if (!textMessage)
        return console.log("You must type something...");

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return setSendTextMessageError(response.error);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    [])

  //  markNotfication as read function 

  const markAllNotificationAsRead = useCallback((notifications) => {

    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true }

    });

    setNotifications(mNotifications);

  }, []);



  //  this function is for when i click on notification it will open chat 

  const markNotificationAsRead = useCallback((n,userChats, user,notifications)=>{
    
    // find chat to open 
    const desiredChat = userChats.find((chat)=>{
      const chatMembers = [user._id,n.senderId];
      const isDesiredChat = chat?.members.every((member)=>{
        return chatMembers.includes(member);
      });
      return  isDesiredChat ;
    });
    
    //  mark notification as read 
    const mNotifications = notifications.map(el => 
      {
      if(n.senderId === el.senderId){
        return { ...n, isRead: true }
      }else{
        return el;
      }

     })
     

    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);



  },[]);

  // for userChat notifications


  const markThisUserNotificationAsRead = useCallback((thisUserNotification,notifications)=>{
    // mark notification as read
    const mNotifications = notifications.map(el => {
      let  notification;

      thisUserNotification.forEach(n=>{
        if (n.senderId === el.senderId){
          notifications ={ ...n, isRead: true }
        }else{
          notifications = el 
        }
      })
          return notifications
    })

    setNotifications(mNotifications);
  },[])

  return (
    <ChatContext.Provider value={{
      userChats,
      userChatsError,
      userChatsLoading,
      potentialChats,
      createChat,
      updateCurrentChat,
      messages,
      setMessagesLoading,
      setMessagesError,
      currentChat,
      sendTextMessage,
      onlineUsers,
      notifications,
      allUsers,
      markAllNotificationAsRead,
      markNotificationAsRead,
      markThisUserNotificationAsRead,

    }}>

      {children}
    </ChatContext.Provider>
  );
};

