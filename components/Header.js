import React, { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
    ImagePropTypes,
} from 'react-native';

const Header = (props)  => {

	return (
		<View style={props.style}>
            <View style={style.container}>
    			<Text style={style.text}>{props.text}</Text>
            </View>
		</View>
		
	);
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(70,200,70)",
        borderBottomWidth: 5,
        borderBottomColor: "rgb(80, 80, 80)"
        
    },

    text: {
        color: "white",
        fontSize: 40
    }
})

export default Header;
