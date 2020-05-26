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
    let [selected, setSelected] = useState({row: null, col: null})
    let [moveSet, setMoveSet] = useState([{row: null, col: null}])
    let [isWhiteTurn, setIsWhiteTurn] = useState(true);
    
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
        [ null, null, null, null, null, null, null, null], 
        [ new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black")],
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white")],    
        [ null, null, null, null, null, null, null, null]
    ]
}

class Pawn {

    constructor(color){
        this.color = color
        this.icon = <Icon name="chess-pawn" color={color} size={37}/>
        this.hasMoved = false
        this.isSelected = false

        if(color === "white"){
            this.isBottom = true
        }
        else if(color === "black"){
            this.isBottom = false;
        }
    } 

    getMoveSet(row, col, board){
        
        let baseMoves = this.getBaseMoves(row, col, board)
        let attackMoves = this.getAttackMoves(row, col, board)

        // Todo: 
        //  1. En passant
        //  2. Quening
        
        return [...baseMoves, ...attackMoves]
    }

    getBaseMoves(row, col, board){
        let direction = this.isBottom ? -1 : 1
        let square1 = {row: row + 1*direction, col: col}
        if (this.hitTest(square1, board) == squareStatus.empty){
            let moves = [square1]
            if(!this.hasMoved){
                let square2 = {row: row + 2*direction, col: col}
                if(this.hitTest(square2, board) == squareStatus.empty){
                    moves = [...moves, square2]
                }
            }
            return moves
        }
        else{
            return [{row: null, col: null}] 
        }
    } 

    getAttackMoves(row, col, board){
        let rowDirection = this.isBottom ? -1 : 1
        let moves = []
        for(let colDirection = -1; colDirection < 2; colDirection += 2){
            let square = {row: row + 1*rowDirection, col: col + 1*colDirection}
            if(this.hitTest(square, board) == squareStatus.foe){
                moves = [...moves, square]
            }
        }
        if(moves.length > 0){
            return moves
        }
        else{
            return [{row: null, col: null}]
        }
    }

    hitTest(square, board){

        // if out of bounds
        if(square.row < 0 || square.col < 0 || square.row >= 7 || square.row >= 7){
            return squareStatus.offBoard
        }

        let piece = board[square.row][square.col]
        if(piece){
            if(piece.isBottom == this.isBottom){
                return squareStatus.friend
            }
            else {
                return squareStatus.foe
            }
        }
        else{
            return squareStatus.empty
        }
    }
}

const squareStatus = {
    friend: "friend",
    foe: "foe",
    empty: "empty",
    offBoard: "offBoard"
}

export default ChessBoard;
