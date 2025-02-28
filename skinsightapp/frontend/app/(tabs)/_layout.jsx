import { View,StyleSheet} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Colors} from './../../constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  return (
    <View  style={styles.container}>
      <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:'white',tabBarInactiveBackGroundColor:Colors.light,tabBarStyle:{backgroundColor:'#889982',marginBottom:20,marginHorizontal:20,opacity:0.7,overflow: 'hidden',borderRadius:30}}}>
        <Tabs.Screen name="home" options={{color:'black',tabBarLabel:'Home',tabBarIcon:({color})=><MaterialIcons name="home" size={24} color={color} />}}/>
        <Tabs.Screen name="diagnose" options={{tabBarLabel:'Diagnose',tabBarIcon:({color})=><AntDesign name="scan1" size={24} color={color} />}}/>
        <Tabs.Screen name="skincare" options={{tabBarLabel:'Skincare',tabBarIcon:({color})=><FontAwesome6 name="bottle-droplet" size={24} color={color} />}}/>
    </Tabs>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#262526', 
    paddingBottom: 0, 
  },
});