
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login =(tokenValue,userData)=>{
        console.log("LOGIN FUNCTION CALLED");
        localStorage.setItem("token",tokenValue);
        localStorage.setItem("user",JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    }

    const logout =()=>{
        localStorage.clear();
        setToken(null);
        setUser(null);
        window.location.href="/login";
    };


    return (
        <AuthContext.Provider value={{user,token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );



};

export const useAuth=()=>useContext(AuthContext);