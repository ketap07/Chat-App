// Context Api so we can share data gobally 

import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loginError, setLoginError] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [logInfo, setLogInfo] = useState({

        email: "",
        password: ""
    })




    //  this function for updating user info 
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

    //  this function for updating login info 
    const updatelogInfo = useCallback((info) => {
        setLogInfo(info)
    }, [])





    //  even though i have store user in local storage whenever i refresh it is null for that issue we have written below function 

    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user));

    }, [])



    // function to send login data to database 

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, logInfo);
        console.log("response", response)


        setLoginLoading(false);

        if (response.error) {
            return setLoginError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);

    }, [logInfo]);

    // logout function when my local storage should remove that user 
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);


    // function to send data to database 
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/users/register/`, registerInfo);

        setRegisterLoading(false);
        //   this function is to check whether we are getting response or not
        if (response.error)
            return setRegisterError(response)


        //   now set the user  & store that  user in local staorage for that below code is wriiten 
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)

    }, [registerInfo]);


    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                registerLoading,
                logoutUser,
                loginUser,
                logInfo,
                loginError,
                loginLoading,
                updatelogInfo,

            }}
        >

            {children}
        </AuthContext.Provider>
    );
};