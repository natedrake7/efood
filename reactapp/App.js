import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import LoginScreen from './components/User/Auth/LoginScreen';
import RegisterScreen from './components/User/Auth/RegisterScreen';
import HomeScreen from './components/User/Authenticated/HomeScreen';
import AuthContextProvider, { AuthContext } from './store/context/User/auth-context';
import { useContext} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import DetailsScreen from './components/User/Authenticated/Details';
import ProductDetailsScreen from './components/User/Authenticated/ProductDetails';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './components/User/Authenticated/ProfileScreen';
import DrawerScreen from './components/User/Authenticated/DrawerScreen';
import SettingsScreen from './components/User/Authenticated/SettingsScreen';
import LoginProfessionalScreen from './components/Professional/LoginProfessionalScreen';
import RegisterProfessionalScreen from './components/Professional/RegisterProfessionalScreen';
import EditPasswordScreen from './components/User/Authenticated/EditPasswordScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerOptions,loginOptions,TabScreenOptions } from './UI/Options';
import { StatusBar } from 'react-native';
import CartScreen from './components/User/Authenticated/CartScreen';
import DipslayCart from './components/User/Authenticated/CartDropdown';



const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

function Root(){
  return <Navigation/>;
};

export default function App(){

  return(
      <>
        <AuthContextProvider>
          <StatusBar barStyle={'auto'}/>
            <Root/>
        </AuthContextProvider>
      </>
  );
};

function Navigation(){
  const authCtx = useContext(AuthContext);

  if(!authCtx.isFetchingToken)
  {
    SplashScreen.hideAsync();

    return(
      <NavigationContainer theme={Theme}>
        {authCtx.isAuthenticated ? <AuthenticatedStack/> : <AuthStack />}
      </NavigationContainer>
    );
  }
};


function AuthStack(){
  return(
      <Tab.Navigator renderTabBar={renderTabBar} screenOptions={TabScreenOptions}   animation={{
        type: 'timing',
        duration: 300,
      }}>
        <Tab.Screen name="User" component={AuthStackScreens} options={{ headerShown:false}}/>
        <Tab.Screen name="Professional" component={AuthProfessionalStackScreens} options={{ headerShown:false }}/>
      </Tab.Navigator>
  );
};

function AuthStackScreens(){
  return(
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerStyle:{
            backgroundColor: 'black',
            title:'',
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen}  options={loginOptions}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={registerOptions}/>
      </Stack.Group>
    </Stack.Navigator>
  );
};

function AuthProfessionalStackScreens(){
  return(
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerStyle:{
            backgroundColor: 'black',
            title:'',
          },
        }}
      >
        <Stack.Screen name="LoginProfessional" component={LoginProfessionalScreen}  options={loginOptions}/>
        <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} options={registerOptions}/>
      </Stack.Group>
    </Stack.Navigator>
  );
};


const renderTabBar = props => (
  <TabBar
    {...props}
  />
);


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
          <Drawer.Screen name="Home" component={HomeScreen} options={{headerRight: DipslayCart}}/>
          <Drawer.Screen name="Profile" component={ProfileScreen} options={{headerRight: DipslayCart}}/>
          <Drawer.Screen name="Settings" component={SettingsScreen} options={{headerRight: DipslayCart}}/>
        </Drawer.Navigator>
      )}
      </Stack.Screen>
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} options={{headerTitle:'',headerRight: DipslayCart}}/>
      <Stack.Screen name="Details" component={DetailsScreen} options={{headerRight: DipslayCart}}/>
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{headerRight: DipslayCart}}/>
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  )
};

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212'
  },
};

const headerOptions = {
  headerMode: 'float',

  headerStyle: {backgroundColor: '#121212'},

  drawerStyle: {
    backgroundColor: '#121212',
    width: '50%'
  },
  drawerActiveTintColor: 'white',
  drawerInactiveTintColor: 'white',

  headerTintColor: '#fff',
  headerTitleAlign: 'center',

};