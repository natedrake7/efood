import { Text, View,Image, Button } from "react-native";
import { DrawerContentScrollView,DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import { SafeAreaView } from "react-navigation";

function DrawerScreen(props){

    const authCtx = useContext(AuthContext);
    const user = authCtx.getUserInfo();

    function HandleLogout(){
        authCtx.logout();
    }

    return(
        <SafeAreaView style={styles.container}>
            <DrawerContentScrollView contentContainerStyle={styles.scrollViewContainer} {...props}>
                <Image 
                source={require('../images/foodlab-image.png')}
                style={styles.imageContainer}
                />
            <Text style={styles.header}>Welcome {user.username}!</Text>
                <DrawerItemList {...props}/>
            </DrawerContentScrollView>
            <View>
                <Button style={styles.header} onPress={HandleLogout} title="Logout"/>
            </View>
        </SafeAreaView >
    )
}
export default DrawerScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    scrollViewContainer:{
        backgroundColor: '#000000ea',
    },
    header:{
        color:'white',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 12,
        marginLeft:6,
    },
    imageContainer:{
        width:80,
        height:80,
        borderRadius:50,
        marginLeft: 10,
        marginBottom:10,
    }
})