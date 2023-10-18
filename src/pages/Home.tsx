import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { useAuth } from "../hooks/useAuth";

export function HomeScreen() {

  const { handleLogout, user } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const Logout = async () => {
    setLoading(true)
    await handleLogout()
    setLoading(false)
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <View className="w-screen h-screen justify-center items-center bg-blue-400">
      <View className="flex h-20 items-center">
        <Text className="text-lg text-white font-bold uppercase">Seja bem vindo  </Text>
        <Text className="text-lg text-white font-bold uppercase">{user.displayName} </Text>
      </View>
      <TouchableOpacity
        onPress={Logout}
        className="bg-blue-900 bg-opacity-10 w-8/12 p-2 rounded-md flex justify-center items-center">
        {!loading ?
          <Text className="text-white font-bold">
            Sair
          </Text>
          :
          <ActivityIndicator size={28} color="white" />
        }
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View >
  );
}