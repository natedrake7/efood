import { createContext, useEffect, useState} from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
    accessToken: '',
    refreshToken: '',
    isAuthenticated: false,
    postAccessToken: () => {},
    postRefreshToken: () => {},
    storeRefreshToken: async() => {},
    getUserInfo: () => {},
    logout: () => {},
});

function AuthContextProvider({children}){

    const [accessToken,setAccessToken] = useState();
    const [refreshToken,setRefreshToken] = useState();

    useEffect(() => {
        async function GetRefreshTokenFromStorage(){
            try {
                const refreshTokenStorage = await AsyncStorage.getItem('refreshToken');
                refreshTokenStorage ? postRefreshToken(refreshTokenStorage) : postRefreshToken(''); 
                }catch (error) {
            console.error('Error fetching data:', error);
            }
    }
    GetRefreshTokenFromStorage();
    },[]);


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

    function getUserInfo()
    {
        if (accessToken)
            return jwtDecode(accessToken);
         return '';
    }

    async function logout(){
        try{
            setAccessToken(null);
            setRefreshToken(null);
            await AsyncStorage.removeItem('refreshToken');
        }
        catch(error)
        {
            throw new Error(error);
        }
    }

    const value = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: !!accessToken,
        postAccessToken: postAccessToken,
        postRefreshToken: postRefreshToken,
        storeRefreshToken: storeRefreshToken,
        getUserInfo: getUserInfo,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;