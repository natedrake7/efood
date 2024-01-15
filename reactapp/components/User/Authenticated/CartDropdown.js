import React from 'react';
import { View, TouchableOpacity,StyleSheet,Modal,TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartIcon = ({ onPress }) => {

    const navigator = useNavigation();

    const handlePress = () => {
      navigator.navigate('Cart');
    };
    return (
      <View>
        <TouchableOpacity onPress={handlePress} style={{marginRight:12}}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
};

const DipslayCart = () =>{
    return(
      <CartIcon onPress={() => {}} />
    )
};export default DipslayCart;


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        width:120,
        height: 90,
        padding:16,
        borderRadius:8,

        backgroundColor:'#121212',
    },
    buttonsContainer:{
        marginTop: 20,
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    text:{
        color:'white',
        fontSize: 18, 
        marginBottom: 16
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
      dropdownContainer: {
        position: 'absolute',
        
        top: 60, // Adjust the top value as needed
        right: -1, // Adjust the right value as needed
        padding: 10,
    
        borderRadius: 5,
        elevation: 5, // For Android elevation
      },
});