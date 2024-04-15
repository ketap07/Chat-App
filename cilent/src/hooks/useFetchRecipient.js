import { useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setrecipientUser] = useState(null);
    const [error, setError] = useState(null);

    //  for other userid we wil fetch from database when i login as kets i should have other user data for eg abhishek data for that i have written below code  this function i called in this component UserChat.jsx  

    const recipientId = chat?.members.find((id) => id !== user?._id)


    useEffect(() => {

        const getUser = async () => {

            if (!recipientId) return null

            // getting other user details from userRoutes
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`)



            if (response.error)
                return setError(error);


            setrecipientUser(response);

        }
        getUser()

    }, [recipientId]);

    return { recipientUser };

};