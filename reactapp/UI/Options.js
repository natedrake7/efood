import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native';

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

