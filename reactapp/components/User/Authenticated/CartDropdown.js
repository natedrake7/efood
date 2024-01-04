import React,{ useState} from 'react';
import { View, Text, TouchableOpacity,StyleSheet,Modal,TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartIcon = ({ onPress }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const navigator = useNavigation();

    const handlePress = () => {
      setIsDropdownVisible(!isDropdownVisible);
      onPress(); 
    };

    const HandleCheckout = () =>{
        setIsDropdownVisible(false);
        navigator.navigate('Cart');
    }

    return (
      <View>
        <TouchableOpacity onPress={handlePress} style={{marginRight:12}}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
  
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <View style={styles.dropdownContainer}>
            <View style={styles.container}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => console.log('spera')}>
                        <Text style={styles.text}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={HandleCheckout}>
                        <Text style={styles.text}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>
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
        width:300,
        height: 140,
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