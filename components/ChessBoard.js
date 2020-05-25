import React, { useState, useLayoutEffect } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
    StatusBar,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5"

const ChessBoard = (props)  => {

    let [piecePlacement, setPiecePlacement] = useState([...defaultPiecePlacement()])
    let [selectedSquares, setSelectedSquares] = useState(() => [...defaultSelectedSquares()])
    let [selected, setSelected] = useState(null)
    // finds if there are any selected items. Currently not in use. Will be used in the future
    const checkIfAnySelected = () => {
        let anySelected = selectedSquares.some( (row, i) => {
            anySelectedInRow = !row.every( value => value == false)
            if(anySelectedInRow) {
                return true
            }
        })
    }

    const moveFromTo = (x1, y1, x2, y2 ) => {
        let newVal = [...piecePlacement];
        newVal[x2][y2] = newVal[x1][y1]
        newVal[x1][y1] = null
        
        setPiecePlacement(newVal)
    }

    const isInMoveSet = (piece, row1, col1, row2, col2) => {
        moveSet = piece.getMoveSet(row1, col1)
        console.log(moveSet)
        if(moveSet.length > 0){
            return moveSet.includes([row2, col2])
        }
        else{
            return false
        }
    }
    
    
    const squarePressed = (rowIndex, colIndex) => {
        

        if(selected){

            move(rowIndex, colIndex)
        }
        else {

            let piece = piecePlacement[rowIndex][colIndex]
            if(piece == null) return

            let newValues = [...defaultSelectedSquares()]
            newValues[rowIndex][colIndex] = true
            setSelectedSquares(newValues)
            setSelected({
                row: rowIndex, 
                col: colIndex})
        }
    }

    return (
        <View style={props.style}>
            <View style={[ gridSizes.container, gridBorders.container]}>
                <Board 
                    squares={piecePlacement} 
                    selectedSquares={selectedSquares}
                    squarePressed={(row, col) => squarePressed(row, col)}/>
            </View>
        </View>
    );
};




const Board = ({squares, selectedSquares, squarePressed}) => {

    return squares.map( (row, rowIndex) => (
        <View style={[gridSizes.row, gridBorders.row]}>
             {row.map( (value, colIndex) => (
                 <Square 
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    piece={value == null ? null : value.icon }
                    isSelected={selectedSquares[rowIndex][colIndex]}
                    squarePressed={(row, col) => squarePressed(row, col)}
                 />
            ))}
        </View>
    ))
}

const Square = ({rowIndex, colIndex, piece, squarePressed, isSelected}) => {
    
    const isEven = (colIndex + rowIndex)% 2 == 0; 
    let backgroundStyle
    if(isSelected){
        backgroundStyle = isEven ? backgroundColor.selectedEven : backgroundColor.selectedOdd
    }
    else {
        backgroundStyle = isEven ? backgroundColor.even : backgroundColor.odd
    }
    
    return (     
        <TouchableOpacity
            style={[
                gridSizes.square, 
                gridBorders.square,
                backgroundStyle
            ]}
            onPress={() => squarePressed(rowIndex, colIndex)}
        >
            <View>
                {piece}
            </View>
        </TouchableOpacity>

    )
}

const backgroundColor = StyleSheet.create({
    even: {
        backgroundColor: "rgb(240, 217, 181)"
    },
    odd: {
        backgroundColor: "rgb(181,136,99)"
    },
    // The selected backround color is 60 units lower than the default backround color
    selectedEven: {
        backgroundColor: "rgb(180, 157, 121)"
    },
    selectedOdd: {
        backgroundColor: "rgb(121,76,39)"
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

// const Pawn = ({color}) => {
//     return (
//         <>
//             <Icon name="chess-pawn" color={color} size={37}/>
//         </>
//     )
// }

const Rook = ({color}) => {
    return (
        <>
            <Icon name="chess-rook" color={color} size={35}/>
        </>
    )
}

const Knight = ({color}) => {
    return (
        <>
            <Icon name="chess-knight" color={color} size={35}/>
        </>
    )
}

const Bishop = ({color}) => {
    return (
        <>
            <Icon name="chess-bishop" color={color} size={35}/>
        </>
    )
}

const Queen = ({color}) => {
    return (
        <>
            <Icon name="chess-queen" color={color} size={35}/>
        </>
    )
}

const King = ({color}) => {
    return (
        <>
            <Icon name="chess-king" color={color} size={35}/>
        </>
    )
}

const defaultPiecePlacement =  () => { 
    return [
        // [ 
        //     <Rook   color="black"/>,
        //     <Knight color="black"/>,
        //     <Bishop color="black"/>,
        //     <Queen  color="black"/>,
        //     <King   color="black"/>,
        //     <Bishop color="black"/>,
        //     <Knight color="black"/>,
        //     <Rook   color="black"/>
        // ], 
        // [   
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>,
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>, 
        //     <Pawn color="black"/>
        // ], 
        [ new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black")],
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white")], 
        // [   
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>,
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>, 
        //     <Pawn color="white"/>
        // ], 
        // [ 
        //     <Rook   color="white"/>,
        //     <Knight color="white"/>,
        //     <Bishop color="white"/>,
        //     <Queen  color="white"/>,
        //     <King   color="white"/>,
        //     <Bishop color="white"/>,
        //     <Knight color="white"/>,
        //     <Rook   color="white"/>
        // ]     
    ]
}



const defaultSelectedSquares = () => { 
    return [
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false],
        [ false, false, false, false, false, false, false, false]
    ]
}

class Pawn {

    constructor(color){
        this.color = color
        this.icon = <Icon name="chess-pawn" color={color} size={37}/>
        this.hasMoved = false

        if(color === "white"){
            this.isBottom = true
        }
        else if(color === "black"){
            this.isBottom = false;
        }
    } 

    getMoveSet(row, col){
        let moveSet = []
        if(this.isBottom){
            moveSet.push([row + 1, col])
            if(!this.hasMoved) {
                moveSet.push([row + 2, col])
            }
        }
        else{
            moveSet.push([row - 1, col])
            if(!this.hasMoved){
                moveSet.push([row -2, col])
            }
        }
        return moveSet
    }

    canMove(x1, y1, x2, y2){
        // let isBaseMove = row2-row1 == 1 && col1 == 
        if(!this.hasMoved && row2 - row1 == 2 && col1 == col2){
            return true
        }
        else if(this.hasMoved){

        }
    }
}

export default ChessBoard;
