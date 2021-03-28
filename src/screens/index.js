import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APP, AUTH } from '../constants/routeNames';
import AppStack from './App';

const Stack = createStackNavigator();

const AppNavigator = () => {
  
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName={APP}>
          <Stack.Screen name={APP} component={AppStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default AppNavigator;