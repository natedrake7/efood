import React, { useState,useEffect,useContext, useTransition } from 'react';
import { View, Text, TextInput, Button, StyleSheet,ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Register } from '../../store/context/User/auth';
import { AuthContext } from '../../store/context/User/auth-context';
import Timetable from './TimetableProp';


function RegisterProfessionalScreen()
{
    const authCtx = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [name,setName] = useState('');
    const [address,setAddress] = useState('');
    const [deliveryTime,setDeliveryTime] = useState('');
    const [type,setType] = useState('');
    const [city,setCity] = useState('');
    const [zipcode,setZipcode] = useState('');
    const [timetable,setTimetable] = useState('');
    const [email,setEmail] = useState('');
    const [phonenumber,setPhonunumber] = useState(''); 
    const [description,setDescription] = useState('');

    //Errors
    const [usernameError, setUsernameError] =  useState('');
    const [passwordError, setPasswordError] =  useState('');
    const [confirmPasswordError,setConfirmPasswordError] = useState('');
    const [nameError,setNameError] = useState('');
    const [addressError,setAddressError] = useState('');
    const [deliveryError,setDeliveryError] = useState('');
    const [typeError,setTypeError] = useState('');
    const [cityError,setCityError] = useState('');
    const [zipcodeError,setZipcodeError] = useState('');
    const [emailError,setEmailError] = useState('');
    const [phonenumberError,setPhonenumberError] = useState('');
    const [descriptionError,setDescriptionError] = useState('');
  
    const [error,setError] = useState('');
  
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setPasswordError('');
        setUsernameError('');
        setNameError('');
        setAddressError('');
        setDeliveryError('');
        setCityError('');
        setZipcodeError('');
        setTypeError('');
        setTimetableError('');
        setPhonenumberError('');
        setEmailError('');
        setConfirmPasswordError('');
        setDescriptionError('');
        setError('');
      }, 10000);
  
      return () => clearTimeout(timeoutId);
    }, []);
  
    const handleRegister = async() =>{
      setTimetable(openingHours + "-" + closingHours);
      const data = new FormData();
      data.append('username',username);
      data.append('password',password);
      data.append('confirm_password',confirmPassword);
      data.append('name',name);
      data.append('address',address);
      data.append('delivery_time',deliveryTime);
      data.append('type',type);
      data.append('city',city);
      data.append('zipcode',zipcode)
      data.append('timetable',timetable);
      data.append('email',email);
      data.append('phonenumber',phonenumber);
      data.append('description',description);
      try{
        const response =  await Register(data);
        if(response.accesstoken || response.refreshtoken)
        {
          authCtx.postAccessToken(response.accesstoken);
          authCtx.postRefreshToken(response.refreshtoken);
          await authCtx.storeRefreshToken(response.refreshtoken);
        }
        else if(Array.isArray(response))
        {
          //else response is an array of errors
          setUsernameError(response.find((error) => error.property === 'username'));
          setPasswordError(response.find((error) => error.property === 'password'));
          setNameError(response.find((error) => error.property === 'name'));
          setAddressError(response.find((error) => error.property === 'address'));
          setDeliveryError(response.find((error) => error.property === 'delivery_time'));
          setTypeError(response.find((error) => error.property === 'type'));
          setCityError(response.find((error) => error.property === 'city'));
          setZipcodeError(response.find((error) => error.property === 'zipcode'));
          setTimetableError(response.find((error) => error.property === 'timetable'));
          setDescriptionError(response.find((error) => error.property === 'description'));
          setPhonenumberError(response.find((error) => error.property === 'phonenumber'));
          setEmailError(response.find((error) => error.property === 'email'));
          setConfirmPasswordError(response.find((error) => error.property === 'confirm_password'));
        }
        else
          setError(response);
      }
      catch(error){
        throw new Error(error);
      }
    }

    const handleTimetableUpdate = (timetableData) => {
        setTimetable(timetableData);
    }
  
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAwareScrollView
              contentContainerStyle={styles.container}
              extraScrollHeight={100} // Adjust this value as needed
              enableOnAndroid={true}
            >
            <View style={styles.credentialsContainer}>
              <Text style={styles.header}>Register</Text>
              <Text style={styles.inputHeaders}>Username:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username..."
                placeholderTextColor={'#ffff'}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              {usernameError &&
                <Text style={styles.error}>{usernameError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Password:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password..."
                placeholderTextColor={'#ffff'}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {passwordError &&
                <Text style={styles.error}>{passwordError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Confirm Password:</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password..."
                placeholderTextColor={'#ffff'}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              {confirmPasswordError &&
                <Text style={styles.error}>{confirmPasswordError.message}</Text>
              } 
              <Text style={styles.inputHeaders}>Shop Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Shop's name..."
                placeholderTextColor={'#ffff'}
                value={name}
                onChangeText={(text) => setName(text)}
              />
              {nameError &&
                <Text style={styles.error}>{nameError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Shop Type:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your shop's type (Burger,Pizza etc)..."
                placeholderTextColor={'#ffff'}
                value={type}
                onChangeText={(text) => setType(text)}
              />
              {typeError &&
                <Text style={styles.error}>{typeError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Delivery Time:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your shop's estimated delivery time..."
                placeholderTextColor={'#ffff'}
                value={deliveryTime}
                onChangeText={(text) => setDeliveryTime(text)}
              />
              {deliveryError &&
                <Text style={styles.error}>{deliveryError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Timetable:</Text>
              <Timetable onTimetableUpdate={handleTimetableUpdate}/>     
              <Text style={styles.inputHeaders}>Address:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your shop's address..."
                placeholderTextColor={'#ffff'}
                value={address}
                onChangeText={(text) => setAddress(text)}
              />
              {addressError &&
                <Text style={styles.error}>{addressError.message}</Text>
              }             
              <Text style={styles.inputHeaders}>City:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your shop's city..."
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
                placeholder="Enter your shop's zipcode..."
                placeholderTextColor={'#ffff'}
                value={zipcode}
                onChangeText={(text) => setZipcode(text)}
              />
              {zipcodeError &&
                <Text style={styles.error}>{zipcodeError.message}</Text>
              } 
              <Text style={styles.inputHeaders}>City:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your shop's city..."
                placeholderTextColor={'#ffff'}
                value={city}
                onChangeText={(text) => setCity(text)}
              />
              {cityError &&
                <Text style={styles.error}>{cityError.message}</Text>
              }                           
              <Text style={styles.inputHeaders}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Email..."
                placeholderTextColor={'#ffff'}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              {emailError &&
                <Text style={styles.error}>{emailError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Phonenumber:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Phonenumber..."
                placeholderTextColor={'#ffff'}
                value={phonenumber}
                onChangeText={(text) => setPhonunumber(text)}
              />
              {phonenumberError &&
                <Text style={styles.error}>{phonenumberError.message}</Text>
              }
              <Text style={styles.inputHeaders}>Description:</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe your shop..."
                placeholderTextColor={'#ffff'}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
              {descriptionError &&
                <Text style={styles.error}>{descriptionError.message}</Text>
              }            
              <View style={styles.buttonsContainer}>
              <View style = {styles.buttons}>
                  <Button title="Register" onPress={handleRegister} />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          </ScrollView>
      );

}export default RegisterProfessionalScreen;


const styles = StyleSheet.create({
    container: {
      flexGrow:1,
      flex: 1,
      justifyContent: 'center',
    },
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
      height: 40,
      borderColor: '#ffff',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 10,
      borderRadius: 10,
      color: '#ffff',
    },  
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttons:{
      borderRadius: 10,
      marginTop: 12,
      marginRight: 20,
      marginLeft: 20,
    },
    error:{
      flexDirection:'row',
      color:'red',
      marginBottom: 10,
      fontSize: 18,
    },
  });