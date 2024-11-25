import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import _ from 'lodash'
import loadBowlDetailstyles from '../styles/load.bowl.details.style'

const NewFeatureScreen = () => {
    const [isViewOpened, setViewOpened] = useState(true)
    const [focusedInputIndex, setFocusedInputIndex] = useState(0)
    const bowlTextInputRef = useRef<TextInput>(null);
    const feederTextInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (bowlTextInputRef.current && focusedInputIndex == 0) {
            bowlTextInputRef.current.focus()
        }
    }, [bowlTextInputRef.current])
    useEffect(() => {
        if (feederTextInputRef.current && focusedInputIndex == 1) {
            feederTextInputRef.current.focus()
        }

    }, [feederTextInputRef.current])

    return (
        <>
            {isViewOpened ? <View style={{ flex: 1, backgroundColor: 'green', alignItems: 'center' }}>
                <Text onPress={() => setViewOpened(false)}>Hello</Text>
            </View> :
                <View style={{ flex: 1, backgroundColor: 'red', alignItems: 'center' }}>
                    <Text onPress={() => setViewOpened(true)}>Hello</Text>
                    <TextInput
                        ref={bowlTextInputRef}
                        style={[loadBowlDetailstyles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 15, }]}
                        maxLength={10}
                        onSubmitEditing={() => {
                            setFocusedInputIndex(1)
                        }} // <=== here
                        placeholder={'Scan Cage ID'}
                    //autoFocus={focusedInputIndex == 0 ? true : false}
                    />

                    <TextInput
                        ref={feederTextInputRef}
                        style={[loadBowlDetailstyles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 15, }]}
                        maxLength={10}
                        returnKeyType={'done'}
                        placeholder={"Scan Feeder ID"}
                    //autoFocus={focusedInputIndex == 1 ? true : false}
                    />

                    <Text onPress={() => setFocusedInputIndex(0)}>press 1</Text>
                    <Text onPress={() => setFocusedInputIndex(1)}>press 2</Text>

                </View>
            }
        </>
    )
}

export default NewFeatureScreen