import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
} from "react-native";
import { Act, BinaryResult, NumericResult, Result, ScaleList, ScaleResult, Unit } from "../model/act_save_object_model";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../styles/commonstyles";
import Colors from "../styles/color";
import DownArrow from "../../assets/svgs/down_arrow.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AnimalResponse } from "../model/schedule_animals";
import DropDownPicker from 'react-native-dropdown-picker';
import { RadioButton, Button, Card } from 'react-native-paper';
import { ACT_SCALE_TYPES } from "../utils";
import { Dropdown } from 'react-native-element-dropdown';
import _ from "lodash"
import MeasurementPageStyles from "../styles/measurments.page.style";


type DropDownItmes = {
  "label": string,
  "value": string,
  "default": boolean
}
type SelectionProps = {
  type: string,
  scaleObject: any,
  actResult: Act,
  actId: number,
  updateActComment: (text: string) => void;
  onCommentBoxFocus: (isFocussed: boolean, content: string) => void;
  updateDVCRequest: (posion: number, actScaleTyle: ACT_SCALE_TYPES) => void;
  updateActComment: (text: string) => void;
  onReulstUpdateCallback: (val: any, posion: number, actScaleTyle: ACT_SCALE_TYPES) => void;
}
const ACTScaleTypeComponent: React.FC<SelectionProps> = (props) => {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [items, setItems] = useState<DropDownItmes[]>([]);
  const [scaleSelectedValue, set_scaleSelectedValue] = useState("");
  const [toggleWeightType, set_toggleWeightType] = useState<Boolean>(false);
  //const [checked, setChecked] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [updateScalList, setUpdatedScaleList] = useState<ScaleResult[]>([]);
  //const [buttonStyleLeft, set_buttonStyleLeft] = useState(styles.binaryButton);
  //const [buttonStyleRight, set_buttonStyleRight] = useState(styles.binaryButton);

  const [binarySelecteValue, set_BinarySelectedValue] = useState(-1);
  useEffect(() => {
    //updateWeightUnits();
    prepareScaleData();
  }, []);

  type ResultProps = {
    result: ScaleList,
    selectedId: number,
    onCallback: (scaleValue: ScaleList) => void;
  }
  const ResultItem: React.FC<ResultProps> = (props) => {
    {
      return (
        <Pressable onPress={() => {
          props.result.isDefault = props.result.isDefault == 0 ? 1 : 0;
          //set_scaleSelectedValue(props.result.scaleValue);
          //callback trigger
          props.onCallback(props.result)
        }} style={styles.item} >
          <LinearGradient
            colors={props.result.isDefault === 1 ? ["#FFB186", "#FFB186"] : ["#A0D7D9", "#A0D7D9"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.innerContainer}
          >
            <Text style={styles.name}>{props.result.scaleValue}</Text>
          </LinearGradient>
        </Pressable>
      );
    }
  };

  const prepareScaleData = () => {
    if (props.actResult?.results[0]?.scaleResults.length > 0) {
      ///Need to show only manderoty scale first

      const firstList = props.actResult?.results[0]?.scaleResults.filter((item) => item?.isAdded === true || item.mandatory === true);

      ///If nothing is mandetory selecting first one.
      if (firstList?.length === 0) {
        if (props.actResult.results[0].scaleResults[0])
          props.actResult.results[0].scaleResults[0].isAdded = true;
        firstList.push(props.actResult?.results[0]?.scaleResults[0]);
      }
      setUpdatedScaleList(firstList);
    }
  }
  const updateWeightUnits = () => {
    let actResultr: Act = props.actResult;
    setPreviousValue(actResultr?.results[0]?.numericResults[0]?.resultValue);
    const unitsList: DropDownItmes[] = actResultr?.results[0]?.numericResults[0]?.units.map((unit) => {
      setValue(unit.unitName);
      return {
        label: unit.unitName,
        value: `${unit.unitId}`,
        default: unit.default
      } as DropDownItmes
    })

    setItems(unitsList);
  }

  const getWeightUnits = (units: Unit[]) => {
    const unitsList: DropDownItmes[] = units?.map((unit) => {
      return {
        label: unit.unitName,
        value: `${unit.unitId}`,
        default: unit.default
      } as DropDownItmes
    });
    return unitsList;
  }
  const handleChange = (result: any, index: number, actScaleTyle: ACT_SCALE_TYPES) => {
    // setTimeout(() => {
    props.onReulstUpdateCallback(result, index, actScaleTyle);
    // }, 500);
  }

  /**
   * 
   * @param numericResults NumericResult
   * @param index index
   * @param units DropDown Items
   * @returns Numeric type View
   */
  const numericWidget = (numericResults: NumericResult, index: number, units: DropDownItmes[]) => {

    //Default value added for dropdown,
    let selectUnit = units.find(item => item.default == true)
    if (selectUnit) {
      numericResults.unitName = selectUnit?.label;
      numericResults.unitId = Number(selectUnit?.value);
    }

    return (
      <View>
        {numericResults.idealBodyWeight !== null ? <Text style={styles.textBlue}>Ideal - {numericResults.idealBodyWeight}</Text> : null}

        <Text style={styles.textBlack}>{numericResults.resultName}</Text>
        <View style={styles.textContainerStyle}>
          <View style={styles.background}>
            <TextInput
              key={numericResults.numericResultId}
              style={styles.textInputStyle}
              inputMode={numericResults.noOfDecimals > 0 ? "decimal" : "numeric"}
              // keyboardType="decimal-pad"
              value={numericResults.resultValue}
              //maxLength={numericResults.noOfDecimals}
              onChangeText={(text) => {
                //setPreviousValue(text);
                numericResults.resultValue = text;
                if (props.actResult.results[0])
                  props.actResult.results[0].numericResults[index].resultValue = text;
                handleChange(numericResults, index, ACT_SCALE_TYPES.NUMERIC);
                setPreviousValue(text);//To update UI

              }}
            // value={}
            // placeholder={}
            />
          </View>
          <View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={units}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={numericResults.unitName}
              value={selectUnit}
              onChange={item => {
                //setValue(item.value);
                let name = units.find((it) => it.value === item.value);
                if (name) {
                  numericResults.unitName = name?.label;
                  numericResults.unitId = Number(name?.value);
                }
                handleChange(numericResults, index, ACT_SCALE_TYPES.NUMERIC);
                if (props.actResult.results[0])
                  props.actResult.results[0].numericResults[index] = numericResults;
              }}

            />

          </View>
        </View>
        <Text style={styles.textRed}>{numericResults?.previousValue !== 'null ' ? numericResults?.previousValue : ''}</Text>
        <View style={MeasurementPageStyles.centerView}>
          <Pressable
            style={MeasurementPageStyles.buttonDeselected}
            onPress={() => { props.updateDVCRequest(index, ACT_SCALE_TYPES.NUMERIC) }}
          >
            {numericResults?.dvc?.length > 0 ? <Text style={MeasurementPageStyles.dvctext}>{numericResults.dvc}</Text> : null}
            {numericResults.dvc ? <Text style={MeasurementPageStyles.text}>DVC</Text> : <Text style={MeasurementPageStyles.text}>+ Update DVC</Text>}
          </Pressable>


        </View>
        <Divider />
      </View>);
  }

  const scaleListMainWidget = (scaleResults: ScaleResult[], actId: any) => {
    ///Need to show only manderoty scale first
    return (
      <>
        {updateScalList.map((item, index) => scaleItem(item, index, actId))}
        {updateScalList.length < scaleResults.length ? <Pressable style={styles.buttonSelected}
          onPress={() => {
            let temp = [...updateScalList];
            if (temp.length <= scaleResults.length) {
              let obj = scaleResults[temp.length];
              obj.isAdded = true;
              temp.push(obj);
              setUpdatedScaleList(temp)
            } 
          }}>
          <Text style={styles.textWhite}> + Add more</Text>
        </Pressable> : null}

        <Divider />
      </>
    );
  }
  const CommentView = () => {
    return (<><TextInput
      style={MeasurementPageStyles.CommentsInput}
      placeholder="Comments"
      placeholderTextColor="#000"
      autoCapitalize="sentences"
      returnKeyType='done'
      blurOnSubmit={true}
      numberOfLines={3}
      multiline={true}
      value={props.actResult?.results[0].comments}
      onChangeText={(text) => {
        props.updateActComment(text)
        props.onCommentBoxFocus(true, text)
      }}
      maxLength={4000}
    /></>);
  }
  const Divider = () => {
    return (<View
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: hp('1%'),
        marginBottom: hp('1%'),

      }}
    />);
  }
  const scaleItem = (scaleResults: ScaleResult, index: number, actId: any) => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textBlack}>{scaleResults.resultName}</Text>

        {
          scaleResults.scaleList?.map((item, index1) => {
            return <ResultItem result={item} selectedId={scaleResults.scaleResultId}
              onCallback={function (scaleObj: ScaleList): void {
                scaleResults.scaleList.map((item) => {
                  if (item.scaleId === scaleObj.scaleId) {
                    item.isDefault = 1;
                  } else {
                    item.isDefault = 0;
                  }
                });
                //scaleResults.isDefault = props.result.isDefault == 0 ? 1 : 0;
                scaleResults.resultValue = scaleObj.scaleId;
                scaleResults.scaleResultId = scaleObj.scaleId;
                //scaleResults.previousValue = scaleObj.scaleValue;
                //TODO change the DVC value and remove the hardcode act value
                if (actId == 57 || actId == 2032) {
                  if (scaleObj.scaleValue === "0")
                    scaleResults.dvc = "QNS";
                  else {
                    scaleResults.dvc = "";
                  }
                }
                if (scaleResults)
                  scaleResults.selectedValue = scaleObj.scaleValue
                set_scaleSelectedValue(scaleObj.scaleValue)
                handleChange(scaleResults, index, ACT_SCALE_TYPES.SCALE);
              }} />;
          })
        }
        {/* <FlatList
          data={scaleResults.scaleList}
          renderItem={({ item }) => <ResultItem result={item} selectedId={scaleResults.scaleResultId}
            onCallback={function (scaleObj: ScaleList): void {
              // scaleResults.scaleResultId = scaleObj.scaleId;
              // scaleResults.resultValue = scaleObj.scaleId;
              // if (scaleResults)
              //   scaleResults.selectedValue = scaleObj.scaleValue
              // set_scaleSelectedValue(scaleObj.scaleValue)
               handleChange(scaleObj, index, ACT_SCALE_TYPES.SCALE);
            }} />}
          keyExtractor={(item) => item.scaleId.toString()}
        /> */}
        {scaleResults.previousValue != undefined ? <Text style={styles.textRed}>{scaleResults.previousValue}</Text> : null}
        <View style={MeasurementPageStyles.centerView}>
          <Pressable
            style={styles.buttonDeselected}
            onPress={() => { props.updateDVCRequest(index, ACT_SCALE_TYPES.SCALE) }}
          >
            {/* <Text style={MeasurementPageStyles.text}>+ Update DVC</Text>
            {scaleResults.dvc ? <Text style={MeasurementPageStyles.dvctext}>{scaleResults.dvc}</Text> : null} */}
            {scaleResults?.dvc ? <Text style={MeasurementPageStyles.dvctext}>{scaleResults.dvc}</Text> : null}
            {scaleResults.dvc ? <Text style={MeasurementPageStyles.text}>DVC</Text> : <Text style={MeasurementPageStyles.text}>+ Update DVC</Text>}
          </Pressable>


        </View>
      </SafeAreaView>
    );
  }

  const binaryWidget = (binaryResults: BinaryResult, index: number) => {

    return (
      <View>
        <Text style={styles.textBlueHeader}>{binaryResults.resultName}</Text>

        <View style={styles.radioContainerStyle}>
          <Pressable onPress={() => {
            if (props.actResult.results[0])
              props.actResult.results[0].binaryResults[index].resultValue = binaryResults.firstOptionId;
            binaryResults.resultValue = binaryResults.firstOptionId;
            // binaryResults.previousValue = binaryResults.firstOptionValue;
            set_BinarySelectedValue(binaryResults.resultValue);
            handleChange(binaryResults, index, ACT_SCALE_TYPES.BINARY);
          }} style={binaryResults.resultValue === binaryResults.firstOptionId ? styles.binaryButtonSelected : styles.binaryButton} ><Text style={styles.textBlack}>{binaryResults.firstOptionValue}</Text></Pressable>
          <Pressable onPress={() => {
            if (props.actResult.results[0])
              props.actResult.results[0].binaryResults[index].resultValue = binaryResults.secondOptionId;
            binaryResults.resultValue = binaryResults.secondOptionId;
            // binaryResults.previousValue = binaryResults.secondOptionValue;
            set_BinarySelectedValue(binaryResults.resultValue);
            handleChange(binaryResults, index, ACT_SCALE_TYPES.BINARY);
          }} style={binaryResults.resultValue === binaryResults.secondOptionId ? styles.binaryButtonSelected : styles.binaryButton} ><Text style={styles.textBlack}>{binaryResults.secondOptionValue}</Text></Pressable>
        </View>
        {binaryResults.previousValue != undefined ? <Text style={styles.textRed}>{binaryResults.previousValue}</Text> : null}
        <View style={MeasurementPageStyles.centerView}>
          <Pressable
            style={styles.buttonDeselected}
            onPress={() => { props.updateDVCRequest(index, ACT_SCALE_TYPES.BINARY) }}
          >
            {/* <Text style={MeasurementPageStyles.text}>+ Update DVC</Text>
            {scaleResults.dvc ? <Text style={MeasurementPageStyles.dvctext}>{scaleResults.dvc}</Text> : null} */}
            {binaryResults.dvc ? <Text style={MeasurementPageStyles.dvctext}>{binaryResults.dvc}</Text> : null}
            {binaryResults.dvc ? <Text style={MeasurementPageStyles.text}>DVC</Text> : <Text style={MeasurementPageStyles.text}>+ Update DVC</Text>}
          </Pressable>


        </View>
        <Divider />
      </View>
    );
  }

  let actResultr: Act = props.actResult;
  var result = Object.keys(actResultr?.results[0]);


  const rederItem = (key: string) => {

    if (key === "scaleResults") {
      return actResultr?.results[0]?.scaleResults.length > 0 ? scaleListMainWidget(actResultr?.results[0]?.scaleResults, actResultr?.actId) : null
    }
    else if (key === "binaryResults") {
      return actResultr?.results[0]?.binaryResults?.map((result, index) => binaryWidget(result, index)) ?? null
    } else if (key === "numericResults") {
      return actResultr?.results[0]?.numericResults?.map((result, index) => numericWidget(result, index, getWeightUnits(result.units))) ?? null
    } else if (key === "comments") {

      return CommentView()
    }

  }

  return (<>
    <View
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 5

      }}
    />
    {/* {result.map((item) => rederItem(item)

    )} */}
    <FlatList data={result} renderItem={({ item }) => rederItem(item)} keyExtractor={(item) => item.toString()} />
  </>);
  // return (
  //   <>
  //     {
  //       actResultr?.results[0]?.numericResults?.map((result, index) => numericWidget(result, index, getWeightUnits(result.units))) ?? null
  //     }
  //     {actResultr?.results[0]?.scaleResults.length > 0 ? Divider() : null}
  //     {
  //       //actResultr?.results[0]?.scaleResults?.map((result) => scaleWidget(result)) ?? null
  //       actResultr?.results[0]?.scaleResults.length > 0 ? scaleListMainWidget(actResultr?.results[0]?.scaleResults, actResultr?.actId) : null
  //     }
  //     {actResultr?.results[0]?.binaryResults.length > 0 ? Divider() : null}
  //     {
  //       actResultr?.results[0]?.binaryResults?.map((result, index) => binaryWidget(result, index)) ?? null
  //     }
  //     {
  //       CommentView()
  //     }
  //   </>
  // );



};

