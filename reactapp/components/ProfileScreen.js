import React, { useState,useEffect,useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../store/auth-context';


function ProfileScreen(){
    const authCtx = useContext(AuthContext);
    const navigator = useNavigation();
    const user = authCtx.getUserInfo();

    const [username, setUsername] = useState('');
    const [firstname,setFirstname] = useState('');
    const [lastname,setLastname] = useState('');
    const [email,setEmail] = useState('');
    const [phonenumber,setPhonenumber] = useState('');
    const [usernameError, setUsernameError] =  useState('');
    const [firstnameError,setFirstnameError] = useState('');
    const [lastnameError,setLastnameError] = useState('');
    const [emailError,setEmailError] = useState('');
    const [phonenumberError,setPhonenumberError] = useState('');
  
    const [error,setError] = useState('');
  
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setUsernameError('');
        setFirstnameError('');
        setLastnameError('');
        setPhonenumberError('');
        setEmailError('');
        setError('');
      }, 10000);
  
      return () => clearTimeout(timeoutId);
    }, []);

    const handleUpdate  = () =>{

    }

    const handlePasswordEdit = () =>{
        navigator.navigate('EditPassword');
    }

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            extraScrollHeight={100} // Adjust this value as needed
            enableOnAndroid={true}>
        <Text style={styles.header}>My Account</Text>
        <Text style={styles.inputHeaders}>Username:</Text>
        <TextInput
            style={styles.input}
            placeholder={user.username}
            placeholderTextColor={'#ffff'}
            value={username}
            onChangeText={(text) => setUsername(text)}
        />
        {usernameError &&
            <Text style={styles.error}>{usernameError.message}</Text>  
        }
        <Text style={styles.inputHeaders}>Firstname:</Text>
        <TextInput
            style={styles.input}
            placeholder={user.firstname}
            placeholderTextColor={'#ffff'}
            value={firstname}
            onChangeText={(text) => setFirstname(text)}
        />
        {firstnameError &&
            <Text style={styles.error}>{firstnameError.message}</Text>  
        }        
        <Text style={styles.inputHeaders}>Lastname:</Text>
        <TextInput
            style={styles.input}
            placeholder={user.lastname}
            placeholderTextColor={'#ffff'}
            value={lastname}
            onChangeText={(text) => setLastname(text)}
        />
        {lastnameError &&
            <Text style={styles.error}>{lastnameError.message}</Text>  
        }
        <Text style={styles.inputHeaders}>Email:</Text>
        <TextInput
            style={styles.input}
            placeholder={user.email}
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
            placeholder={user.phonenumber}
            placeholderTextColor={'#ffff'}
            value={phonenumber}
            onChangeText={(text) => setPhonenumber(text)}
        />
        {phonenumberError &&
            <Text style={styles.error}>{phonenumberError.message}</Text>  
        }
        <TouchableOpacity style={styles.passwordButton} onPress={handlePasswordEdit}>
            <Text style={styles.passwordText}>Change Password</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
            <View style = {styles.buttons}>
                <Button title="Submit" onPress={handleUpdate} />
            </View>
        </View>                 
        </KeyboardAwareScrollView>
    )
}
export default ProfileScreen;


const styles = StyleSheet.create({
    container: {
      flexGrow:1,
      flex: 1,
      marginTop: 20,
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
      height: 50,
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 10,
      width: 400,
      borderRadius: 10,
      color: '#ffff',
      backgroundColor: '#353535c5',
      alignSelf:'center',
      fontSize: 16,
    },  
    buttonsContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttons:{
      width:150,
      borderRadius: 10,
      marginTop: 12,
      marginRight: 20,
      marginLeft: 20,
    },
    passwordButton:{
        width:150,
        borderRadius: 10,
        marginTop: 10,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 20,
    },
    passwordText:{
        color: 'green',
        fontSize: 16,
        
    },
    error:{
      flexDirection:'row',
      color:'red',
      marginBottom: 10,
      fontSize: 18,
    }
  });
  