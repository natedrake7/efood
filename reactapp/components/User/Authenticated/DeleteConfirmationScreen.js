import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function DeleteConfirmation({ onCancel, onConfirm }){
  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        <Text style={styles.text}>Are you sure you want to delete this address?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};export default DeleteConfirmation;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  popup: {
    backgroundColor: '#282828ea',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  text:{
    color:'white',
  }
});
