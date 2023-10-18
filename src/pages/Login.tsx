
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { useAuth } from "../hooks/useAuth";


export function LoginScreen({ navigation }) {

    const { handleLogin } = useAuth()

    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        await handleLogin(email, password)
    }

    return (
        <View className="w-screen h-screen justify-center items-center bg-blue-400">
            <View className="h-20">
                <Text className="text-lg text-white font-bold uppercase">App de Pedro Junior</Text>
            </View>
            <View className="w-full justify-center items-center gap-4">
                <TextInput
                    className="bg-white w-8/12 rounded-md p-2"
                    placeholder='insira seu e-mail'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    className="bg-white w-8/12 rounded-md p-2"
                    placeholder='insira sua senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-900 bg-opacity-10 w-8/12 p-2 rounded-md flex justify-center items-center">
                    {!loading ?
                        <Text className="text-white font-bold">
                            Login
                        </Text>
                        :
                        <ActivityIndicator size={28} color="white" />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register') }
                    className="bg-opacity-10 w-8/12 p-2 rounded-md flex justify-center items-center">
                    <Text className="text-white font-bold">
                        Cadastre-se
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}