import { createContext, useState } from "react";

export const AuthContext = createContext({
    accessToken: '',
    refreshToken: '',
    isAuthenticated: false,
    postAccessToken: () => {},
    postRefreshToken: () => {},
    logout: () => {},
});

function AuthContextProvider({children}){
    const [accessToken,setAccessToken] = useState();
    const [refreshToken,setRefreshToken] = useState();

    function postAccessToken(token){
        setAccessToken(token);
    }

    function postRefreshToken(token){
        setRefreshToken(token);
    }

    function logout(){
        setAccessToken(null);
        setRefreshToken(null);
    }

    const value = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: !!accessToken,
        postAccessToken: postAccessToken,
        postRefreshToken: postRefreshToken,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;