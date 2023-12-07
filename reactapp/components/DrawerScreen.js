import { Text, View } from "react-native";
import { DrawerContentScrollView,DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
import { SafeAreaView } from "react-navigation";

function DrawerScreen(props){
    const authCtx = useContext(AuthContext);

    return(
        <SafeAreaView style={styles.container}>
            <DrawerContentScrollView {...props}>
                <Text style={styles.header}>Welcome Kostas!</Text>
                <DrawerItemList {...props}/>
            </DrawerContentScrollView>
        </SafeAreaView >
    )
}
export default DrawerScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    header:{
        color:'white',
        fontWeight: '600',
        fontSize: 16,
    }
})