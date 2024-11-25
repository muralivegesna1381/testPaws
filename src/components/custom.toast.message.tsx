import React from 'react'
import Toast, { ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message'
import Sound from 'react-native-sound';
import { Keyboard, Vibration } from 'react-native';

export const showToast = async (message: string, type: string) => {

    var sound = true;
    // type: "info" / "error" / "success"
    if (sound) {
        const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
            const vibrationPattern = [0, 500]; // [delay, vibrate, delay, vibrate]

            if (error) {
                console.error('Failed to load the sound', error);
            }
            Vibration.vibrate(vibrationPattern);

            beepSound.play((success) => {
                // if (success) {
                //     console.log('Sound played successfully');
                // } else {
                //     console.log('Sound playback failed');
                // }
            });

            Toast.show({
                position: 'bottom',
                type: type,
                visibilityTime: 5000,
                props: {
                    visibilityTime: 5000,
                },
                text1: message,
            })
        });
    } else {
        Toast.show({
            position: 'bottom',
            type: type,
            visibilityTime: 5000,
            props: {
                visibilityTime: 5000,
            },
            text1: message,
        })
    }

}



const CustomToast = () => {
    return (
        <Toast
            config={{
                success: (props) => (
                    <SuccessToast
                        {...props}
                        style={{ borderLeftWidth: 0 }}
                        contentContainerStyle={{ backgroundColor: '#D0FDD0' }}
                        text1NumberOfLines={2}
                        text1Style={{
                            color: '#1BBF18',
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: "Lexend-Regular",
                        }}
                    />
                ),
                error: (props) => (
                    <ErrorToast
                        {...props}
                        style={{ borderLeftWidth: 0 }}
                        contentContainerStyle={{ backgroundColor: '#FFD6BA' }}
                        text1NumberOfLines={2}
                        text1Style={{
                            color: '#FF6800',
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: "Lexend-Regular",
                        }}
                    />
                ),
                info: (props) => (
                    <InfoToast
                        {...props}
                        style={{ borderLeftWidth: 0 }}
                        contentContainerStyle={{ backgroundColor: '#FDF8D0' }}
                        text1NumberOfLines={2}
                        text1Style={{
                            color: '#A8A21F',
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: "Lexend-Regular",
                        }}
                    />
                ),
            }}
        />
    );
};

export default CustomToast;
