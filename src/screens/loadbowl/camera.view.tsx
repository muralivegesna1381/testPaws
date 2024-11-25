import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import loadBowlDetailstyles from '../../styles/load.bowl.details.style';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CommonStyles from '../../styles/commonstyles';

type CameraProps = {
    title: 'Scan Bowl Id' | 'Scan Cage ID' | 'Scan Feeder ID';
    cancelCallback: () => void;
    onBarCodeRead: (scanResult: any) => void;
}

const CameraView = ({ title, cancelCallback, onBarCodeRead }: CameraProps) => {
    // State to control whether scanning is enabled
    const [isScanning, setIsScanning] = useState(false);
    const cameraRef = useRef<RNCamera>()


    return (
        <View style={[loadBowlDetailstyles.container, { backgroundColor: 'black', height: hp('100%') }]}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                    <RNCamera

                        style={loadBowlDetailstyles.camera}
                        captureAudio={true}
                        onBarCodeRead={isScanning ? (scannedObj) => {
                            setIsScanning(false);
                            onBarCodeRead(scannedObj);

                        } : undefined}
                    >
                        <BarcodeMask edgeBorderWidth={7} edgeColor='white' width={300} height={200} edgeRadius={30} />
                    </RNCamera>
                    <View style={loadBowlDetailstyles.bottomOverlay}>
                        <View style={{ width: wp('100%') }}>
                            <Text style={[CommonStyles.textStyleRegular, {
                                color: 'white',
                                fontSize: 22,
                                textAlign: 'center',
                                width: wp('100%'),
                                marginTop: 20
                            }]}>
                                {title}
                            </Text>

                            {/* Start Scanning Button */}

                            <TouchableOpacity
                                disabled={isScanning}
                                style={{
                                    backgroundColor: isScanning ? 'grey' : '#136DA5',
                                    padding: 20,
                                    borderRadius: 30,
                                    alignSelf: 'center',
                                    marginTop: 50,
                                    width: wp('60%')
                                }}
                                onPress={() => setIsScanning(true)}
                            >
                                <Text style={[CommonStyles.textStyleRegular, { color: 'white', fontSize: 22, textAlign: 'center', }]}>
                                    Start Scan
                                </Text>
                            </TouchableOpacity>


                            {/* Cancel Button */}

                        </View>
                    </View>
                </View>


            </View>
            <View style={{ position: "absolute", bottom: 30, width: wp("95%") }}>
                <TouchableOpacity
                    style={{
                        marginTop: 10,
                    }}
                    onPress={() => {
                        cancelCallback();
                    }}
                >
                    <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 20 }}>
                        <Text style={[CommonStyles.textStyleRegular, {
                            color: 'white',
                            fontSize: 22,
                            textAlign: 'left',
                        }]}>
                            Cancel
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CameraView;
