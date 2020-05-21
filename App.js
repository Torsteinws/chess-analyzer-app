/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';
import Header from "./components/Header"
import ChessBoard from "./components/ChessBoard"


const App = ()  => {

	return (
		<View style={style.appContainer}>
			<Header style={style.header} text="Chess analyzer"/>
			<ChessBoard style={style.chessBoard}/>
		</View>
		
	);
};

const style = StyleSheet.create({
	header: {
		height: 100
	},
	appContainer: {
		flex: 1,
		flexGrow: 1,
		flexDirection: "column",
	},
	chessBoard: {
		margin: 10
	}
})

export default App;
