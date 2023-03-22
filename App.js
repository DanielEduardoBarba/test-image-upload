import { useState } from 'react';
import { StyleSheet, View, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from "expo-image-picker"

//an instance of firebase is initiliazed
//from firebaseConfig if none is open already
import { firebase } from './resources.js'



export default function App() {
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)



  const pickImage = async () => {

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }

    // No permissions request is necessary for launching the image library
    // Opens image library and passes selected one using options set 
    let result = await ImagePicker.launchImageLibraryAsync(options);

    console.log(result);
    if (!result.cancelled) setImage(result.uri);
  };

  const uploadImage = async () => {

    //gets blob from selected image, which is found with the uri passed from 
    //ImagePicker.launchImageLibraryAsync()
    const blob = await new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        resolve(xhr.response)
      }

      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      }

      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    })

    //gets a reference to the firebase storage and a folder
    //navigation to the exact file location and name in this case
    //folder "Pictures" saved as "Image1.<filetype>"
    const ref = firebase.storage().ref().child(`Pictures/Image1`)



    //ref.put sends the image by "blob" to the bucket
    //returns a snapshot to watch if youd like

    //only saves to storage bucket
    ref.put(blob)
    return

    //saves to bucket AND shows update status using snapshot
    //const snapshot = ref.put(blob)


    //gives update of status of upload, does NOT effect actual upload
    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true)
      },

      (error) => {
        setUploading(false)
        console.log(error)
        blob.close()
        return
      },

      () => {

        snapshot.snapshot.ref.getDownloadURL().then((url) => {

          setUploading(false)
          console.log("Download URL: ", url)
          setImage(url)

          blob.close()
          return url
        })
      })

  }



  return (

    <View style={styles.container}>

      {image && <Image source={{ uri: image }} style={{ width: 170, height: 200 }} />}

      <Button styles={styles.button} title='Select Image' onPress={pickImage} />

      {!uploading
        ? <Button styles={styles.button} title='Upload Image' onPress={uploadImage} />
        : <ActivityIndicator size={'small'} color='black' />}

    </View>

  );

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  button: {
    margin: 5,
    backgroundColor: "teal"
  },

});