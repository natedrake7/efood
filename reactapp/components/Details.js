import { useNavigation,useRoute } from '@react-navigation/native';
import React, { useState,useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet,Image, FlatList } from 'react-native';
import { GetProfessionalUserById, GetProfessionalUsers } from '../store/professional';
import { AuthContext } from '../store/auth-context';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

function DetailsScreen() {
  const [isPageReady,setIsPageReady] = useState(false);
  const [searchValue,setSearchValue] = useState('');
  const [professionalUser,setProfessionalUser] = useState(Object);
  const navigation = useNavigation();
  const route = useRoute();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const { id } = route.params;

    async function GetProfessionalUser(){
      try{
        const response = await GetProfessionalUserById(authCtx.accessToken,id);
        response.image = `http://192.168.1.16:3000/${response.image}`
        response.products.forEach(item => {
            item.image = `http://192.168.1.16:3000/${item.image}`;
            });

        setProfessionalUser(response);
      }
      catch(error)
      {
        throw new Error(error);
      }

      setIsPageReady(true);
    }

    GetProfessionalUser();
  }, [authCtx.accessToken, route.params]);

  const HandleSearch = (searchValue) =>{
    setSearchValue(searchValue);
  }

  const RenderHeader = () =>{
    return(
        <>
        <View style={styles.headerContainer}>
            <Text style={styles.textHeader}>{professionalUser.name}</Text>
            <Image source={{ uri: professionalUser.image }} style={styles.profileimageContainer} />
        </View>
        <View style={styles.deliveryRatingContainer}>
            <Text style={styles.textdeliveryRating}>Delivery: {professionalUser.delivery_time}'</Text>
            <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="#0fb80f" />
                <Text style={styles.textdeliveryRating}>{10}</Text>
            </View>
        </View>
        <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor='#ffff'
            clearButtonMode='always'
            autoCorrect={false}
            value={searchValue}
            onChangeText={HandleSearch}
        />
        <Text style={styles.popularHeader}>Most Popular</Text>
        <View
            style={styles.whiteLine}
        />
    </>
    );
  }

  const handleAddToCart = (id) =>{
    
  }

  const handlePress = (id) => {
    navigation.navigate('ProductDetails',{id: id})
  }
  
  const RenderProduct = ({item}) =>{
    return(
      <TouchableOpacity onPress={() => handlePress(item.id)}>
        <View style={styles.itemsContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.items}>{item.name}</Text>
                <Text style={styles.price}>{item.price}€</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.imageContainer} />
            <TouchableOpacity style={styles.AddToCartButton} onPress={() => handleAddToCart(item.id)}>
                <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  if(isPageReady)
  {
    SplashScreen.hideAsync();
    return(
        <SafeAreaView style={styles.container}>
        {professionalUser &&
        <>
            <FlatList
                ListHeaderComponent={RenderHeader()}
                data={professionalUser.products}
                renderItem={RenderProduct}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            >
            </FlatList>
          </>
        }
      </SafeAreaView >
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );

};
export default DetailsScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 10,
    },
    headerContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft:12,
        paddingRight:12,
    },
    deliveryRatingContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding:24,
    },
    textHeader:{
        fontSize: 20,
        color:'#ffffff',
        marginLeft: 12,
    },
    textdeliveryRating:{
        color:'#ffffff',
        fontSize: 12,
        marginLeft:6,
    },
    ratingContainer:{
        flexDirection: 'row', 
        alignItems: 'center' ,
    },
    profileimageContainer:{
        width: 70, 
        height: 70,
        borderRadius: 50,
        overflow: 'hidden',
    },
    input: {
      height: 45,
      backgroundColor: '#353535c5',
  
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 10,
      borderRadius: 10,
      padding: 12,
  
      color: 'white',
      fontSize: 18
    }, 
    imageContainer:{ 
        width: 150, 
        height: 100, 
        borderRadius: 12 
    },
    itemsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#282828ea',
      

      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    
      elevation: 5,
  
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
    },
    textContainer:{
        flexDirection: 'column',
        marginRight: 10,
    },
    items:{
      color:'#ffffff',
      fontWeight: '600',
      fontSize: 17,
    },
    price:{
        color:'#ffffff',
        fontSize: 15,
        marginBottom: 8,
    },
    description:{
        color:'#c5c5c5',
        fontSize: 12,
    },
    whiteLine:{
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%',
        marginVertical: 10,
        marginBottom: 20,
    },
    popularHeader:{
        color:'#ffffff',
        fontWeight: '600',
        fontSize: 17,
        marginTop: 12,
    },
    AddToCartButton: {
        position: 'absolute',
        bottom: 10,
        right: 6,
        backgroundColor: '#1a1a1a',
        padding: 5,
        borderRadius: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center', // Align text horizontally
      },
      plusButtonText: {
        color: '#353535', // Use a non-transparent color
        fontSize: 20,
      },

  });