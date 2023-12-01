import { useEffect,useState,useContext } from "react";
import { View ,Text } from "react-native";
import { GetToken } from "../store/auth";
import { AuthContext } from "../store/auth-context";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const RememberMeScreen = ()  =>{
    const [isFetchingToken,setIsFetchingToken] = useState(true);
    const authCtx = useContext(AuthContext);
  
    useEffect(() => {
      async function GetAccessToken(){
        try {
          const token = await GetToken(authCtx.refreshToken);
          token ? authCtx.postAccessToken(token) : authCtx.postAccessToken('');
        } 
        catch (error) {
          console.error('Error fetching data:', error);
        }
        setIsFetchingToken(false);
      };
  
      GetAccessToken();
    }, []);
}
export default RememberMeScreen;