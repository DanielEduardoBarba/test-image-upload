import React, { useState, useEffect, useRef } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import { Camera, CameraType} from 'expo-camera';
import * as ImagePicker from "expo-image-picker"

import { initializeApp, cert } from "firebase/app"
import { getStorage, ref, uploadBytes } from "firebase/storage"

import { firebaseConfig } from '../../resources.js'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height; 


export default function SaveSpot() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);



  useEffect(() => {

    async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    }
  
  }, []);


const uploadToFirebase = async () =>{


  const result = await ImagePicker.launchImageLibraryAsync()

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const filename = result.uri
  const imageRef = ref(storage, 'images/'+filename)
  
  // quick way to get URL
  const url = `https://firebasestorage.googleapis.com/v0/b/favorite-location-map-app-deb.appspot.com/o/photos%2f${filename}?alt=media`
  //setUploadedImage(url)
  console.log("URL: ",url)
  console.log("")

  uploadBytes(imageRef)
  //find todds github

}


  return (
  
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              {' '}
              Flip{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
             
            uploadToFirebase()
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              {' '}
              Take PHOTO{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
 

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "red",
    borderStyle:"solid",
    borderWidth:5,
    borderRadius:40
  },
  camera: {
    flex: 1,
    height:300,
    borderColor: "black",
    borderStyle:"solid",
    borderWidth:5,
    padding:-1,
    margin:20,
    borderRadius:40,
    overflow:"hidden"
  },
  buttonContainer:{
    backgroundColor:"red",
    height:100,
    width:200
  },
  button:{
    backgroundColor:"wheat",
    width:50,
    height:50
  },
  text:{
   fontSize:15 
  }
});