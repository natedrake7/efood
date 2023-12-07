import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext,useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import DetailsScreen from './components/Details';
import ProductDetailsScreen from './components/ProductDetails';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './components/ProfileScreen';
import DrawerScreen from './components/DrawerScreen';

const Drawer = createDrawerNavigator();
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
    return <Navigation/>;
  }
};

export default function App(){

  return(
      <>
        <AuthContextProvider>
        <StatusBar barStyle="dark-content"/>
            <Root/>
        </AuthContextProvider>
      </>
  );
};

function Navigation(){
  const authCtx = useContext(AuthContext);

  return(
    <NavigationContainer theme={Theme}>
      {authCtx.isAuthenticated ? <AuthenticatedStack/> : <AuthStack />}
    </NavigationContainer>
  );
};

function AuthStack(){
  return(
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
  );
};


function AuthenticatedStack(){
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="DrawerHome" options={{headerShown: false}}>
      {() => (
          <Drawer.Navigator 
          drawerContent={props => <DrawerScreen {...props}/>}
          screenOptions={headerOptions}
          drawerPosition="left"
          drawerType="slide"
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen}/>
        </Drawer.Navigator>
      )}
      </Stack.Screen>
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  )
};

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000ea'
  },
};

const headerOptions = {
  headerMode: 'float',

  headerStyle: {backgroundColor: '#000000ea'},

  drawerStyle: {
    backgroundColor: '#000000ea',
    width: '50%'
  },

  drawerActiveTintColor: 'white',
  drawerInactiveTintColor: 'white',

  headerTintColor: '#fff',
  headerTitleAlign: 'center',

};
