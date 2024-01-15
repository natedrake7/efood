import { createContext, useEffect, useState} from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetToken } from "./auth";

export const AuthContext = createContext({
    accessToken: '',
    refreshToken: '',
    cart: [],
    isAuthenticated: false,
    isFetchingToken: false,
    postAccessToken: () => {},
    postRefreshToken: () => {},
    storeRefreshToken: async() => {},
    getUserInfo: () => {},
    addToCart: () => {},
    removeFromCart: () => {},
    logout: () => {},
});

function AuthContextProvider({children}){

    const [accessToken,setAccessToken] = useState();
    const [refreshToken,setRefreshToken] = useState();
    const [isFetchingToken,setIsFetchingToken] = useState(true);
    const [cart,setCartItem] = useState([]);

    useEffect(() => {
        async function GetRefreshTokenFromStorage(){
            try {
                const refreshTokenStorage = await AsyncStorage.getItem('refreshToken');
                if(refreshTokenStorage)
                {
                    postRefreshToken(refreshTokenStorage);
                    const accessToken = await GetToken(refreshTokenStorage);
                    accessToken ? postAccessToken(accessToken) : postAccessToken('');
                    setIsFetchingToken(false)
                }
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

    function addToCart(item) {
        setCartItem([...cart, item]);
    }
    
    function removeFromCart(itemToRemove) {
        setCartItem(cart.filter(item => item.id !== itemToRemove.id));
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
        isFetchingToken: isFetchingToken,
        postAccessToken: postAccessToken,
        postRefreshToken: postRefreshToken,
        storeRefreshToken: storeRefreshToken,
        cart: cart,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        getUserInfo: getUserInfo,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;