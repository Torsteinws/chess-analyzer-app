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
import Icon from "react-native-vector-icons/FontAwesome5"

const ChessBoard = (props)  => {

    let [piecePlacement, setPiecePlacement] = useState
    ([
        [ 
            <Rook   color="black"/>,
            <Knight color="black"/>,
            <Bishop color="black"/>,
            <Queen  color="black"/>,
            <King   color="black"/>,
            <Bishop color="black"/>,
            <Knight color="black"/>,
            <Rook   color="black"/>
        ], 
        [   
            <Pawn color="black"/>, 
            <Pawn color="black"/>, 
            <Pawn color="black"/>, 
            <Pawn color="black"/>, 
            <Pawn color="black"/>,
            <Pawn color="black"/>, 
            <Pawn color="black"/>, 
            <Pawn color="black"/>
        ], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [   
            <Pawn color="white"/>, 
            <Pawn color="white"/>, 
            <Pawn color="white"/>, 
            <Pawn color="white"/>, 
            <Pawn color="white"/>,
            <Pawn color="white"/>, 
            <Pawn color="white"/>, 
            <Pawn color="white"/>
        ], 
        [ 
            <Rook   color="white"/>,
            <Knight color="white"/>,
            <Bishop color="white"/>,
            <Queen  color="white"/>,
            <King   color="white"/>,
            <Bishop color="white"/>,
            <Knight color="white"/>,
            <Rook   color="white"/>
        ]     
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
                    {col}
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
        
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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

const pieceStyle = StyleSheet.create({
    rotate: {
        transform: [{rotateX: "180deg"}] 
    }
})

const Pawn = ({color}) => {
    return (
        <>
            <Icon name="chess-pawn" color={color} size={40}/>
        </>
    )
}

const Rook = ({color}) => {
    return (
        <>
            <Icon name="chess-rook" color={color} size={40}/>
        </>
    )
}

const Knight = ({color}) => {
    return (
        <>
            <Icon name="chess-knight" color={color} size={40}/>
        </>
    )
}

const Bishop = ({color}) => {
    return (
        <>
            <Icon name="chess-bishop" color={color} size={40}/>
        </>
    )
}

const Queen = ({color}) => {
    return (
        <>
            <Icon name="chess-queen" color={color} size={40}/>
        </>
    )
}

const King = ({color}) => {
    return (
        <>
            <Icon name="chess-king" color={color} size={40}/>
        </>
    )
}

export default ChessBoard;
