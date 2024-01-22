import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../../../store/context/User/auth-context";
import { useNavigation,useRoute } from "@react-navigation/native";
import { StyleSheet,Text,View,TouchableOpacity,TextInput,ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CreateAddress, EditAddress, GetAddressById } from "../../../store/context/User/auth";

function AddressDetailsScreen(){
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [addressObject,setAddressObject] = useState();
    const [isPageReady,setIsPageReady] = useState(false);

    //Edit objs
    const [address,setAddress] = useState('');
    const [addressNumber,setAddressNumber] = useState('');
    const [zipcode,setZipcode] = useState('');
    const [city,setCity] = useState('');
    const [phonenumber,setPhonenumber] = useState('');
    const [ringbellName,setRingbellName] = useState('');
    const [floor,setFloor] = useState('');


    //Error objs
    const [addressError,setAddressError] = useState('');
    const [addressNumberError,setAddressNumberError] = useState('');
    const [zipcodeError,setZipcodeError] = useState('');
    const [cityError,setCityError] = useState('');
    const [phonumberError,setPhonenumberError] = useState('');
    const [ringbellNameError,setRingbellNameError] = useState('');
    const [floorError,setFloorError] = useState('');

    //Null Input error
    const [error,setError] = useState('');
    
    useEffect(() => {
        const getAddressById = async() =>{
            const { id } = route.params;
            const response = await GetAddressById(authCtx.accessToken,id);
            setAddressObject(response);
            setIsPageReady(true);
        }

        const timeoutId = setTimeout(() => {
          setAddressError('');
          setAddressNumberError('');
          setZipcodeError('');
          setCityError('');
          setPhonenumberError('');
          setRingbellNameError('');
          setFloorError('');
          setError('');
        }, 10000);

        getAddressById();
    
        return () => clearTimeout(timeoutId);
      }, []);

      const handleEditAddress = async() =>{
        const errorMessage = ValidateInput();
        if(errorMessage)
            setError(errorMessage);
        else
        {
            try{
                const response = await EditAddress(authCtx.accessToken,createFormData(),addressObject.id);
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

      }

      const createFormData = () =>{
        data = new FormData();
        if(address)
            data.append('address',address);
        if(addressNumber)
            data.append('number',addressNumber);
        if(city)
            data.append('city',city);
        if(zipcode)
            data.append('zipcode',zipcode);
        if(floor)
            data.append('floor',floor);
        if(ringbellName)
            data.append('ringbell',ringbellName);
        if(phonenumber)
            data.append('phonenumber',phonenumber);

        return data;
      }

    const ValidateInput = () =>{
        if(address || addressNumber || city || zipcode || floor || ringbellName || phonenumber)
            return '';
        return 'You must edit a value before submitting!';
    }

      const LoadingScreen = () =>{
        return(
         <ActivityIndicator size="large" color="white" />
        );
      }

    if(!isPageReady)
      return(
          <LoadingScreen/>
      )

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
            placeholder={addressObject.address}
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
        placeholder={String(addressObject.number)}
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
        placeholder={addressObject.city}
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
        placeholder={addressObject.zipcode}
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
        placeholder={addressObject.ringbell}
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
        placeholder={String(addressObject.floor)}
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
        placeholder={addressObject.phonenumber}
        placeholderTextColor={'#ffff'}
        value={phonenumber}
        onChangeText={(text) => setPhonenumber(text)}
    />
    {phonumberError&&
        <Text style={styles.error}>{phonumberError.message}</Text>  
    }
    {
        error &&
            <Text style={styles.error}>{error}</Text>  
    }
    <View style={styles.ButtonsContainer}>
        <TouchableOpacity style={styles.AddAddressButton} onPress={() => handleEditAddress()}>
            <Text style={styles.AddAddressText}>Submit</Text>
        </TouchableOpacity>  
    </View>      
    </KeyboardAwareScrollView>
    )

}export default AddressDetailsScreen;

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