// Define styles
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: wp("85%"),
    justifyContent: 'center',
    alignSelf: "center",
  },
  radioContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center"
  },
  textBlue: {
    fontSize: fonts.fontXSmall,
    fontFamily: fontFamily.semibold,
    color: Colors.APP_BLUE,
  },
  textBlueHeader: {
    fontSize: fonts.fontMedium,
    fontFamily: fontFamily.semibold,
    color: Colors.BLACK,
    marginTop: hp('1%')
  },
  textBlack: {
    fontSize: fonts.fontXSmall,
    fontFamily: fontFamily.semibold,
    color: Colors.BLACK,
    marginBottom: hp("1%"),
    marginTop: hp("1%")
  },
  textRed: {
    fontSize: fonts.fontXMedium,
    fontFamily: fontFamily.semibold,
    color: Colors.RED,
    alignSelf: "center",
    marginTop: hp("1%"),
    //marginBottom: hp('1%')
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: hp("4%"),
    marginTop: hp("0.2%"),
    borderWidth: 0.3
  },
  textContainerStyle: {
    backgroundColor: "#FFFFFF",
    marginTop: wp('1%'),
    borderRadius: 10,
    flexDirection: "row",
    width: wp("85%"),
  },
  background: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    flex: 1,
  },
  dropDownBackground: {
    backgroundColor: "#C3CFD6",
    borderRadius: 5,
    width: wp("20%"),
    position: "absolute",
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  textInputStyle: {
    padding: 5,
    alignContent: 'center',
    backgroundColor: "transparent",
    borderColor: "transparent",
    fontFamily: fontFamily.regular,


  },
  item: {
    // padding: 5,
    marginBottom: wp("1%")
  },
  name: {
    fontSize: fonts.fontXMedium,
    fontWeight: "bold",
  },
  dropDownImage: {
    height: hp("4%"),
    width: wp("20%"),
    backgroundColor: "#C3CFD6",
    alignItems: "center",
    // alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
  },
  dropdown: {
    width: wp("22%"),
    borderColor: '#dcdcdc',
    borderWidth: 1,
    backgroundColor: "rgba(234, 234, 234, 1)",
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: hp("0.25%"),
    marginRight: wp("0.55%"),
    padding: 1
  },
  dropdownContainer: {
    width: 100,
  },
  dropdownText: {
    fontSize: 12,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 8
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textWhite: {
    textAlign: "center",
    color: "white",
    fontSize: fonts.fontXSmall,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.75%"),
    fontFamily: "Lexend-Regular",
  },
  buttonSelected: {
    backgroundColor: "#136DA3",
    width: wp("85%"),
    height: hp("4%"),
    borderRadius: 5,
    marginTop: hp("1%"),
  },
  buttonDeselected: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: wp("85%"),
    height: hp("4%"),
    borderRadius: 5,
    marginTop: hp("1%"),
    justifyContent: "space-evenly",
  },

  binaryButton: {
    backgroundColor: "rgba(19, 109, 165, 0.2)",
    width: wp("42%"),
    height: hp("4%"),
    borderRadius: 5,
    marginTop: hp("1%"),
    marginLeft: wp("1%"),
    justifyContent: "center",
    alignItems: "center"
  },
  binaryButtonSelected: {
    backgroundColor: "rgba(255, 178, 135, 1)",
    width: wp("42%"),
    height: hp("4%"),
    borderRadius: 5,
    marginTop: hp("1%"),
    marginLeft: wp("1%"),
    justifyContent: "center",
    alignItems: "center"
  },
});

export default ACTScaleTypeComponent;
