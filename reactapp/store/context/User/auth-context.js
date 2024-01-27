import { createContext, useEffect, useState} from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetToken } from "./auth";

export const AuthContext = createContext({
    accessToken: '',
    refreshToken: '',
    cart: [],
    cartLength: 0,
    isAuthenticated: false,
    isFetchingToken: true,
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
    const [cartLength,setCartLength] = useState(0);

    useEffect(() => {
        async function GetRefreshTokenFromStorage(){
            try {
                const refreshTokenStorage = await AsyncStorage.getItem('refreshToken');
                if(refreshTokenStorage)
                {
                    postRefreshToken(refreshTokenStorage);
                    const accessToken = await GetToken(refreshTokenStorage);
                    accessToken ? postAccessToken(accessToken) : postAccessToken('');
                }
                setIsFetchingToken(false)
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

    function addToCart(itemToAdd) {
        const existingItem = cart.find(item => item === itemToAdd);

        if(existingItem)
            existingItem.count +=1
        else
        {
            itemToAdd.count = 1;
            itemToAdd.uniqueId = cart.length + 1;
            setCartItem([...cart, itemToAdd]);
        }
        setCartLength(prevLength => prevLength + 1);
    }
    
    function removeFromCart(uniqueId) {
        const existingItem = cart.find(item => item.uniqueId === uniqueId);
        
        if(existingItem.count > 1)
            existingItem.count--;
        else
            setCartItem(cart.filter(item => item.uniqueId != existingItem.uniqueId));
        setCartLength(prevLength => prevLength - 1);
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
        cartLength:cartLength,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        getUserInfo: getUserInfo,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;