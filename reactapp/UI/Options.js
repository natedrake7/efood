import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, TouchableOpacity,Text} from 'react-native';
import DipslayCart from '../components/User/Authenticated/CartDropdown';

export const registerOptions = ({ navigation,route }) =>({
    headerLeft: () => (
      <Button onPress={() => navigation.goBack()} title="Back" />
    ),
    title: null,
    headerStyle:{
      backgroundColor:'#4d4d4d'
    }
});
  
export const loginOptions = () =>({
    headerRight: () => null,
    title: null,
});

export const ProductOptions = ({ navigation,route }) =>({
  headerRight: () => DipslayCart(),
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" color='white' size={26}/>
      </TouchableOpacity>
  ),
  title: 'Product',
  headerStyle:{
    backgroundColor:'#121212',
  }
});


export const TabScreenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
  
      if (route.name === 'User') {
        iconName = focused
          ? 'person-circle-outline'
          : 'person-circle-outline';
      } else if (route.name === 'Professional') {
        iconName = focused ? 'business-outline' : 'business-outline';
      }
  
      // You can return any component that you like here!
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'white',
    tabBarActiveBackgroundColor: 'black',
    tabBarInactiveBackgroundColor: 'black',
    tabBarShowLabel: true,
});

