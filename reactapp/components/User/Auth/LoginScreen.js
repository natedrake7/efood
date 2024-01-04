import React, { useState,useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image,Dimensions,KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogIn } from '../../../store/context/User/auth';
import { AuthContext } from '../../../store/context/User/auth-context';

function LoginScreen(){
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] =  useState('');
  const [passwordError, setPasswordError] =  useState('');
  const [error,setError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordError('');
      setUsernameError('');
      setError('');
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleLogin = async() => {

    const data = new FormData();
    data.append('username', username);
    data.append('password', password);

    try{
      const response =  await LogIn(data);
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
      }
      else
      {
        setError(response);
        console.log(error);
      }
    }
    catch(error){
      throw new Error(error);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };
    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <Image style={styles.imageContainer} source={require('../../../images/login-image.png')}/>
          <View style={styles.credentialsContainer}>
            <Text style={styles.header}>Login</Text>
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
            {
              error &&
              <Text style={styles.error}>{error}</Text>
            }
              <View style={styles.buttonsContainer}>
                  <View style = {styles.buttons}>
                      <Button title="Login" onPress={handleLogin} />
                  </View>
                  <View style = {styles.buttons}>
                      <Button title="Register" onPress={handleNavigateToRegister} />
                  </View>
              </View>
            </View>
        </KeyboardAvoidingView>
    );
};
export default LoginScreen;

const { width, height } = Dimensions.get('window');
 
const containerSize = Math.min(width, height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer:{
    flex: 2,
    resizeMode: 'contain',
    width: containerSize,
    height: containerSize,
    marginBottom: 20
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
