import { useNavigation } from '@react-navigation/native';
import React, { useState,useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet,Image, FlatList } from 'react-native';
import { GetProfessionalUsers } from '../store/professional';
import { AuthContext } from '../store/auth-context';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native';

SplashScreen.preventAutoHideAsync();

function HomeScreen() {
  const [isPageReady,setIsPageReady] = useState(false);
  const [professionalUsers,setProfessionalUsers] = useState([]);
  const [searchValue,setSearchValue] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function GetProfessionals(){

      setCurrentTime(new Date().toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

      try{
        const response = await GetProfessionalUsers(authCtx.accessToken);
        response.forEach(item => {
          const timetable = item.timetable.split('-');
          (timetable[0] < currentTime && timetable[1] > currentTime) ? item.open_status = true : item.open_status = false;
            item.image = `http://192.168.1.16:3000/${item.image}`;
        });

        setProfessionalUsers(response);
      }
      catch(error)
      {
        throw new Error(error);
      }
      setIsPageReady(true);
    }
    GetProfessionals();
  }, [authCtx.accessToken]);

  const HandleSearch = (searchValue) =>{
    setSearchValue(searchValue);
  }

  const RenderSearchBar = () =>{
    return(
      <TextInput
        style={styles.input}
        placeholder="Search..."
        clearButtonMode='always'
        autoCorrect={false}
        value={searchValue}
        onChangeText={HandleSearch}
      />
    );
  }

  const handlePress = (id) => {
      navigation.navigate('Details',{id: id});
  }
  
  const RenderProfessional = ({item}) =>{
    return(
      <TouchableOpacity onPress={() => handlePress(item.id)}>
        <View style={styles.itemsContainer}>
          <Image source={{ uri: item.image }} style={{ width: 300, height: 150, borderRadius: 12 }} />
          <Text style={styles.items}>{item.name},{item.city},{item.zipcode}</Text>
          <Text style={styles.items}>{item.phonenumber},Open: {item.timetable}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  const LoadingScreen = () =>{
    return(
     <ActivityIndicator size="large" color="white" />
    );
  }

  if(isPageReady)
  {
    SplashScreen.hideAsync();
    return (
      <SafeAreaView style={styles.container}>
        {professionalUsers &&
          <FlatList
            ListHeaderComponent={RenderSearchBar()}
            data={professionalUsers}
            renderItem={RenderProfessional}
            keyExtractor={(item) => item.id}
            onScrollToTop={LoadingScreen}
            showsVerticalScrollIndicator={false}
          >
          </FlatList>
        }
      </SafeAreaView >
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );

};
export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 65,
    backgroundColor: '#353535c5',

    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10,

    color: 'white',
    fontSize: 18
  }, 
  image:{
    width: 300, 
    height: 150, 
    borderRadius: 12,
  },
  itemsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828ea', // Use a single background color
    
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  
    elevation: 5,

    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  items:{
    color:'#ffffff',
  }
});