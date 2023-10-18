
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";

export function RegisterScreen() {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const { handleCreateNewUser } = useAuth()

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert('', 'As senhas não conferem')
            return
        }
        await handleCreateNewUser(name, email, password)
    }

    return (
        <View className="w-screen h-screen justify-center items-center bg-blue-400">
            <View className="h-20">
                <Text className="text-lg text-white font-bold uppercase">Cadastre-se</Text>
            </View>
            <View className="w-full justify-center items-center gap-4">
                <TextInput
                    className="bg-white w-8/12 rounded-md p-2"
                    placeholder='insira seu nome'
                    value={name}
                    onChangeText={setName}

                />
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
                <TextInput
                    className="bg-white w-8/12 rounded-md p-2"
                    placeholder='Confirme a senha'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-900 bg-opacity-10 w-8/12 p-2 rounded-md flex justify-center items-center">
                    {!loading ?
                        <Text className="text-white font-bold">
                            Cadastrar
                        </Text>
                        :
                        <ActivityIndicator size={28} color="white" />
                    }
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}