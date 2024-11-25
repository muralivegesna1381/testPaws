import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ToDoItemComponent } from "./ToDoItem";
import { ToDoItem } from "./models";
import {
  getDBConnection,
  getTodoItems,
  saveTodoItems,
  createTable,
  //clearTable,
  deleteTodoItem,
  editTodoItems
} from "./db-service";
import Voice from "@react-native-voice/voice";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import RecordIcon from "../../../assets/svgs/record.svg";
import fonts from "./../../fonts/fonts";
import DownArrow from "../../../assets/svgs/down_arrow.svg";
import TickIcon from "../../../assets/svgs/tick.svg";
import TrashIcon from "../../../assets/svgs/trash.svg";
import SaveIcon from "./../../../assets/svgs/save.svg";
import CommonStyles from "./../../styles/commonstyles";
import HeaderComponent from "./../../components/headerComponent";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToast } from "../../components/custom.toast.message";
import { HomeStackParamList } from "../../navigation/types";
import AlertComponent from "../../components/alert.component";
import CloseText from "./../../../assets/svgs/close_text.svg";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

type NoteScreenProps = NativeStackScreenProps<HomeStackParamList, "NotesScreen">;

const NotesScreen = (props: NoteScreenProps) => {

  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [date, setDate] = useState("");
  const [recognizedText, setRecognizedText] = useState<string>("");
  //const [isListening, setIsListening] = useState<boolean>(false);
  const [status, set_Status] = useState("P");
  const [editingId, setEditingId] = useState<number | null>(null)
  const [todaysNotesCount, setTodaysNotesCount] = useState<number>(0)
  var currentDate = moment(new Date()).format("MM-DD-YYYY");
  let inputTextBeforeVoice = useRef<string>('')
  let isListening = useRef<boolean>(false)
  let afterVoiceStopResultCallCount = useRef<number>(0)




  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedTodoItems = await getTodoItems(db);
      if (storedTodoItems.length) setTodos(storedTodoItems);
      let isHavingTodaysNote = false;
      let currentIndex = 0;
      storedTodoItems.map(item => {
        if (item.date.includes(currentDate)) {
          isHavingTodaysNote = true
          if (item.date[item.date.length - 1] === ')') {
            const lastIndex = item.date.lastIndexOf('(')
            //const index = item.date[item.date.length - 2]


            const index = item.date.substring(lastIndex + 1, item.date.length - 1)

            currentIndex = currentIndex > Number(index) ? currentIndex : Number(index)
          }
        }
        return item;
      })


      if (isHavingTodaysNote) {
        currentIndex++

        setTodaysNotesCount(currentIndex)
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    loadDataCallback();
    setDate(currentDate);
  }, [loadDataCallback]);

  useEffect(() => {
    // Add event listeners when the component mounts
    firebaseHelper.reportScreen(firebaseHelper.Screen_Notes);
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Cleanup event listeners when the component unmounts
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    //setRecognizedText("");
    //setIsListening(true);
    isListening.current = true
    try {
      await Voice.start("en-US"); // Change to your desired language
    } catch (e) {
      console.error(e);
    }
  };
  const stopListening = async () => {
    // setIsListening(false);
    isListening.current = false
    afterVoiceStopResultCallCount.current = 0
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  const onSpeechStart = () => {
    //speech started
  };

  const onSpeechEnd = () => {
    // setIsListening(false);
    isListening.current = false
    inputTextBeforeVoice.current = ''

  };

  const onSpeechResults = (e: any) => {

    if (isListening.current === false) {
      afterVoiceStopResultCallCount.current = afterVoiceStopResultCallCount.current + 1
      if (afterVoiceStopResultCallCount.current > 1) {
        afterVoiceStopResultCallCount.current = 0
        stopListening()
      }
      return
    }


    if (e.value && e.value.length > 0) {
      let previousText = `${inputTextBeforeVoice.current} ${e.value[0]}`;
      setRecognizedText(previousText);
    }
  };

  const onSpeechError = (e: any) => {
    console.error("Speech error:", e.error);
  };



  const addTodo = async () => {
    if (!recognizedText.trim()) return;
    try {
      stopListening();
      let updatedText = recognizedText.replaceAll("'", "’");
      const count = todaysNotesCount > 0 ? `(${todaysNotesCount})` : ''
      const newTodos = [
        //...todos,
        {
          value: updatedText,
          date: `${date} ${count}`,
          status: status,
        },
      ];
      const db = await getDBConnection();
      var sample = await saveTodoItems(db, newTodos);

      if (sample[0].rowsAffected > 0) {
        const newToDoObjVal = [
          {
            value: recognizedText,
            date: `${date} ${count}`,
            status: status,
            id: sample[0].insertId,
          },
          ...todos,
        ];

        setTodaysNotesCount(todaysNotesCount + 1)
        setTodos(newToDoObjVal);
        showToast("Note saved successfully!", "success");

      }

      setNewTodo("");
      setRecognizedText("");
    } catch (error) {
      console.error("vinay", error);
    }
  };
  const deleteItem = async (id: number) => {
    try {
      firebaseHelper.logEvent(firebaseHelper.Event_Delete_Notes, firebaseHelper.Screen_Notes, "");
      const db = await getDBConnection();
      const res = await deleteTodoItem(db, id);
      showToast("Note is deleted successfully!", "success");
      if (res[0].rowsAffected > 0) {
        const storedTodoItems = await getTodoItems(db);
        setTodos(storedTodoItems);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateItem = async () => {
    const editingItem = todos.filter(item => {
      return item.id === editingId
    })

    editingItem[0].value = recognizedText.replaceAll("'", "’")
    try {
      const db = await getDBConnection();
      const res = await editTodoItems(db, editingItem);
      showToast("Note is updated successfully!", "success");
      if (res[0].rowsAffected > 0) {
        const storedTodoItems = await getTodoItems(db);
        setTodos(storedTodoItems);
        setRecognizedText('')
        setEditingId(null)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const editItem = async (id: number) => {
    const editingItem = todos.filter(item => {
      return item.id === id
    })

    setRecognizedText(editingItem[0].value);
    setEditingId(id)
  };

  const updateStatus = async (id: number, status: string) => {
    const editingItem = todos.filter(item => {
      return item.id === id
    })
    editingItem[0].status = status
    try {
      const db = await getDBConnection();
      const res = await editTodoItems(db, editingItem);
      if (res[0].rowsAffected > 0) {
        const storedTodoItems = await getTodoItems(db);
        setTodos(storedTodoItems);
        if (status === 'P') {
          showToast("Note marked as unresolved successfully!", "success");
        } else {
          showToast("Note resolved successfully!", "success");
        }


      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <LinearGradient
      colors={["#F1F9E8", "#ACEEFE"]}
      style={{ flex: 1 }}>

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <HeaderComponent
          navigation={undefined}
          route={undefined}
          moduleName={"Notes"}
          headerColor={"#FFF"}
          isCustomNav={true}
          backBtnAction={() => {
            if (recognizedText === '') {
              navigation.goBack();
            }
            else {
              Alert.alert(
                "Do you want to discard saving this note ?",
                "",
                [
                  {
                    text: "No",
                    onPress: () => {
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      navigation.goBack()
                    },
                  },
                ],
                { cancelable: false }
              );
            }

          }}
        />

        <View style={[CommonStyles.textInputContainerStyleBig]}>
          <TextInput
            style={CommonStyles.textInputStyleBigNotes}
            placeholder="Notes"
            placeholderTextColor="#000"
            autoCapitalize="sentences"
            autoFocus={true}
            value={recognizedText}
            onChangeText={(text) => {
              setRecognizedText(text);
            }}
            maxLength={500}
            multiline={true}
          />
          <Pressable
            style={{
              margin: wp("2%"),
              bottom: 0,
              left: 0,
              position: "absolute",
            }}
            onPressIn={() => {
              inputTextBeforeVoice.current = recognizedText
              startListening();
            }
            }
            onPressOut={() => {

              stopListening();
            }}
          >

            <RecordIcon />
          </Pressable>


          <View style={{
            marginRight: wp("1%"),
            bottom: 0,
            right: 0,
            position: "absolute",
            flexDirection: 'row'
          }}>

            <Pressable onPress={() => {
              setEditingId(null)
              setRecognizedText("")
            }}>
              <CloseText />
            </Pressable>

            <View style={{ width: 5 }} />
            <TouchableOpacity

              onPress={() => {
                // Keyboard.dismiss()
                firebaseHelper.logEvent(firebaseHelper.Event_Notes_Submit, firebaseHelper.Screen_Notes, "");
                if (editingId !== null) {
                  updateItem()

                } else {
                  addTodo();
                }

              }}
            >
              <SaveIcon />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {todos.map((todo) => (
              <ToDoItemComponent
                key={todo.id}
                todo={todo}
                editingId={editingId}
                editItem={editItem}
                deleteItem={deleteItem}
                updateStatus={updateStatus}
              />
            ))}
          </ScrollView>
        </View>
      </View>


    </LinearGradient >
  );
};
const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: "800",
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "flex-end",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    margin: 10,
    backgroundColor: "pink",
  },
  container: {
    flex: 1,
    //alignContent: "center",
    //justifyContent: "center",
    // alignItems: "center",
  },
  mainView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
  item: {
    padding: 25,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("2%"),
    width: wp("80%"),
    minHeight: hp("8%"),
    borderRadius: 15,
  },
  itemDetails: {
    marginTop: hp("1%"),
  },
  arrowStyle: {
    marginTop: hp("1%"),
    marginLeft: wp("2%"),
  },
});
export default NotesScreen;