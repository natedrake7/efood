import React, { useContext } from 'react';
import { View, TouchableOpacity,StyleSheet,Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../store/context/User/auth-context';

const CartIcon = ({ onPress }) => {

    const authCtx = useContext(AuthContext);
    const navigator = useNavigation();

    const handlePress = () => {
      navigator.navigate('Cart');
    };

    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={handlePress} style={{marginRight:12,position: 'relative'}}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          {
              authCtx.cart.length > 0 &&
              <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2 }}>
              <Text style={{color: 'black', fontSize: 8}}>{authCtx.cartLength}</Text>
            </View>
          }
        </TouchableOpacity>
      </View>
    );
};

const DipslayCart = () =>{
    return(
      <CartIcon onPress={() => {}} />
    )
};export default DipslayCart;
