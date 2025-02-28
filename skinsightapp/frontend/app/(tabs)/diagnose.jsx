import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, Alert, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './../../constants/styles'; 
import Header from '../component/Header';

export default function Diagnose() {
  const [imageUri, setImageUri] = useState(null);
  const [previousDiagnoses, setPreviousDiagnoses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch previous diagnoses on component mount
  useEffect(() => {
    fetchPreviousDiagnoses();
  }, []);

  const fetchPreviousDiagnoses = async () => {
    try {
      const response = await fetch('http://192.168.29.27:8000/previous_diagnoses'); // Replace with your endpoint
      const data = await response.json();
      if (response.ok) {
        setPreviousDiagnoses(data);
      } else {
        Alert.alert('Error fetching previous diagnoses.');
      }
    } catch (error) {
      console.error('Error fetching previous diagnoses:', error);
      Alert.alert('Failed to fetch previous diagnoses.');
    }
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        if (result.assets && result.assets.length > 0) {
          const selectedImage = result.assets[0].uri;
          setImageUri(selectedImage);
        } else if (result.uri) {
          setImageUri(result.uri);
        }
      }
    } catch (error) {
      console.error('Error while selecting an image:', error);
      Alert.alert('Error while selecting image.');
    }
  };

  const handlePredict = async () => {
    if (imageUri) {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('http://192.168.29.27:8000/predict', { 
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert(`Predicted Disease: ${data.predicted_class}`);
        } else {
          Alert.alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error while predicting:', error);
        Alert.alert('Failed to predict disease.');
      }
    } else {
      Alert.alert('Please upload an image first.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground 
        source={{ uri: 'https://i.pinimg.com/474x/26/5c/b8/265cb8232f91450a72477709a0e98ff9.jpg' }} 
        style={styles.bgimage}
      >
        <View style={styles.imgoverlay} />
        <View>
          <TouchableOpacity style={styles.uploadbtn} onPress={handleImageUpload}>
            <Text style={styles.uploadbtntxt}>Upload Image</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 20 }} />
          )}
          <TouchableOpacity style={styles.uploadbtn} onPress={handlePredict}>
            <Text style={styles.uploadbtntxt}>Predict</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadbtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.uploadbtntxt}>View Previous Diagnoses</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Modal to show previous diagnoses */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Previous Diagnoses</Text>
          <FlatList
            data={previousDiagnoses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.diagnosisText}>
                {item.disease_name} - {new Date(item.diagnosis_date).toLocaleDateString()}
              </Text>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
