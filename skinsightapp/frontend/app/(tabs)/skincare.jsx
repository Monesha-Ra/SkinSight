import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Button, ScrollView } from 'react-native';
import axios from 'axios';
import ProgressBar from 'react-native-progress/Bar';
import styles from './../../constants/styles';
import Header from '../component/Header';

const Skincare = () => {
  const [routine, setRoutine] = useState({ AM: {}, PM: {} });
  const [showQuiz, setShowQuiz] = useState(false);
  const [skinType, setSkinType] = useState('');
  const [skinConcern, setSkinConcern] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isRoutineSet, setIsRoutineSet] = useState(false);
  const [customProduct, setCustomProduct] = useState('');
  const [tempAM, setTempAM] = useState([]);
  const [tempPM, setTempPM] = useState([]);
  const [progress, setProgress] = useState({ AM: 0, PM: 0 }); // Changed to a single progress state

  const quizQuestions = [
    { question: 'What is your primary skin type?', options: ['Dry', 'Oily', 'Combination', 'Sensitive'] },
    { question: 'What is your main skin concern?', options: ['Glow', 'Hydration', 'Anti-Aging', 'Repair'] },
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleQuizSubmit = async () => {
    try {
      const response = await axios.get('http://192.168.29.27:8000/skincare/products', {
        params: { skinType, skinConcern },
      });
      setRecommendedProducts(response.data);
      setShowQuiz(false);
      setIsRoutineSet(false);

      await axios.post('http://192.168.29.27:8000/save_quiz_results', { skinType, skinConcern });
      Alert.alert('Quiz results saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products or save quiz results');
    }
  };

  const fetchRoutine = async () => {
    try {
      const response = await axios.get('http://192.168.29.27:8000/get_routine');
      const fetchedRoutine = { AM: {}, PM: {} };

      daysOfWeek.forEach(day => {
        fetchedRoutine.AM[day] = [];
        fetchedRoutine.PM[day] = [];
      });

      response.data.forEach(item => {
        const newProduct = { Name: item.products, completed: false };
        if (item.routine_type === 'AM') {
          daysOfWeek.forEach(day => fetchedRoutine.AM[day].push(newProduct));
        } else if (item.routine_type === 'PM') {
          daysOfWeek.forEach(day => fetchedRoutine.PM[day].push(newProduct));
        }
      });

      setRoutine(fetchedRoutine);
      setIsRoutineSet(true);
      calculateProgress(fetchedRoutine); // Calculate progress after setting routine
    } catch (error) {
      console.error('Error fetching routine:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get('http://192.168.29.27:8000/get_weekly_progress');
      const fetchedProgress = { AM: 0, PM: 0 };

      response.data.forEach(item => {
        if (item.time_of_day === 'AM') {
          fetchedProgress.AM += item.completed;
        } else if (item.time_of_day === 'PM') {
          fetchedProgress.PM += item.completed;
        }
      });

      setProgress({
        AM: fetchedProgress.AM,
        PM: fetchedProgress.PM,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    fetchRoutine();
    fetchProgress(); // Fetch the progress on mount
  }, []);

  const finalizeRoutine = async (timeOfDay) => {
    try {
      const products = timeOfDay === 'AM' ? tempAM : tempPM;
      const response = await axios.post('http://192.168.29.27:8000/create_routine', {
        routine_type: timeOfDay,
        products: products.map(item => item.Name),
      });
      if (response.status === 201) {
        console.log(`${timeOfDay} Routine created successfully!`);
      }
    } catch (error) {
      console.error(`Error creating ${timeOfDay} routine:`, error);
    }
  };

  const addToTempRoutine = (product, timeOfDay) => {
    const newProduct = { ...product, completed: false };
    if (timeOfDay === 'AM') {
      setTempAM(prev => [...prev, newProduct]);
    } else {
      setTempPM(prev => [...prev, newProduct]);
    }
  };

  const confirmRoutine = () => {
    const newRoutine = { AM: {}, PM: {} };

    daysOfWeek.forEach(day => {
      newRoutine.AM[day] = tempAM;
      newRoutine.PM[day] = tempPM;
    });

    setRoutine(newRoutine);
    setIsRoutineSet(true);
    finalizeRoutine('AM');
    finalizeRoutine('PM');
    setTempAM([]);
    setTempPM([]);
    setRecommendedProducts([]);
  };

  const addCustomProduct = (timeOfDay) => {
    if (!customProduct.trim()) {
      Alert.alert("Please enter a product name");
      return;
    }
    const newProduct = { Name: customProduct, Brand: 'Custom', completed: false };

    if (timeOfDay === 'AM') {
      setTempAM(prev => [...prev, newProduct]);
    } else {
      setTempPM(prev => [...prev, newProduct]);
    }

    setCustomProduct('');
  };

  const calculateProgress = (currentRoutine) => {
    const calculateRoutineProgress = (routine) => {
      let totalTasks = 0;
      let completedTasks = 0;

      Object.values(routine || {}).forEach(day => {
        day?.forEach(product => {
          totalTasks += 1;
          if (product?.completed) completedTasks += 1;
        });
      });

      return totalTasks ? completedTasks / totalTasks : 0;
    };

    const progressAM = calculateRoutineProgress(currentRoutine?.AM);
    const progressPM = calculateRoutineProgress(currentRoutine?.PM);

    setProgress({ AM: progressAM, PM: progressPM });
  };

  const toggleCompletion = (productName, dayIndex, timeOfDay) => {
    setRoutine(prevRoutine => {
      const updatedRoutine = JSON.parse(JSON.stringify(prevRoutine));

      if (updatedRoutine[timeOfDay]?.[daysOfWeek[dayIndex]]) {
        updatedRoutine[timeOfDay][daysOfWeek[dayIndex]] = updatedRoutine[timeOfDay][daysOfWeek[dayIndex]].map(product => {
          if (product.Name === productName) {
            return { ...product, completed: !product.completed };
          }
          return product;
        });
      }

      calculateProgress(updatedRoutine); // Update progress after toggling completion
      return updatedRoutine;
    });
  };

  return (
    <FlatList
      contentContainerStyle={styles.skincontainer}
      ListHeaderComponent={
        <>
          <Header />
          <TouchableOpacity style={styles.tkbutton} onPress={() => setShowQuiz(true)}>
            <Text style={styles.tktext}>Take Quiz</Text>
          </TouchableOpacity>

          {showQuiz && (
            <View style={styles.quizContainer}>
              {quizQuestions.map((q, index) => (
                <View key={index}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  {q.options.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        if (index === 0) setSkinType(option);
                        if (index === 1) setSkinConcern(option);
                      }}
                      style={styles.optionButton}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              <TouchableOpacity style={styles.tkbutton} onPress={handleQuizSubmit}>
                <Text style={styles.tktext}>Submit Quiz</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showQuiz && recommendedProducts.length > 0 && !isRoutineSet && (
            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationTitle}>Recommended Products</Text>
              <FlatList
                data={recommendedProducts}
                keyExtractor={item => item.Name}
                renderItem={({ item }) => (
                  <View style={styles.productContainer}>
                    <Text style={styles.productName}>{item.Name}</Text>
                    <Text style={styles.optionText}>Brand: {item.Brand}</Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.addbutton}
                        onPress={() => addToTempRoutine(item, 'AM')}
                      >
                        <Text style={styles.tktext}>Add to AM</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addbutton}
                        onPress={() => addToTempRoutine(item, 'PM')}
                      >
                        <Text style={styles.tktext}>Add to PM</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListFooterComponent={
                  (tempAM.length > 0 || tempPM.length > 0) && (
                    <View style={styles.doneButtonContainer}>
                      <Button title="Done" onPress={confirmRoutine} />
                    </View>
                  )
                }
              />
            </View>
          )}

          {isRoutineSet && (
            <View>
              {['AM', 'PM'].map((timeOfDay) => {
                const uniqueProducts = new Set();
                const completionStatus = {};
                Object.keys(routine[timeOfDay]).forEach(day => {
                  routine[timeOfDay][day]?.forEach(product => {
                    uniqueProducts.add(product.Name);
                    if (!completionStatus[product.Name]) {
                      completionStatus[product.Name] = new Array(7).fill(false);
                    }
                    completionStatus[product.Name][daysOfWeek.indexOf(day)] = product.completed || false;
                  });
                });

                return (
                  <View key={timeOfDay}>
                    <Text style={styles.routineTitle}>{timeOfDay} Routine</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                      <View style={styles.table}>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.tableHeaderText,styles.productColumn]}>Product</Text>
                          {daysOfWeek.map(day => (
                            <Text key={day} style={[styles.tableHeaderText,styles.dayColumn]}>{day.slice(0, 3)}</Text>
                          ))}
                        </View>
                        {[...uniqueProducts].map(productName => (
                          <View key={productName} style={styles.tableRow}>
                            <Text style={[styles.tableCell,styles.productColumn]}>{productName}</Text>
                            {daysOfWeek.map((day, dayIndex) => (
                              <TouchableOpacity
                                key={day}
                                style={[styles.tableCell, completionStatus[productName][dayIndex] ? styles.completedCell : styles.notCompletedCell]}
                                onPress={() => toggleCompletion(productName, dayIndex, timeOfDay)}
                              >
                                <Text style={[styles.tableCellText, { color: completionStatus[productName][dayIndex] ? 'white' : 'white' }]}>
                                  {completionStatus[productName][dayIndex] ? '\u25CF' : '\u25CB'}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ))}

                      </View>
                    </ScrollView>
                    <Text style={styles.routineTitle}>Progress:</Text>
                    <ProgressBar progress={progress[timeOfDay]} width={200} margin={15} color={timeOfDay === 'AM' ? "white" : "white"} />
                  </View>
                );
              })}
            </View>
          )}
        </>
      }
    />
  );
};

export default Skincare;
