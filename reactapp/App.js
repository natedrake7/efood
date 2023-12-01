import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext,useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

function Root(){
  const [isTryingLogin,setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function GetRefreshTokenFromStorage(){
      try {
        const refreshTokenStorage = await AsyncStorage.getItem('refreshToken');
        refreshTokenStorage ? authCtx.postRefreshToken(refreshTokenStorage) : authCtx.postRefreshToken(''); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsTryingLogin(false);
    };

    GetRefreshTokenFromStorage();
  }, []);

  if(!isTryingLogin)
  {
    SplashScreen.hideAsync();
    return <Navigation/>
  }

}

export default function App(){

  return(
      <>
        <StatusBar style='dark'/>
        <AuthContextProvider>
          <Root/>
        </AuthContextProvider>
      </>
  );
}

function Navigation(){
  const authCtx = useContext(AuthContext);

  return(
    <NavigationContainer>
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
  </NavigationContainer>
  );
}

function AuthStack(){
  return(
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
  );
}


function AuthenticatedStack(){
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
      </Stack.Navigator>
  )
}