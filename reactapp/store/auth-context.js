import { createContext, useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
    accessToken: '',
    refreshToken: '',
    isAuthenticated: false,
    rememberMe: false,
    postAccessToken: () => {},
    postRefreshToken: () => {},
    storeRefreshToken: async() => {},
    logout: () => {},
});

function AuthContextProvider({children}){

    const [accessToken,setAccessToken] = useState();
    const [refreshToken,setRefreshToken] = useState();

    function postAccessToken(token){
        setAccessToken(token);
    }

    async function storeRefreshToken(token){
        try{
            await AsyncStorage.setItem('refreshToken',token);
        }
        catch(error)
        {
            throw new Error(error);
        }
    }

    function postRefreshToken(token){
        setRefreshToken(token);
    }

    async function logout(){
        try{
            await AsyncStorage.removeItem('refreshToken');
        }
        catch(error)
        {
            throw new Error(error);
        }
        setAccessToken(null);
        setRefreshToken(null);
    }

    const value = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: !!accessToken,
        rememberMe: !!refreshToken,
        postAccessToken: postAccessToken,
        postRefreshToken: postRefreshToken,
        storeRefreshToken: storeRefreshToken,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;