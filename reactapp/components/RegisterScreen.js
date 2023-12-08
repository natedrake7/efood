import React, { useState,useEffect,useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet,ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Register } from '../store/auth';
import { AuthContext } from '../store/auth-context';


const RegisterScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [firstname,setFirstname] = useState('');
  const [lastname,setLastname] = useState('');
  const [email,setEmail] = useState('');
  const [phonenumber,setPhonunumber] = useState('');
  const [usernameError, setUsernameError] =  useState('');
  const [passwordError, setPasswordError] =  useState('');
  const [confirmPasswordError,setConfirmPasswordError] = useState('');
  const [firstnameError,setFirstnameError] = useState('');
  const [lastnameError,setLastnameError] = useState('');
  const [emailError,setEmailError] = useState('');
  const [phonenumberError,setPhonenumberError] = useState('');

  const [error,setError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordError('');
      setUsernameError('');
      setFirstnameError('');
      setLastnameError('');
      setPhonenumberError('');
      setEmailError('');
      setConfirmPasswordError('');
      setError('');
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleRegister = async() =>{
    const data = new FormData();
    data.append('username',username);
    data.append('password',password);
    data.append('confirm_password',confirmPassword);
    data.append('firstname',firstname);
    data.append('lastname',lastname);
    data.append('email',email);
    data.append('phonenumber',phonenumber);
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
        setFirstnameError(response.find((error) => error.property === 'firstname'));
        setLastnameError(response.find((error) => error.property === 'lastname'));
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
            <Text style={styles.inputHeaders}>First Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your First Name..."
              placeholderTextColor={'#ffff'}
              value={firstname}
              onChangeText={(text) => setFirstname(text)}
            />
            {firstnameError &&
              <Text style={styles.error}>{firstnameError.message}</Text>
            }
              <Text style={styles.inputHeaders}>Last Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Last Name..."
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
            <View style={styles.buttonsContainer}>
            <View style = {styles.buttons}>
                <Button title="Register" onPress={handleRegister} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        </ScrollView>
    );
};
 

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
  }
});

export default RegisterScreen;