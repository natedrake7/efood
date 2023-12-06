import { useNavigation } from '@react-navigation/native';
import React, { useState,useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet,Image, FlatList } from 'react-native';
import { GetProfessionalUsers } from '../store/professional';
import { AuthContext } from '../store/auth-context';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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
            item.profileImage = `http://192.168.1.16:3000/${item.profileImage}`;
            item.backgroundImage = `http://192.168.1.16:3000/${item.backgroundImage}`;
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
          <View>
            <Image source={{ uri: item.backgroundImage }} style={styles.backgroundImage} />
            <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{flexDirection:'column'}}>
                <Text style={styles.nameHeader}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={styles.type}>{item.type}, </Text>
                  <Text style={styles.delivery}>delivery: {item.delivery_time}'</Text>
                </View>
              </View>
              <View style={{flexDirection:'column'}}>
                {item.open_status && <Text style={styles.open}>Open</Text>}
                {!item.open_status && <Text style={styles.closed}>Closed</Text>}
                <View style={{flexDirection:'row',alignItems: 'center',marginTop:10}}>
                  <FontAwesome name="star" size={14} color="#0fb80f"/>
                  <Text style={styles.rating}>{item.rating ? item.rating : 0}</Text>
                </View>
              </View>
          </View>
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
  backgroundImage:{
    width: 350, 
    height: 150, 
    borderRadius: 12,
  },
  profileImage:{
    position: 'absolute',
    left:1,
    marginTop:95,
    width: 50, 
    height: 50, 
    borderRadius: 50,
  },
  itemsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  nameHeader:{
    color:'#ffffff',
    fontWeight: '600',
    fontSize: 17,
    marginBottom:5,
    marginTop:10,
  },
  delivery:{
    color:'#ffffff',
    fontSize: 10,
  },
  type:{
    color:'#a1a0a0',
    fontSize: 12,
  },
  open:{
    color:'#0fb80f',
    marginTop:10,
  },
  closed:{
    color:'red',
    marginTop:10,
  },
  item:{
    color:'#ffffff',
  },
  rating:{
    color:'#0fb80f',
    marginLeft:4,
  }
});