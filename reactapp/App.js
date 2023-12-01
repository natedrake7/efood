import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();

export default function App(){
  return(
      <>
        <StatusBar style='dark'/>
        <AuthContextProvider>
          <Navigation/>
        </AuthContextProvider>
      </>
  );
}

function Navigation(){
  const authCtx = useContext(AuthContext);
  return(
    <NavigationContainer>
     {!authCtx.isAuthenticated && <AuthStack/>}
     {authCtx.isAuthenticated && <AuthenticatedStack/>}
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