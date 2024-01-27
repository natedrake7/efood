import { useContext, useEffect, useState } from "react";
import { Text,View, ActivityIndicator,StyleSheet,Image,TouchableOpacity,Modal,ScrollView,Animated} from "react-native";
import { AuthContext } from "../../../store/context/User/auth-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GetProductById } from "../../../store/context/User/professional";

function ProductDetailsScreen(){
    const authCtx = useContext(AuthContext);
    const route = useRoute();
    const navigation = useNavigation();
    const [product,setProduct] = useState('');

    const [isPageReady,setIsPageReady] = useState(false);

    useEffect(() => {
        const { id } = route.params;

        async function GetProduct(){
            try{
                const response = await GetProductById(authCtx.accessToken,id);
                console.log(response);
                setProduct(response);
            }
            catch(error)
            {
                console.log(error);
            }
          setIsPageReady(true);
        }
        GetProduct();
      }, []);

      const handleSelectSize = () =>{
        navigation.navigate('ProductSize');
      }

      if(!isPageReady)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </View>
        )

        return(
            <ScrollView style={styles.container}>
                <Image
                    source={{ uri: `http://192.168.1.16:3000/${product.image}` }}
                    style={{ width: '100%', height: 150, resizeMode: 'cover' ,borderRadius: 12}}
                />
                <View style={styles.itemsContainer}>
                    <Text style={styles.productHeader}>{product.name}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                    <Text style={styles.productHeader}>{'From ' + product.price + '\u20AC'}</Text>
                </View>
                <TouchableOpacity style={styles.itemsContainer} onPress={() => handleSelectSize(product.size)}>
                    <Text style={styles.productHeader}>Select Size:</Text>
                    <View>
                        <Text>Spera</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
                
        )
}
export default ProductDetailsScreen;



const styles = new StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: 10,
      },
      itemsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#282828ea',
        
  
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      
        elevation: 5,
    
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        marginTop: 10,
      },    
      productHeader:{
        color:'#ffffff',
        fontWeight: '600',
        fontSize: 17,
      },
      description:{
        marginTop: 6,
        marginBottom: 10,
        color:'#c5c5c5',
        fontSize: 12,
    },
    panel: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    closeButton: {
        color: 'blue',
        textAlign: 'center',
    },
});