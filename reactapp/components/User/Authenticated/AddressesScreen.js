import { Text,View,ActivityIndicator,StyleSheet,TouchableOpacity,Modal } from "react-native";
import { DeleteUserAddress, GetUserAdresses } from "../../../store/context/User/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/context/User/auth-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";
import DeleteConfirmation from "./DeleteConfirmationScreen";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewIcons from 'react-native-vector-icons/AntDesign';

function AddressesScreen(){
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [isPageReady,setIsPageReady] = useState(false);
    const [addresses,setAddresses] = useState([]);
    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [idToBeDeleted,setIdToBeDeleted] = useState('');
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const FetchAddresses = async() =>{
            try{
                const response = await GetUserAdresses(authCtx.accessToken);
                setAddresses(response);
            }
            catch(error)
            {
                console.log(error);
            }

            setIsPageReady(true);
        };
        FetchAddresses();
    },[refresh,route]);

    const RenderFloor = (floor) =>{
        if(floor == 1)
            return(
                <Text style = {styles.text}>
                    {floor + 'st' + ' floor'}
                </Text>
                )
        else if(floor == 2)
            return(
                <Text style = {styles.text}>
                    {floor + 'nd' + ' floor'}
                </Text>
                ) 
        else if(floor == 3)
            return(
                <Text style = {styles.text}>
                    {floor + 'rd' + ' floor'}
                </Text>
                ) 
        else
            return(
                <Text style = {styles.text}>
                    {floor + 'th' + ' floor'}
                </Text>
                )
    }

    const handleAddAdress = () =>{
        navigation.navigate('AddAddress');
    }

    const LoadingScreen = () =>{
        return(
         <ActivityIndicator size="large" color="white" />
        );
    }

    const RedirectToAddress = (id) =>{
        navigation.navigate('AddressDetails',{id:id});
    }

    const DeleteAddress = (id) => {
        setIdToBeDeleted(id);
        setDeleteConfirmationVisible(true);
      };

    const handleDeleteConfirmed = async() => {
        if(idToBeDeleted)
            await DeleteUserAddress(authCtx.accessToken,idToBeDeleted);
        
        setRefresh(true);
        setDeleteConfirmationVisible(false);
    };
    
    const handleDeleteCanceled = () => {
        setDeleteConfirmationVisible(false);
    };      

    const RenderAddress = ({ item }) => {
        const rightButtons = () => {
            return (
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={styles.rightActionsContainer}>
                        <TouchableOpacity onPress={() => RedirectToAddress(item.id)}>
                            <NewIcons name="edit" size={30} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightActionsContainer}>
                        <TouchableOpacity onPress={() => DeleteAddress(item.id)}>
                            <Icon name="delete" size={30} color="red"/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    
        return (
                <Swipeable
                renderRightActions={rightButtons}
                overshootRight={false}
                useNativeDriver={true}
                >
                <View style={styles.itemsContainer}>
                    <View style={styles.containerRows}>
                        <Icon name="home" size={30} color="green" />
                        <Text style={styles.text}>{item.address + ' ' + item.number}</Text>
                    </View>
                    <View style={styles.containerRows}>
                        <Text style={styles.text}>{RenderFloor(item.floor)}</Text>
                        <Text style={styles.text}>{',' + item.city + ' ' + item.zipcode}</Text>
                    </View>
                    <View style={styles.containerRows}>
                        <Text style={styles.text}>{'Ringbell: ' + item.ringbell}</Text>
                    </View>
                </View>
          </Swipeable>
        );
      };

    if(!isPageReady)
    {
        return (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="white" />
            </View>
          );
    }

    return(
        <SafeAreaView style={{marginTop: 20,justifyContent:'center',alignContent:'center'}}>
            {addresses &&
            <FlatList
                data={addresses}
                renderItem={RenderAddress}
                keyExtractor={(item) => item.id}
                onScrollToTop={() => LoadingScreen()}
                showsVerticalScrollIndicator={false}
                onRefresh={() => setRefresh(!refresh)}
            />}
                <TouchableOpacity onPress={() => handleAddAdress()} style={styles.addAddressButton}>
                    <Text style={styles.addAddress}>Add a new Address</Text>
                </TouchableOpacity>
                {
                    isDeleteConfirmationVisible &&
                    <Modal style={styles.modal} >
                        <DeleteConfirmation onCancel={handleDeleteCanceled} onConfirm={handleDeleteConfirmed} />
                    </Modal>
                }
        </SafeAreaView>
    )
}export default AddressesScreen;


const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,
    },
    addAddress:{
        color:'green',
        fontSize: 16,
    },
    addAddressButton:{
        marginTop: 20,
        alignItems:'center',
    },
    itemsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#282828ea',
        
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      
        elevation: 5,
    
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
      },
      containerRows:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom: 10,
      },
      text:{
        color: 'white',
        marginLeft: 10,
      },
      rightActionsContainer:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems: 'center',
        width:100,
        height:50,
      },
      modal: {
        justifyContent: 'center',
        alignItems: 'center',
      },
});