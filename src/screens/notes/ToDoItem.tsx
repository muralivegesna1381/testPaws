import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ToDoItem } from "./models";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "./../../styles/commonstyles";
import fonts from "./../../fonts/fonts";
import DownArrow from "../../../assets/svgs/down_arrow.svg";
import TickIcon from "../../../assets/svgs/tick.svg";
import TrashIcon from "../../../assets/svgs/notes_delete.svg";
import EditIcon from "../../../assets/svgs/edit_icon_small.svg";
import UnResolvedIcon from "../../../assets/svgs/unresolved.svg";


import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { showToast } from "../../components/custom.toast.message";


export const ToDoItemComponent: React.FC<{
  todo: ToDoItem;
  editingId: number | null;
  deleteItem: Function;
  editItem: Function
  updateStatus: Function
}> = ({ todo: { id, value, date, status }, editingId, deleteItem, editItem, updateStatus }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.todoContainer]}>
      <LinearGradient
        colors={["#A0D7D9", "#EFF9EA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: wp('72%'),
          backgroundColor: "#b3effb",
          borderRadius: 10, borderColor: editingId === id ? '#FF6F0C' : 'transparent', borderWidth: 1
        }}
      >
        <TouchableOpacity onPress={toggleExpand} style={styles.header}>
          <Text style={status === 'R' ? styles.textStyleBold : CommonStyles.textStyleBold}>Notes on {date}</Text>
          <DownArrow style={[styles.downArrow, { transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]} />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.content}>
            <Text style={status === 'R' ? styles.textStyleStrike : CommonStyles.textStyleRegular}>{value}</Text>
            {status === 'R' ? null : <TouchableOpacity
              style={{
                alignSelf: 'flex-end'
              }}
              onPress={() => {
                editItem(id)

              }}
            >
              <EditIcon />
            </TouchableOpacity>}
          </View>
        )}
      </LinearGradient>

      <View style={styles.todoTextContainer}>
        {status === 'P' ? <TouchableOpacity
          onPress={() => {
            updateStatus(id, 'R')
          }}
        >
          <TickIcon style={styles.imageStyle} />
        </TouchableOpacity> : null}
        {status === 'R' ?
          <>
            <TouchableOpacity
              onPress={() => {
                updateStatus(id, 'P')
              }}
            >
              <UnResolvedIcon style={styles.imageStyle} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to delete the note?",
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
                        deleteItem(id);
                      },
                    },
                  ],
                  { cancelable: false }
                );


              }}
            >
              <TrashIcon style={styles.imageStyle} />
            </TouchableOpacity>
          </>
          : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  todoContainer: {
    marginTop: hp("2%"),
    marginLeft: wp("7.5%"),
    marginRight: wp("5%"),
    minHeight: hp("6%"),
    width: wp("85%"),
    overflow: "hidden",
    flexDirection: "row",
    borderRadius: 10,
  },
  todoTextContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  sectionTitle: {
    fontSize: 20,
  },

  container: {
    backgroundColor: "#f0f0f0",
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    padding: 10,
    //backgroundColor: "#d3d3d3",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 10,
  },
  downArrow: {
    position: "absolute",
    right: 10,
    marginTop: hp("2%"),
  },
  imageStyle: {
    // marginLeft: wp("1%"),
    //marginRight: wp("1%"),
  },
  textStyleStrike: {
    fontFamily: "Lexend-Regular",
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'

  },
  textStyleBold: {
    fontFamily: "Lexend-Bold",
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
});
