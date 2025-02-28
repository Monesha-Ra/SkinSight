import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://192.168.29.27:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        router.push('/home');
      } else {
        Alert.alert('Error', data.error || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/0e/ab/41/0eab41ba0c2e95ded363d80b90509287.jpg' }} // Replace with your image URL
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>SKINSIGHT</Text>
          <Text style={styles.subHeaderText}>Your Skin Our Insight</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
            <Text style={styles.signupText}>Create new account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  backgroundImage: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distributes space between header and form
    alignItems: 'center',
    padding: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 50, 
  },
  headerText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 100,
    marginBottom: 10,
    fontFamily:'Roboto', 

  },
  subHeaderText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32, // Adjust as needed
  },
  input: {
    width: '80%',
    marginBottom: 12,
    borderWidth: 1,
    padding: 12,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    color: '#000',
  },
  button: {
    backgroundColor: '#889982',
    padding: 12,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signupLink: {
    marginTop: 16,
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SignIn;
