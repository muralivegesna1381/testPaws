import React from "react";
import 'react-redux';
import NetworkManager from "../network/network.manager";
import { Image, View } from "react-native";
import SuccessAlert from "./../../assets/svgs/SuccessAlert.svg";

type ImageProps = {
    animalId: number,
}
const ImageComponent: React.FC<ImageProps> = (props) => {
    NetworkManager.getImageByts(props.animalId).then((res) => {
        return <Image style={{
            width: 50,
            height: 50,
            marginRight: 10,
        }} source={SuccessAlert}></Image>
    });
    return <View />


}
export default ImageComponent;