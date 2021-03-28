import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';

import {
    HOME_STACK
  } from '../../constants/routeNames';

const DrawerScreen = (props) => {
    const { navigation, state } = props;

    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }}>
          <DrawerContentScrollView {...props}>
            {state.routes.map((route, i) => (
              <DrawerItem
                key={route.key}
                label={route.name}
                focused={i === state.index}
                onPress={() =>
                  navigation.navigate(HOME_STACK, { screen: route.name })
                }
                activeBackgroundColor={'transparent'}
                activeTintColor={"#000"}
              />
            ))}
          </DrawerContentScrollView>
        </SafeAreaView>
    );
}

export default DrawerScreen;