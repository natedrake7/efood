import React, { useState,useEffect,useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../../../store/context/User/auth-context';
import { EditPassword } from '../../../store/context/User/auth';

function EditPasswordScreen()
{
    const authCtx = useContext(AuthContext);
    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [successfullMessage,setSuccessfullMessage] = useState('');

    //Errors
    const [oldPasswordError,setOldPasswordError] = useState('');
    const [invalidPasswordError,setInvalidPasswordError] = useState('');
    const [newPasswordError,setNewPasswordError] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setOldPasswordError('');
            setNewPasswordError('');
            setInvalidPasswordError('');
        }, 10000);
    
        return () => clearTimeout(timeoutId);
      }, []);

    const handleUpdate = async() =>{
        const data = new FormData();
        data.append('password',oldPassword);
        data.append('new_password',newPassword);

        try{
            const response = await EditPassword(data,authCtx.accessToken);
           if(response.errors)
           {
                if(!Array.isArray(response.errors))
                    setInvalidPasswordError(response.message);
                else
                {
                    setOldPasswordError(response.errors.find((error) => error.property === 'password'));
                    setNewPasswordError(response.errors.find((error) => error.property === 'new_password'));
                }
           }
           else
            setSuccessfullMessage('Password changed successfully!');

        }catch(error)
        {
            console.log(error);
        }

    }

    return(
        <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={70} // Adjust this value as needed
        enableOnAndroid={true}>
        <Text style={styles.header}>Edit Password</Text>
        <Text style={styles.inputHeaders}>Old Password:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your old password..."
            placeholderTextColor={'#ffff'}
            secureTextEntry
            value={oldPassword}
             onChangeText={(text) => setOldPassword(text)}
        />
        {oldPasswordError &&
            <Text style={styles.error}>{oldPasswordError.message}</Text>
        }
        {invalidPasswordError &&
            <Text style={styles.error}>{invalidPasswordError}</Text>
        }        
        <Text style={styles.inputHeaders}>New Password:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your new password..."
            placeholderTextColor={'#ffff'}
            secureTextEntry
            value={newPassword}
             onChangeText={(text) => setNewPassword(text)}
        />
        {newPasswordError &&
            <Text style={styles.error}>{newPasswordError.message}</Text>
        }
        <Text style={styles.details}>
            Password must be at least 8 characters and at most 20.Password 
            also must contain one special character,one uppercase letter and one number.
        </Text>
        <View style={styles.buttonsContainer}>
            <View style = {styles.buttons}>
                <Button title="Submit" onPress={handleUpdate} />
            </View>
        </View>
        {successfullMessage &&
            <Text style={styles.successMessage}>{successfullMessage}</Text>
        }             
        </KeyboardAwareScrollView>
    )

}export default EditPasswordScreen;


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
      marginTop: 20,
      marginRight: 20,
      marginLeft: 20,
    },
    details:{
        color:'gray',
        fontSize:11,
        paddingLeft:10,
    },
    successMessage:{
        color:'green',
        fontSize:15,
        marginTop: 12,
    },
    error:{
      flexDirection:'row',
      color:'red',
      marginBottom: 10,
      fontSize: 18,
    }
  });