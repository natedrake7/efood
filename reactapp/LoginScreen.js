import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { axios } from 'axios'

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {
    const data = new FormData();
    data.append('username',username);
    data.append('password',password);
    try{
        const response = await fetch('http://192.168.1.16:3000/user/signin',{method:'POST'});
        const result = await response.json();
        console.log(result.errors);
        console.log(result.message);
    }
    catch(error)
    {
        console.log(error);
    }
   // navigation.navigate('Home');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username..."
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password..."
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
        <View style={styles.buttonsContainer}>
            <View style = {styles.buttons}>
                <Button title="Login" onPress={handleLogin} />
            </View>
            <View style = {styles.buttons}>
                <Button title="Register" onPress={handleNavigateToRegister} />
            </View>
        </View>
        <View style={styles.buttons}>
            <View style = {styles.buttons}>
                <Button title="Want to be a professional?" onPress={handleNavigateToRegister} />
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
  },  
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttons:{
    borderRadius: 10,
    marginTop: 12,
  },
});

export default LoginScreen;
