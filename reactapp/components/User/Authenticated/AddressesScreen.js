import { Text,View,ActivityIndicator,StyleSheet,TouchableOpacity } from "react-native";
import { GetUserAdresses } from "../../../store/context/User/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/context/User/auth-context";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";

function AddressesScreen(){
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation();
    const [isPageReady,setIsPageReady] = useState(false);
    const [addresses,setAddresses] = useState([]);

    useEffect(() => {
        const FetchAddresses = async() =>{
            try{
                const response = await GetUserAdresses(authCtx.accessToken);
                setAddresses(response);
                console.log(response);
            }
            catch(error)
            {
                console.log(error);
            }

            setIsPageReady(true);
        };


        FetchAddresses();
    },[]);

    const handleAddAdress = () =>{
        navigation.navigate('AddAddress');
    }

    if(!isPageReady)
    {
        return (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="white" />
            </View>
          );
    }

    return(
        <SafeAreaView>
            <FlatList>

            </FlatList>
                <TouchableOpacity onPress={() => handleAddAdress()}>
                    <Text style={styles.addAddress}>Add a new Address</Text>
                </TouchableOpacity>
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
    }
});