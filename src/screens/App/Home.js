import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid 
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: Colors.light,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {

  useEffect(() => {
      (async function() {
        await requestLocationPermission();
    })();
  }, []);

  const requestLocationPermission = async() => {
    try{
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
    }catch(err){
      console.warn(err)
    }
  }

  const backgroundStyle = {
    backgroundColor:  Colors.darker ,
  };
    
    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={ 'light-content' } />
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={backgroundStyle}>
            <View
                style={{
                backgroundColor: "#fff" ,
                }}>
                <Section title="Home Screen">
                  <Text style={styles.highlight}>Will</Text> add many functions on this screen
                </Section>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });

export default HomeScreen;
