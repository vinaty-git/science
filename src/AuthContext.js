import { createContext, useState, useEffect } from "react";
import Cookies from 'universal-cookie';

const AuthContext = createContext();

export function AuthProvider({children}) {

const [isUser,setIsUser] = useState(false);
const [emailConfirmed,setEmailConfirmed] = useState(false);

const cookies = new Cookies();
var cookieUser = cookies.get('_token2');
var cookieEmail = cookies.get('_email');

/**
 * If exists cookie _token2, means that user is registered
 */
useEffect(()=>{
    if (cookieUser !== undefined) {
        setIsUser(true);
    } else {
        setIsUser(false);
    }
},[]);

/**
 * If exists cookie _email, means that user email was confirmed
 */
useEffect(()=>{
    if (cookieEmail !== undefined) {
        setEmailConfirmed(true);
    } else {
        setEmailConfirmed(false);
    }
},[]);

return(
    <AuthContext.Provider value={{isUser,setIsUser,emailConfirmed,setEmailConfirmed}}>
        {children}
    </AuthContext.Provider>
);

} 

export default AuthContext;