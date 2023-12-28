import { View, Button } from 'react-native';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


function Timetable({ onTimetableUpdate }){
    const [openingHours,setOpeningHours] = useState('');
    const [closingHours,setClosingHours] = useState('');

    const handleTimetableUpdate = () => {
        let timetableData = openingHours + "-" + closingHours;
        onTimetableUpdate(timetableData);
      };

      const renderArrowIcon = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
          <Icon name="chevron-down" size={15} color="#fff" />
        </View>
      );

    return (
      <View style={styles.container}>
        <View style={styles.pickersContainer}>
            <RNPickerSelect
                onValueChange={(value) => setOpeningHours(value)}
                items={timetables}
                placeholder={{ label: 'Opening', value: null }}
                style={pickerStyles}
                useNativeAndroidPickerStyle = {false}
                Icon={renderArrowIcon}
                darkTheme={true}
            /> 
            <RNPickerSelect
                onValueChange={(value) => setClosingHours(value)}
                items={timetables}
                placeholder={{ label: 'Closing', value: null }}
                style={pickerStyles}
                useNativeAndroidPickerStyle = {false}
                Icon={renderArrowIcon}
                darkTheme={true}
            />
        </View>
        <View style={styles.buttons}>
            <Button title='Update Timetable' onPress={handleTimetableUpdate}/>
        </View>
      </View>
    );
}export default Timetable;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 20,
    },
    pickersContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttons:{
        marginTop: 20,
        width:120,
    },
  });

  const timetables = [
    { label: '1:00 AM', value: '1' },
    { label: '2:00 AM', value: '2' },
    { label: '3:00 AM', value: '3' },
    { label: '4:00 AM', value: '4' },
    { label: '5:00 AM', value: '5' },
    { label: '6:00 AM', value: '6' },
    { label: '7:00 AM', value: '7' },
    { label: '8:00 AM', value: '8' },
    { label: '9:00 AM', value: '9' },
    { label: '10:00 AM', value: '10' },
    { label: '11:00 AM', value: '11' },
    { label: '12:00 PM', value: '12' },
    { label: '13:00 PM', value: '13' },
    { label: '14:00 PM', value: '14' },
    { label: '15:00 PM', value: '15' },
    { label: '16:00 PM', value: '16' },
    { label: '17:00 PM', value: '17' },
    { label: '18:00 PM', value: '18' },
    { label: '19:00 PM', value: '19' },
    { label: '20:00 PM', value: '20' },
    { label: '21:00 PM', value: '21' },
    { label: '22:00 PM', value: '22' },
    { label: '23:00 PM', value: '23' },
    { label: '24:00 AM', value: '24' },
  ]
  
  const pickerStyles = {
    inputIOSContainer:{
      backgroundColor:'#333',
      borderRadius: 8,
      overflow: 'hidden',
      height: 60,
      width: 150,
      alignItems:'center',
      justifyContent:'center',
      marginRight: 20,
      marginLeft:20,
      color:'white'
    },
    inputAndroidContainer:{
      backgroundColor:'#333',
      borderRadius: 8,
      overflow: 'hidden',
      height: 60,
      width: 150,
      alignItems:'center',
      justifyContent:'center',
      marginRight: 20,
      marginLeft:20,
      color:'white'
    },
    inputIOS: {
      color: '#fff',
    },
    inputAndroid: {
      color: 'white',
    },
    placeholder: {
      color: 'white',
    },
  };
  