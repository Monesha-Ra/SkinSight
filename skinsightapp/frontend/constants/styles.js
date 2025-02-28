import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#262526', 
    },
    tab: {
      backgroundColor: '#889982',
      width:'100%',
      height:70,
      paddingTop:32,
      paddingLeft:8,
      opacity:0.7,
      paddingRight: 8, 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center', 
    },
    tabtext:{
      fontSize:20,
      color:'white',
    },
    text: {
      color: '#FFFFFF', 
      fontSize: 24, 
    },
    bgimage:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
    },
    quickcontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.3)', 
      margin:15,
      borderRadius:15,
      height:50,
    },
    welcomeText: {
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 20,
      color:'white',
    },
    
    buttonContainer: {
      flexDirection: 'column',
      width: '50%',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#889982',
      padding: 15,
      borderRadius: 15,
      width: 150,
      height:50,
      alignItems: 'center',
      margin: 10,
    },
    buttonText: {
      color: '#FFFFFF', 
      fontSize: 15,
    },
    imgoverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity here
    },
    tipContainer: {
      margin: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 15,
      flexDirection: 'row', 
      alignItems: 'center',
    },
    tipheader:{
      color:'white',
      padding:15,
      fontSize:18,
      fontWeight:'bold'
    },
    textcontainer:{
      flex:1,
      flexDirection:'column',
      width:'50%',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color:'white',
      width:200,
      paddingBottom:25,
    },
    description: {
      fontSize: 14,
      marginVertical: 5,
      color:'white',
      width:200,
    },
    video: {
      width:150,
      height: 150,
      marginTop: 10,
      flex:2,

    },
    uploadbtn: {
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      borderRadius: 15,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      position: 'relative', 
      margin:10,
    },
    uploadbtntxt:{
      color:'rgba(255, 255, 255, 0.8)',
      fontSize:18,
      textAlign:'center',
    },
    modalView: {
      
      margin: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    diagnosisText: {
      fontSize: 16,
      marginVertical: 5,
    },
    closeButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#889982',
      borderRadius: 25,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    signout: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
      borderRadius: 15,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      margin: 10,
      width:90,
      height:30,
  },
  signoutbtn: {
      color: 'white', 
      fontSize: 12,
      textAlign: 'center',
      margin:5,
  },
  tkbutton:{
    backgroundColor: '#889982',
    padding: 15, 
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative', 
    margin:15,
  },
  tktext:{
    textAlign:'center',
    color:'white',
  },
  quizContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
    paddingVertical: 25,
    marginHorizontal: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 15,
  },
  recommendationContainer: {
    marginVertical: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addbutton:{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 35,
    marginBottom: 10,
    marginHorizontal: 20,
    
  },
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  productName: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ffffff',
  },
  routineItem: {
    padding: 5,
    color: '#ffffff',
  },
  skincontainer: {
    flexGrow: 1,
    backgroundColor: '#262526', 
  },
  editContainer: {
    marginTop: 20,
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    color: '#ffffff',
    marginVertical: 5,
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginVertical: 10,
    color:'rgba(255,255,255,0.7)',
    borderRadius:15,
    margin:10,
  },
  routineTitle:{
    margin:10,
    color:'white',
    fontSize:15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'rgba(255,255,255,0.2)',
    
  },
  tableCell: {
    flex: 1,
    color:'white',
    
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  productColumn: {
    width: 110, 
    margin:5,
  },
  dayColumn: {
    width: 41, 
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5, 
    marginLeft: 10, 
  }
  
  });
export default styles;
