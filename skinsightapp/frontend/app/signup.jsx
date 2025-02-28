import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://192.168.29.27:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully. Please sign in.');
        router.push('/signin');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/0e/ab/41/0eab41ba0c2e95ded363d80b90509287.jpg' }} 
      style={styles.background}
      imageStyle={styles.backgroundImage} 
    >
      <View style={styles.container}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#888"
        />
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
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/signin')} style={styles.signupLink}>
          <Text style={styles.signupText}>Go back to Sign In</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    marginBottom: 32, // Adds space at the bottom
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SignUp;
