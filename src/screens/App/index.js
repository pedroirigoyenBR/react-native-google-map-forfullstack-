import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

import {
    HOME_STACK,
    HOME,
    MAP
} from '../../constants/routeNames';

import HomeScreen from './Home';
import DrawerScreen from './Drawer';
import MapScreen from './Map';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
    const { colors } = useTheme();
    const { toggleDrawer, navigate } = useNavigation();

    return (
        <Stack.Navigator
            initialRouteName={HOME}
            screenOptions={{
            headerTitleAlign: 'center',
            headerLeft: ({ tintColor }) => (
                <IconButton icon="menu" color={tintColor} onPress={toggleDrawer} />
            ),
            headerTintColor: colors.background,
            headerStyle: { backgroundColor: colors.primary },
            }}
        >
            <Stack.Screen
                name={HOME}
                component={HomeScreen}
                options={{
                title: [
                        <Image
                        key={Math.random()}
                        source={require('../../assets/img/title.png')}
                        style={{ width: 30, height: 30 }}
                        />,
                        HOME,
                    ],
                }}
            />
            <Stack.Screen
                name={MAP}
                component={MapScreen}
                options={{
                title: [
                        <Image
                        key={Math.random()}
                        source={require('../../assets/img/title.png')}
                        style={{ width: 30, height: 30 }}
                        />,
                        MAP,
                    ],
                }}
            />
        </Stack.Navigator>
    )
}

export default () => (
    <Drawer.Navigator
        initialRouteName={HOME_STACK}
        drawerContent={(props) => <DrawerScreen {...props} />}
    >
        <Drawer.Screen name={HOME_STACK} component={HomeStack} />
        <Drawer.Screen name={MAP} component={MapScreen} />
    </Drawer.Navigator>
)
