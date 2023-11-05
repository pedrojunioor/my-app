import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text, ScrollView, TextInput, Modal, Alert } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from "../hooks/useAuth";
import firestore from '@react-native-firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
dayjs.locale(ptBr)

export function HomeScreen({ navigation }) {

  const { handleLogout, user } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const { bottom, top, left, right } = useSafeAreaInsets()
  const [dateCurrent, setDateCurrent] = useState(() => new Date())
  const [todo, setTodo] = useState<string>('')
  const [descriptionTodo, setDescriptionTodo] = useState<string>('')

  const ref = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('todos')

  const Logout = async () => {
    setLoading(true)
    await handleLogout()
    setLoading(false)
  }
  const [todos, setTodos] = useState<any[]>([])

  async function toggleComplete(id: string, complete: boolean) {
    await ref.doc(id).update({
      complete: !complete,
    });
  }

  const sendTodo = async () => {
    try {
      await ref.add({
        title: todo,
        complete: false,
        date: dayjs().format('YYYY-MM-DD')
      })
      setTodo('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete, date, description } = doc.data();
        list.push({
          id: doc.id,
          date,
          title,
          complete,
          description
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  function handleDateCurrent(action: string) {
    if (action === 'back') {
      const dataResult = dayjs(dateCurrent).subtract(1, 'day').toDate()
      setDateCurrent(dataResult)
    }
    if (action === 'next') {
      const dataResult = dayjs(dateCurrent).add(1, 'day').toDate()
      setDateCurrent(dataResult)
    }
  }

  const [todoSelected, setTodoSelected] = useState(undefined)
  const [visible, setVisible] = useState(false)
  const handleDetailsTodo = (item) => {
    setTodoSelected(item)
    setDescriptionTodo(item.description)
    setVisible(true)
  }

  const MyFlatList = (data) => {
    const filteredData = data.filter(item => item.date === dayjs(dateCurrent).format('YYYY-MM-DD'))
    if (filteredData.length > 0) {
      return filteredData.map(item => {
        return <TouchableOpacity
          key={item.id}
          onPress={() => handleDetailsTodo(item)}
          className='my-1 flex flex-row items-center w-full py-2 rounded-md px-2 shadow-lg bg-blue-500'
        >
          <Text className="w-10/12 text-white font-bold text-xl">
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => toggleComplete(item.id, item.complete)}
            className="w-2/12 flex items-center justify-center">
            {item.complete ?
              <Ionicons name="md-checkbox" size={28} color="green" />
              :
              <Ionicons name="md-checkbox-outline" size={28} color="green" />
            }
          </TouchableOpacity>
        </TouchableOpacity>
      })
    } else {
      return <View><Text>Sem dados para exibir</Text></View>
    }
  }

  const handleSubmitDescription = async (id: string) => {
    try {
      await ref.doc(id).update({
        description: descriptionTodo
      })
      setVisible(false)
      setTodoSelected(undefined)
      setDescriptionTodo('')
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top, paddingRight: right, paddingLeft: left }}
    >
      <View
        className="h-screen items-center flex flex-1 justify-center bg-blue-400 ">
        <View className="flex flex-row h-20 items-center justify-between w-full px-4">
          <Text className="text-lg text-white font-bold uppercase">{user.displayName} </Text>
          <TouchableOpacity
            onPress={Logout}
            className="border w-12 border-dotted border-white bg-opacity-10  p-2 rounded-md flex justify-center items-center">
            {!loading ?
              <Ionicons name="log-out" size={24} color="white" />
              :
              <ActivityIndicator size={28} color="white" />
            }
          </TouchableOpacity>
        </View>
        <View className="flex flex-row w-full p-2">
          <TextInput
            className="bg-white w-10/12 rounded-md px-4 py-2"
            placeholder="Insira uma tarefa"
            value={todo}
            onChangeText={setTodo}
          />
          <TouchableOpacity
            onPress={() => sendTodo()}
            disabled={todo.trim() === ''}
            className="w-2/12 flex items-center justify-center">
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row gap-4 justify-center items-center">
          <TouchableOpacity
            onPress={() => handleDateCurrent('back')}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white">{dayjs(dateCurrent).format('YYYY-MM-DD')}</Text>
          <TouchableOpacity
            onPress={() => handleDateCurrent('next')}
          >
            <Ionicons name="arrow-forward-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex items-center p-2">
          {MyFlatList(todos)}
        </View>
        <View className="mt-auto flex h-12 justify-center items-center bg-blue-800 w-full">
          <Text className="text-white font-semibold">Footer</Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(!visible);
          }}>
          <View className="m-auto bg-white w-80 rounded-md flex shadow-2xl z-50">
            <View className="flex flex-col w-full gap-4 p-2">
              <View className="flex flex-row justify-between">
                <Text className="font-bold border-b border-slate-200">{todoSelected && todoSelected.title}</Text>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text className="">Se quiser, insira alguma observação</Text>
              <TextInput
                className="bg-white w-full rounded-md px-4 py-2 border"
                placeholder="Insira uma tarefa"
                value={descriptionTodo}
                onChangeText={setDescriptionTodo}
              />
              <View
                className="flex justify-end w-full items-end rounded-xl">
                <TouchableOpacity
                  className="rounded-xl bg-blue-500 p-2"
                  onPress={() => handleSubmitDescription(todoSelected.id)}>
                  <Text className=" text-white" >Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View >
    </ScrollView >

  );
}