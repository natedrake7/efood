import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import DetailsScreen from './components/Details';
import ProductDetailsScreen from './components/ProductDetails';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './components/ProfileScreen';
import DrawerScreen from './components/DrawerScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerOptions,loginOptions,TabScreenOptions } from './UI/Options';


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
      <Tab.Navigator renderTabBar={renderTabBar} screenOptions={TabScreenOptions}   animation={{
        type: 'timing',
        duration: 300,
      }}>
        <Tab.Screen name="User" component={AuthStackScreens} options={{ headerShown:false}}/>
        <Tab.Screen name="Professional" component={AuthStackScreens} options={{ headerShown:false }}/>
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
