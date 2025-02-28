import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../constants/styles';

const Header = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');

    // Fetch user name from AsyncStorage on component mount
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setUserName(parsedUser.name); // Set userName state with the user's name
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserName();
    }, []);

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('user'); // Clear user data from AsyncStorage
            navigation.navigate('signin'); // Navigate back to the sign-in screen
        } catch (error) {
            console.error("Error during sign-out:", error);
            Alert.alert('Error', 'Sign out failed. Please try again.');
        }
    };

    return (
        <View>
            <View style={styles.tab}>
                <Text style={styles.tabtext}>Hi, {userName}!</Text>
                <TouchableOpacity style={styles.signout} onPress={handleSignOut}>
                    <Text style={styles.signoutbtn}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;
