import * as React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../auth/LoginScreen';
import TodoListScreen from '../todos/screens/TodoListScreen';

const Stack = createStackNavigator();

export default function RootNavigation() {
    return (
        <NavigationNativeContainer>
            <Stack.Navigator initialRouteName="loginScreen">
                <Stack.Screen name="loginScreen"
                    component={LoginScreen}
                    options={{ title: 'Please login' }} />
                <Stack.Screen
                    name="todoListScreen"
                    component={TodoListScreen}
                    options={{ title: 'My Todo List' }}
                />
            </Stack.Navigator>
        </NavigationNativeContainer>
    );
}
