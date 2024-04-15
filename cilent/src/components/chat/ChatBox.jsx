import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment"
import InputEmoji from "react-input-emoji";


const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const {
        currentChat,
        messages,
        ismessagesLoading,
        messagesError,
        sendTextMessage
    } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    //  scrolling function 


    useEffect(() => {
        console.log("scroll",scroll)
        scroll.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages])






    if (!recipientUser)
        return <p className="no-selected-chat">No Conversation Selected Yet....</p>;

    if (ismessagesLoading)
        return <p className="no-selected-chat">Loading chats...</p>;


    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, index) => {
                        return (
                            <Stack
                                key={index}
                                className={`${message?.senderId === user?._id
                                    ? "message self align-self-end flex-grow-0"
                                    : "message align-self-start flex-grow-0"
                                    }`}

                                ref={scroll}
                            >
                                <span>{message.text}</span>
                                <span className="message-footer">
                                    {moment(message.createdAt).calendar()}
                                </span>
                                {/* Yesterday at 5:53 PM - use of calendar() */}
                            </Stack>
                        );
                    })}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input-flex-grow-0">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                />
                <button
                    className="send-btn"
                    onClick={() =>
                        sendTextMessage(textMessage, user, currentChat._id, setTextMessage)

                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send"
                        viewBox="0 0 16 16"
                    >
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    );
};

export default ChatBox;