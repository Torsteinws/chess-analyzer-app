import React, { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
    StatusBar,
    Dimensions
} from 'react-native';

const ChessBoard = (props)  => {

    let [piecePlacement, setPiecePlacement] = useState
    ([
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null]     
    ])

    return (
        <View style={props.style}>
            <View style={[ gridSizes.container, gridBorders.container]}>
                <Board squares={piecePlacement}/>
            </View>
        </View>
    );
};


const Board = ({squares}) => {
    
    return squares.map( (row, rowIndex) => (
        <View style={[gridSizes.row, gridBorders.row]}>
             {row.map( (col, colIndex) => (
                <View 
                    style={[
                        gridSizes.square, 
                        gridBorders.square,
                        (colIndex + rowIndex)% 2 == 0 ? bacgroundColor.even : bacgroundColor.odd
                    ]}>
                    <Text>
                        {/* {`(${rowIndex},${colIndex})`} */}
                    </Text>
                </View>
            ))}
        </View>
    ))
}

const bacgroundColor = StyleSheet.create({
    odd: {
        backgroundColor: "rgb(181,136,99)"
    },
    even: {
        backgroundColor: "rgb(240, 217, 181)"
    }
})

const gridSizes = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: "100%",
    },  
    row: {
        width: "100%",
        flexDirection: "row",
    },
    square: { 
        width: `${100/8}%`,
        aspectRatio: 1,
    }
})


const borderSize = StyleSheet.hairlineWidth
const borderColor = "rgb(50,50,50)"
const gridBorders = StyleSheet.create({
    container: {
        borderLeftWidth: borderSize,
        borderTopWidth: borderSize,
        borderColor: borderColor,
    },  
    row: {
        borderBottomWidth: borderSize,
        borderColor: borderColor
    },
    square: { 
        borderRightWidth: borderSize,
        borderColor: borderColor
    }
})

// This is no longer in use. 
// The function might be useful in the future, so I'll leave it be for now
const CalculateSquareSize = () => {
    const screenWidth = Math.round(Dimensions.get("window").width)
    const screenHeight = Math.round(Dimensions.get("window").height) 
    const squareWidthMax = Math.round(screenWidth / 8)
    const squareHeightMax = Math.round(screenHeight /8)

    const size = squareWidthMax < squareHeightMax ? squareWidthMax : squareHeightMax
    const runTimeStyle = StyleSheet.create({
        boardContainer: {
            // width: size*8,
            // height: size*8,
        },
        row: {
            // height: size,
        },
        square:{
            // maxWidth: size,
            // maxHeight: size,
        }
    })

    return runTimeStyle
}



export default ChessBoard;
