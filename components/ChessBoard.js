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
import Model from "../model/ChessModel"


const ChessBoard = (props)  => {

    let model = new Model();
    let [piecePlacement, setPiecePlacement] = useState(model.board)
    let [selected, setSelected] = useState({row: null, col: null})
    let [moveSet, setMoveSet] = useState([{row: null, col: null}])
    let [isWhiteTurn, setIsWhiteTurn] = useState(true);

    console.log("board: ", model.board)
    
    const displayMoves = (piece, row, col) => {
        let moveSet = piece.getMoveSet(row, col, piecePlacement)
        if(moveSet){
            setMoveSet([...moveSet])
        }
        else{
            setMoveSet([{row: null, col: null}])
        }
    }

    const onPieceSelect = (row, col) => {
        
        let piece = piecePlacement[row][col];
        // If the selected piece has already been selected, we want to unselect it (toggle functionality)
        if(selected.row === row && selected.col === col){
            row = null
            col = null
        }
        displayMoves(piece, row, col)
        setSelected({row: row, col: col})
    }

    const onPieceMove = (targetRow, targetCol) => {
        let newPlacement = [...piecePlacement]
        let piece = newPlacement[selected.row][selected.col]
        newPlacement[targetRow][targetCol] = piece
        newPlacement[selected.row][selected.col] = null
        piece.hasMoved = true

        setPiecePlacement(newPlacement)
        setSelected({row: null, col:null})
        setMoveSet([{row: null, col: null}])    
        setIsWhiteTurn(!isWhiteTurn)    
    }

    return (
        <View style={props.style}>
            <View style={[ gridSizes.container, gridBorders.container]}>
                <Board 
                    squares={piecePlacement} 
                    onPieceSelect={(row, col) => onPieceSelect(row, col)}
                    onPieceMove={(row, col) => onPieceMove(row, col)}
                    selectedSquare={selected}
                    possibleMoves={moveSet}
                    isWhiteTurn={isWhiteTurn}
                />
            </View>
        </View>
    );
};




const Board = ({squares, onPieceSelect, onPieceMove, selectedSquare, possibleMoves, isWhiteTurn}) => {
    return squares.map( (row, rowIndex) => (
        <View style={[gridSizes.row, gridBorders.row]}>
             {row.map( (item, colIndex) => {
                 
                

                 let isSelected = false
                 if(rowIndex === selectedSquare.row && colIndex === selectedSquare.col){
                     isSelected = true
                 }

                 let isTarget = false

                 if(possibleMoves.some( move => move.row === rowIndex && move.col === colIndex)){
                     isTarget = true
                 }

                 if(item){
                    let moveSet = item.getMoveSet(rowIndex, colIndex, squares)
                 }

                 return (
                    <Square 
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        piece={item}
                        isSelected={isSelected}
                        isWhiteTurn={isWhiteTurn}
                        isTarget={isTarget}
                        onPieceSelect={(row, col) => onPieceSelect(row, col)}
                        onPieceMove={(row, col) => onPieceMove(row, col)}
                    />
                )}
            )}
        </View>
    ))
}

const Square = ({rowIndex, colIndex, piece, onPieceSelect, isSelected, isTarget, onPieceMove, isWhiteTurn}) => {
        
    const onPress = () => {
        if(isTarget){
            onPieceMove(rowIndex, colIndex)
        }
        else if(piece){
            let canBeSelected = ( isWhiteTurn && piece.color === "white" ) || ( !isWhiteTurn && piece.color === "black" )
            if(canBeSelected){
                onPieceSelect(rowIndex, colIndex)
            }
        }
    }

    let pieceIcon = piece == null ? null : piece.icon

    const isEven = (colIndex + rowIndex)% 2 == 0; 
    let backgroundStyle
    if(isSelected){
        backgroundStyle = isEven ? backgroundColor.selectedEven : backgroundColor.selectedOdd
    }
    else {
        backgroundStyle = isEven ? backgroundColor.even : backgroundColor.odd
    }

    let target;
    if(isTarget){
        target = <View style={square.target}></View>
    }
    return (     
        <TouchableOpacity
            style={[
                gridSizes.square, 
                gridBorders.square,
                backgroundStyle
            ]}
            onPress={() => onPress()}
        >
            <View style={square.container}>
                {target}
                <View style={square.pieceContainer}>
                    {pieceIcon}
                </View>
            </View>
        </TouchableOpacity>

    )
}

const square = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    pieceContainer: {

    },

    target: {
        backgroundColor: "rgb(80,80,80)",
        opacity: 0.3,
        width: "60%",
        height: "60%",
        borderRadius: 1000,
        borderColor: "red",
        position: "absolute",
    }
})


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


export default ChessBoard;
