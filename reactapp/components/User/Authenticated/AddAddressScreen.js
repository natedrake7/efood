import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../../../store/context/User/auth-context";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet,Text,View,TouchableOpacity,TextInput,ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CreateAddress } from "../../../store/context/User/auth";

function AddAddressScreen(){
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation();
    const [address,setAddress] = useState('');
    const [addressNumber,setAddressNumber] = useState('');
    const [zipcode,setZipcode] = useState('');
    const [city,setCity] = useState('');
    const [phonenumber,setPhonenumber] = useState('');
    const [ringbellName,setRingbellName] = useState('');
    const [floor,setFloor] = useState('');

    const [addressError,setAddressError] = useState('');
    const [addressNumberError,setAddressNumberError] = useState('');
    const [zipcodeError,setZipcodeError] = useState('');
    const [cityError,setCityError] = useState('');
    const [phonumberError,setPhonenumberError] = useState('');
    const [ringbellNameError,setRingbellNameError] = useState('');
    const [floorError,setFloorError] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setAddressError('');
          setAddressNumberError('');
          setZipcodeError('');
          setCityError('');
          setPhonenumberError('');
          setRingbellNameError('');
          setFloorError('');
        }, 10000);
    
        return () => clearTimeout(timeoutId);
      }, []);

      const handleSubmitAddress = async() =>{
        try{
            const response = await CreateAddress(createFormData(),authCtx.accessToken);
            if(Array.isArray(response.errors))
            {
                setAddressError(response.errors.find(error => error.property === 'address'));
                setAddressNumberError(response.errors.find(error => error.property === 'number'));
                setZipcodeError(response.errors.find(error => error.property === 'zipcode'));
                setRingbellNameError(response.errors.find(error => error.property === 'ringbell'));
                setCityError(response.errors.find(error => error.property === 'city'));
                setFloorError(response.errors.find(error => error.property === 'floor'));
                setPhonenumberError(response.errors.find(error => error.property === 'phonenumber'));
            }
            else
                navigation.navigate('Addresses',{success:true});
        }
        catch(error)
        {
            console.log(error);
        }
      }

      const createFormData = () =>{
        data = new FormData();
        data.append('address',address);
        data.append('number',addressNumber);
        data.append('city',city);
        data.append('zipcode',zipcode);
        data.append('floor',floor);
        data.append('ringbell',ringbellName);
        data.append('phonenumber',phonenumber);

        return data;
      }

      const LoadingScreen = () =>{
        return(
         <ActivityIndicator size="large" color="white" />
        );
      }

    return(
    <KeyboardAwareScrollView
        extraScrollHeight={200} // Adjust this value as needed
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollsToTop={() => LoadingScreen()}>
        <Text style={styles.header}>My Address</Text>
        <Text style={styles.inputHeaders}>Address:</Text>
        <TextInput
            style={styles.input}
            placeholder='Please enter your address name...'
            placeholderTextColor={'#ffff'}
            value={address}
            onChangeText={(text) => setAddress(text)}
        />
    {addressError &&
        <Text style={styles.error}>{addressError.message}</Text>  
    }
    <Text style={styles.inputHeaders}>Address Number:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter your address number (e.g. 3-5 or 3)...'
        placeholderTextColor={'#ffff'}
        value={addressNumber}
        onChangeText={(text) => setAddressNumber(text)}
    />
    {addressNumberError &&
        <Text style={styles.error}>{addressNumberError.message}</Text>  
    }
    <Text style={styles.inputHeaders}>City:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter your residing city...'
        placeholderTextColor={'#ffff'}
        value={city}
        onChangeText={(text) => setCity(text)}
    />
    {cityError &&
        <Text style={styles.error}>{cityError.message}</Text>  
    }     
    <Text style={styles.inputHeaders}>Zipcode:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter your zipcode...'
        placeholderTextColor={'#ffff'}
        value={zipcode}
        onChangeText={(text) => setZipcode(text)}
    />
    {zipcodeError &&
        <Text style={styles.error}>{zipcodeError.message}</Text>  
    }     
    <Text style={styles.inputHeaders}>Ringbell Name:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter the name of your ringbell...'
        placeholderTextColor={'#ffff'}
        value={ringbellName}
        onChangeText={(text) => setRingbellName(text)}
    />
    {ringbellNameError &&
        <Text style={styles.error}>{ringbellNameError .message}</Text>  
    }
    <Text style={styles.inputHeaders}>Floor:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter your floor...'
        placeholderTextColor={'#ffff'}
        value={floor}
        onChangeText={(text) => setFloor(text)}
        keyboardType="numeric"
    />
    {floorError &&
        <Text style={styles.error}>{floorError .message}</Text>  
    }  
    <Text style={styles.inputHeaders}>Phonenumber:</Text>
    <TextInput
        style={styles.input}
        placeholder='Please enter a phonenumber for the address...'
        placeholderTextColor={'#ffff'}
        value={phonenumber}
        onChangeText={(text) => setPhonenumber(text)}
    />
    {phonumberError&&
        <Text style={styles.error}>{phonumberError.message}</Text>  
    }
    <View style={styles.ButtonsContainer}>
        <TouchableOpacity style={styles.AddAddressButton} onPress={() => handleSubmitAddress()}>
            <Text style={styles.AddAddressText}>Add Address</Text>
        </TouchableOpacity>  
    </View>      
    </KeyboardAwareScrollView>
    )

}export default AddAddressScreen;

const styles = StyleSheet.create({
    credentialsContainer:{
      flex: 3,
      padding: 10
    },
    inputHeaders:{
      marginBottom: 10,
      fontSize: 15,
      color:'#ffff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#ffff',
    },
    input: {
      height: 50,
      marginBottom: 16,
      paddingHorizontal: 10,
      width: 400,
      borderRadius: 10,
      color: '#ffff',
      backgroundColor: '#353535c5',
      alignSelf:'center',
      fontSize: 16,
    },
    ButtonsContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    AddAddressButton:{
        borderRadius: 10,
        marginTop: 12,
        marginBottom: 20,
    },
    AddAddressText:{
        color: 'green',
        fontSize: 16,
    },
    error:{
      flexDirection:'row',
      color:'red',
      marginBottom: 10,
      fontSize: 18,
    },
  });