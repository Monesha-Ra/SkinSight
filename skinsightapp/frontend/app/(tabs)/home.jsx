import React from 'react';
import { View, Text, FlatList, Image,  TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../component/Header';
import styles from './../../constants/styles';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const tipsData = [
    {
      id: '1',
      title: 'Acne care',
      description: 'Complete unsponsored skincare for acne.',
      videoUri: 'https://www.youtube.com/embed/k9Yo5vYv-B4?si=iu_-g97ecSDfkRUi', 
    },
    {
      id: '2',
      title: 'Beginner\'s Guide',
      description: 'Building a Skincare Routine for all Skin Types',
      videoUri: 'https://www.youtube.com/embed/gGmgWloAPvw?si=TrNV6eVia13SKxQo', 
    },
    {
      id: '3',
      title: 'Skincare Basics',
      description: 'Easy Morning and Night Routine.',
      videoUri: 'https://www.youtube.com/embed/APC16_cpYyk?si=QHSGsiKF3UZUzJXS', 
    },
    {
      id: '4',
      title: 'Teenage Skincare',
      description: 'Oily , dry, normal skin',
      videoUri: 'https://www.youtube.com/embed/4j9_9aDxIzI?si=d8_ijWHlbb4WjMzU', 
    },
    
  ];

  return (
    <View style={styles.container}>
      <Header />
      <Image
        source={{ uri: 'https://i.pinimg.com/474x/ed/41/f8/ed41f86f98fd311ebd97a27297ba4c23.jpg' }} 
        style={{
          width: '100%',
          height: 250,
          opacity:0.5,
        }}
        resizeMode="cover"
      />
      <View style={styles.quickcontainer}>
      <Text style={styles.welcomeText}>Welcome to Your Skincare Journey!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/skincare')} // Navigate to Skin Type Quiz
        >
          <Text style={styles.buttonText}>Skin Type Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/diagnose')} // Navigate to Skincare Routine Tracker
        >
          <Text style={styles.buttonText}>Analyze Skin</Text>
        </TouchableOpacity>
      </View>
    </View>
      <View style={styles.container}>
        <Text style={styles.tipheader}> EXPERT TIPS FOR EVERY SKIN TYPE</Text>
      <FlatList
        data={tipsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tipContainer}>
            <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            </View>
            <WebView
              style={styles.video}
              source={{ uri: item.videoUri }}
              allowsInlineMediaPlayback={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        )}
      />
      </View>
    </View>
  );
}


