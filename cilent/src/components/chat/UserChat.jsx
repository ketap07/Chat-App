import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avarter from "../../assets/avarter.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment"


const UserChat = ({ chat, user }) => {

  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationAsRead } = useContext(ChatContext);



  const { latestMessage } = useFetchLatestMessage(chat);

  //  for online user this function show green if the user is online
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  //  function for notifications
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotification = unreadNotifications.filter(
    n => n.senderId === recipientUser?._id
  )

  //  function to show short text on display 

  const turncateText = (text) => {

   let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";

    }
    return shortText;
  };








  return <Stack direction="horizontal" gap={3}
    className="user-card align-items-center p-2 justify-content-between" role="button"
    onClick={() => {
      if (thisUserNotification?.length !== 0) {
        markThisUserNotificationAsRead(thisUserNotification, notifications);
      }

    }}
  >
    <div className="d-flex">
      <div className="me-2">
        <img src={avarter} height="35px" />
      </div>
      <div className="text-content">
        <div className="name">{recipientUser?.name}</div>
        <div className="text">
          {latestMessage?.text && (
            <span>
              {turncateText(latestMessage?.text)}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="d-flex-column align-items-end">
      <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
      <div className={thisUserNotification?.length > 0 ? "this-user-notifications" : ""}>
        {thisUserNotification?.length > 0 ? thisUserNotification?.length : ''}
      </div>
      <span className={isOnline ? "user-online" : ""}></span>
    </div>

  </Stack>;



};

export default UserChat;