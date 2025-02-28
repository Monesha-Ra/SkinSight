import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        navigation.navigate('Home'); // If user is signed in, navigate to Home screen
      } else {
        navigation.navigate('SignIn'); // Else, navigate to SignIn screen
      }
    };

    checkUser();
  }, []);

  return (
    <View style={{headerShown:false,backgroundColor: '#262526'}}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoadingScreen;
