import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import loadBowlDetailstyles from '../../styles/load.bowl.details.style';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

type CameraProps = {
    title: 'Scan Bowl Id' | 'Scan Cage ID' | 'Scan Feeder ID';
    cancelCallback: () => void;
    onBarCodeRead: (scanResult: any) => void;
}

const CameraView = ({ title, cancelCallback, onBarCodeRead }: CameraProps) => {

    return (
        <View style={[loadBowlDetailstyles.container, { backgroundColor: 'black', height: hp('100%') }]}>
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                    <RNCamera
                        style={[loadBowlDetailstyles.camera,]}
                        onBarCodeRead={(scannedObj) => {
                            onBarCodeRead(scannedObj)
                        }}
                        captureAudio={false}
                    >
                        <BarcodeMask width={300} height={250} />

                    </RNCamera >
                </View>
                <View style={[loadBowlDetailstyles.bottomOverlay]}>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}></View>
                    <View style={{ width: wp('100%') }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 22,
                            textAlign: 'center',
                            width: wp('100%')
                        }}>{title}</Text>
                        {/* selectedBarCodeType == BarCodeTypes.BowlBarCode ? 'Scan Bowl Id' : (bowlDetailsObj != null && bowlDetailsObj.IS_FEEDER == 0) ? 'Scan Cage ID' : "Scan Feeder ID" */}
                        <View style={{}}>
                            <TouchableOpacity
                                style={{
                                }}
                                onPress={() => {
                                    cancelCallback()
                                    // if (selectedCategory == Categories.ScanBowl) {
                                    //     set_SelectedBarCodeType(BarCodeTypes.BowlBarCode);
                                    //     bowlTextInputRef.current?.focus();
                                    // } else {
                                    //     if (bowlDetailsObj == null) {
                                    //         set_SelectedBarCodeType(BarCodeTypes.BowlBarCode);
                                    //         bowlTextInputRef.current?.focus();
                                    //     } else {
                                    //         feederTextInputRef.current?.focus();
                                    //         set_SelectedBarCodeType(BarCodeTypes.FeederBarCode);
                                    //     }
                                    // }
                                    // setOpenScanner(false);
                                }}>
                                <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 20 }}>

                                    <Text style={{
                                        color: 'white',
                                        fontSize: 22,
                                        textAlign: 'left'
                                    }}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </View>
        </View >
    )
}

export default CameraView;