import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { HomeStackParamList } from '../navigation/types';
import { Todo_Item, deleteTodo, todoAdded, todoToggled, updateTodo } from '../redux/slices/todo-slicer';
import { Root_State } from '../redux/store';
import { customAlphabet } from 'nanoid/non-secure';
import {useTranslation} from 'react-i18next';
import { t } from 'i18next';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Dashboard'>;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);
const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const {t} = useTranslation();
  const [inputText, setInputText] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo_Item | undefined>(
    undefined,
  );
  const dispatch = useDispatch();
  const todosList = useSelector((state: Root_State) => {
    let todos: Todo_Item[] = state.todos;
    return todos;
  });
  const didChangeText = (text: string) => {
    setInputText(text);
  };
  const didPressAddButton = () => {
    if (selectedTodo) {
      dispatch(updateTodo({ id: selectedTodo.id, title: inputText }));
    } else {
      dispatch(todoAdded({ id: nanoid(), title: inputText }));
    }
    setInputText('');
    setSelectedTodo(undefined);
  };
  const didPressTodoItem = (todo: Todo_Item) => {
    setSelectedTodo(todo);
    setInputText(todo.text);
    //navigation.navigate("Dashboard");
  };
  const didUpdteTodoItem = (todo: Todo_Item) => {
    setSelectedTodo(todo);
    setInputText(todo.text);
  };
  const completeTodo = (todo: Todo_Item) => {
    dispatch(todoToggled({ id: todo.id }));
  };
  const deleteTodoItem = (todo: Todo_Item) => {
    dispatch(deleteTodo({ id: todo.id }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text
        style={{ fontWeight: 'bold', fontSize: 20, padding: 20, paddingLeft: 5 }}>
        {' '}
        Todo{' '}
      </Text>
      <View
        style={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TextInput
          style={{
            width: '65%',
            height: 50,
            borderWidth: 1,
            padding: 10,
            borderRadius: 6,
            borderColor: 'gray',
          }}
          placeholder="Enter your todo"
          value={inputText}
          onChangeText={didChangeText}
        />
        <Pressable
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2293E0',
            height: 50,
            width: 100,
            borderRadius: 6,
          }}
          onPress={didPressAddButton}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>
            {' '}
            {selectedTodo ? 'Update' : 'Add'}{' '}
          </Text>
        </Pressable>
      </View>
      <FlatList
        style={{ margin: 10 }}
        data={todosList}
        renderItem={item => (
          <TodoItem
            todo={item.item}
            didSelectTodo={didPressTodoItem}
            completedTodo={completeTodo}
            deleteTodoItem={deleteTodoItem}
            didUpdteTodoItem={didUpdteTodoItem}
          />
        )}
        ItemSeparatorComponent={(_: Todo_Item) => (
          <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />
        )}
      />
    </View>
  );
};

type TodoItemProps = {
  todo: Todo_Item;
  didSelectTodo: (todo: Todo_Item) => void;
  didUpdteTodoItem: (todo: Todo_Item) => void;
  completedTodo: (todo: Todo_Item) => void;
  deleteTodoItem: (todo: Todo_Item) => void;
};

const TodoItem = (props: TodoItemProps) => {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: 45,
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      }}
      onPress={() => {
        props.didSelectTodo(props.todo);
      }}>
      <View style={{ justifyContent: 'center', width: '50%' }}>
        <Text
          style={{
            fontSize: 16,
            textDecorationLine: props.todo.completed
              ? 'line-through'
              : undefined,
            textDecorationStyle: 'solid',
          }}>
          {' '}
          {props.todo.text}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={() => {
          props.completedTodo(props.todo);
        }}>
        <Text style={{ color: 'white' }}> Done </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={() => {
          props.didSelectTodo(props.todo);
        }}>
        <Text style={{ color: 'white' }}> {t('homescreen.update')} </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={() => {
          props.deleteTodoItem(props.todo);
        }}>
        <Text style={{ color: 'white' }}> {t('homescreen.delete')} </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default HomeScreen;
