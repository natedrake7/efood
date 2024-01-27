import { useContext, useEffect } from "react";
import { AuthContext } from "../../../store/context/User/auth-context";
import { FlatList,StyleSheet,Text,View,TouchableOpacity,Image} from "react-native";
import { SafeAreaView } from "react-navigation";

function  CartScreen(){
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        
    },[authCtx.cart]);

    const LoadingScreen = () =>{
        return(
         <ActivityIndicator size="large" color="white" />
        );
      }
    
    const handleRemoveFromCart = (uniqueId) =>{
        authCtx.removeFromCart(uniqueId);
    }

    const handleAddToCart = (item) =>{
        authCtx.addToCart(item);
    }

    const RenderCartItem = ({item}) =>{
        return(
            <View style={styles.itemsContainer}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity style={styles.button} onPress={() => handleRemoveFromCart(item.uniqueId)}>
                        <Text style={styles.cartControls}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.cartControls}>{item.count}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
                        <Text style={styles.cartControls}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'column'}}>
                    <Text style={styles.productProperties}>{item.name}</Text>
                    <Text style={styles.productProperties}>{item.size}</Text>
                    <Text style={styles.productProperties}>{item.price}€</Text>
                </View>
                <Image source={{ uri: item.image }} style={styles.imageContainer} />
            </View>
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
          {authCtx.cart &&
            <FlatList
              data={authCtx.cart}
              renderItem={RenderCartItem}
              keyExtractor={(item) => item.id}
              onScrollToTop={LoadingScreen}
              showsVerticalScrollIndicator={false}
            >
            </FlatList>
          }
        </SafeAreaView >
    )

}export default CartScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,
      },
    text: {
        color:'#ffffff',
        fontSize: 12,
        marginLeft:6,
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    cartControls:{
        color: '#ffff',
        fontSize: 30,
        fontWeight: '800',
        borderRadius: 20,
    },
    button:{
        borderRadius: 12,
        width: 35,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center', // Align text horizontally
    },
    productProperties:{
        color: '#fff',
        fontSize: 12,
    },
    addonProperties:{

    },
    imageContainer:{ 
        width: 75, 
        height: 60, 
        borderRadius: 12 
    },
});