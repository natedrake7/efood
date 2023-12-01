import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image,Dimensions,KeyboardAvoidingView } from 'react-native';

const HomeScreen = ({ navigation }) => {

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <Text>Hello!</Text>
    </KeyboardAvoidingView>
  );
};
export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
});
