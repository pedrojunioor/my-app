import { NavigationContainer } from "@react-navigation/native"
import { View, ActivityIndicator } from "react-native"

import { useAuth } from "../hooks/useAuth"

import { LoginScreen } from '../pages/Login';
import { HomeScreen } from '../pages/Home';
import { RegisterScreen } from "../pages/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function Routes() {

    const { initializing, user } = useAuth()

    if (initializing) return (
        <View className='flex flex-1 justify-center items-center'>
            <ActivityIndicator size={24} color="fff" />
        </View>
    )

    return (
        <NavigationContainer>
            {(!user) ?
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }} >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
                :
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }} >
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    )
}