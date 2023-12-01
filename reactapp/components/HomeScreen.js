import { useNavigation } from '@react-navigation/native';
import React, { useState,useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image,Dimensions,KeyboardAvoidingView, FlatList } from 'react-native';
import { GetProfessionalUsers } from '../store/professional';
import { AuthContext } from '../store/auth-context';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync();

function HomeScreen() {
  [isPageReady,setIsPageReady] = useState(false);
  [professionalUsers,setProfessionalUsers] = useState([]);
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function GetProfessionals(){
      try{
        const response = await GetProfessionalUsers(authCtx.accessToken);
        setProfessionalUsers(response);
      }
      catch(error)
      {
        throw new Error(error);
      }
      setIsPageReady(true);
    }
    GetProfessionals();
  });

  if(isPageReady)
  {
    SplashScreen.preventAutoHideAsync();
    return (
      <FlatList
        data={professionalUsers}
        renderItem={RenderProfessional}
        keyExtractor={(item) => item.id}
      >
      </FlatList>
    );
  }

};
export default HomeScreen;

const RenderProfessional = ({item}) =>{
  <View>
    <Text style={styles.items}>{item.address},{item.city}</Text>
  </View>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  items:{
    color:'red',
  }
});
