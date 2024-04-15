import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";


// this component will show all the user but it will not show your data and it will show  user who have chat already with you
const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

    //user?.id is for logged in user and u._id with whom that login user wnat to create a new chat its firstid ,secondid
    return (
        <>
            <div className="all-users" >
                {potentialChats && potentialChats.map((u, index) => {
                    return (
                        <div className="single-user" key={index} onClick={() => createChat(user?._id, u._id)}>
                            {u.name}
                            <span className={onlineUsers?.some((user) => user?.userId === u?._id) ? "user-online" : ""}></span>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default PotentialChats;