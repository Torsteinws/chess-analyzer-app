import React from 'react';
import Icon from "react-native-vector-icons/FontAwesome5"

const defaultPiecePlacement =  () => { 
    return [
        // [ new Rook("black"), new Knight("black"), new Bishop("black"), new Queen("black"), new King("black"), new Bishop("black"), new Knight("black"), new Rook("black")], 
        // [ new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black")],
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null],
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null],
        [ null, null, null, null, null, null, null, null], 
        [ null, null, null, null, null, null, null, null], 
        // [ new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white")],    
        // [ new Rook("white"), new Knight("white"), new Bishop("white"), new Queen("white"), new King("white"), new Bishop("white"), new Knight("white"), new Rook("white")]
        // [ new Rook("white"), null, null, null, new King("white"), null, null, new Rook("white")]
        [new Knight("white"), new Knight("black"), null, null, null, null, null, null]
    ]
}

class ChessModel{

    constructor(){
        this.board = defaultPiecePlacement();
        this.updateAllMoveSets();

    }

    updateAllMoveSets(){
        this.board.forEach( (row, rowIndex) => {
            row.forEach( (piece, colIndex) => {
                if(piece){
                    piece.row = rowIndex
                    piece.col = colIndex
                    piece.updateMoveSet(this.board);
                }
            })
        })
    }

    move(piece, orgSquare, destSquare){

        // move the piece on the board
        this.board[destSquare.row][destSquare.col] = piece
        this.board[orgSquare.row][orgSquare.col] = null
    
        // Let the piece know the current position so that it can recalculate its moveset
        piece.row = destSquare.row
        piece.col = destSquare.col
        this.updateAllMoveSets();

        piece.hasMoved = true;
    }
}

class ChessPiece {
    constructor(color){
        this.color = color
        this.icon = null
        this.hasMoved = false

        this.row = null;
        this.col = null;
        this.moveSet = [{row: null, col: null}]

        this.isBottom = color === "white" ? true : false
    } 

    hitTest(square, board){

        // if out of bounds
        if(square.row < 0 || square.col < 0 || square.row > 7 || square.row > 7){
            return squareStatus.offBoard
        }
        console.log("square : ", square)
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

class Pawn extends ChessPiece {

    constructor(color){
        super(color)
        this.icon = <Icon name="chess-pawn" color={color} size={37}/>
    } 

    getMoveSet(row, col, board){
        
        if(row == null || col == null) return [{row: null, col: null}]

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
}

class Rook extends ChessPiece{

    constructor(color){
        super(color)
        this.icon = <Icon name="chess-rook" color={color} size={35}/>
    }

    getMoveSet(row, col, board){
        
        if(row == null || col == null) return [{row: null, col: null}]

        let posColMoves = this.getPosColMoves(row, col, board)
        let negColMoves = this.getNegColMoves(row, col, board)
        let posRowMoves = this.getPosRowMoves(row, col, board)
        let negRowMoves = this.getNegRowMoves(row, col, board)

        let moves = [...posColMoves, ...negColMoves, ...posRowMoves, ...negRowMoves]
        if(moves.length <= 0){
            moves = [{row: null, col: null}]
        }
        return moves
    }

    getPosColMoves(row, col, board){
        
        let i = 1
        let moves = []
        while(col + i < 8){
            let square = {row: row, col: col + i}
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty){
                moves = [...moves, square]
            }
            else if(status === squareStatus.foe){
                moves = [...moves, square]
                break;
            }
            else{
                break;
            }
            i++
        }
        return moves
    }

    getNegColMoves(row, col, board){
        let i = 1
        let moves = []
        while(col - i >= 0){
            let square = {row: row, col: col - i}
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty){
                moves = [...moves, square]
            }
            else if(status === squareStatus.foe){
                moves = [...moves, square]
                break;
            }
            else{
                break;
            }
            i++
        }
        return moves
    }
    
    getPosRowMoves(row, col, board){
        
        let i = 1
        let moves = []
        while(row + i < 8){
            let square = {row: row + i, col: col}
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty){
                moves = [...moves, square]
            }
            else if(status === squareStatus.foe){
                moves = [...moves, square]
                break;
            }
            else{
                break;
            }
            i++
        }
        return moves
    }

    
    getNegRowMoves(row, col, board){
        let i = 1
        let moves = []
        while(row - i >= 0){
            let square = {row: row - i, col: col}
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty){
                moves = [...moves, square]
            }
            else if(status === squareStatus.foe){
                moves = [...moves, square]
                break;
            }
            else{
                break;
            }
            i++
        }
        return moves
    }    
}

class Knight extends ChessPiece{
    constructor(color){
        super(color)
        this.icon = <Icon name="chess-knight" color={color} size={35}/>
    }

    updateMoveSet(board){

        let baseMoves = this.getBaseMoves(board);
        let moves = [...baseMoves]
        if(moves.length <= 0){
            moves = [{row: null, col: null}]
        }
        this.moveSet = moves;
    }

    getBaseMoves(board){
        let baseMoves = [
            { row: this.row + 2, col: this.col + 1 },
            { row: this.row + 2, col: this.col - 1 },
            { row: this.row - 2, col: this.col + 1 },
            { row: this.row - 2, col: this.col - 1 },
            { row: this.row + 1, col: this.col + 2 },
            { row: this.row - 1, col: this.col + 2 },
            { row: this.row + 1, col: this.col - 2 },
            { row: this.row - 1, col: this.col - 2 }        
        ]
        let moves = baseMoves.filter( square => {
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty || status === squareStatus.foe) {
                return true
            }
        })
        return moves;
    }
}

class Bishop extends ChessPiece{
    constructor(color){
        super(color)
        this.icon = <Icon name="chess-bishop" color={color} size={35}/>
    }

    getMoveSet(board){

        let posRowPosCol = this.getBaseMoves( board,  1,  1);
        let posRowNegCol = this.getBaseMoves( board,  1, -1);
        let negRowPosCol = this.getBaseMoves( board, -1,  1);
        let negRowNegCol = this.getBaseMoves( board, -1, -1);
        let moves = [...posRowPosCol, ...posRowNegCol, ...negRowPosCol, ...negRowNegCol]
        if(moves.length <= 0){
            moves = [{row: null, col: null}]
        }
        return moves
    }

    getBaseMoves(board, rowDir, colDir){
        let moves = []

        let i = 1*rowDir
        let j = 1*colDir
        while(this.row + i < 8 && this.col + j < 8 && this.row + i >= 0 && this.col + j >= 0){
            let square = {row: this.row + i, col: this.col + j}
            let status = this.hitTest(square, board)
            if(status === squareStatus.empty){
                moves = [...moves, square]
            }
            else if(status === squareStatus.foe){
                moves = [...moves, square]
                break;
            }
            else {
                break
            }
    
            i += 1*rowDir
            j += 1*colDir
        }
        return moves
    }
}

class Queen extends ChessPiece{
    constructor(color){
        super(color)
        this.icon = <Icon name="chess-queen" color={color} size={35}/>

        // We can get the move set of a queen by combining the move set of a rook and a bishop
        // Here we are getting a reference to the move set method in the rook and bishop class
        let rook = new Rook(color);
        let bishop = new Bishop(color);
        this.getRookMoveSet     = (row, col, board) => rook.getMoveSet(row, col, board);
        this.getBishopMoveSet   = (row, col, board) => bishop.getMoveSet(row, col, board)
        
    }

    getMoveSet(row, col, board){

        if(row == null || col == null) return [{row: null, col: null}]

        let rookMoveSet     = this.getRookMoveSet(row, col, board)
        let bishopMoveSet   = this.getBishopMoveSet(row, col, board)
        let moves = [...rookMoveSet, ...bishopMoveSet]
        if(moves.length <= 0){
            moves = [{row: null, col: null}]
        }
        return moves
    }
}

class King extends ChessPiece{
    constructor(color){
        super(color)
        this.icon = <Icon name="chess-king" color={color} size={35}/>
    }

    getMoveSet(row, col, board){

        if(row == null || col == null) return [{row: null, col: null}]

        let baseMoves = this.getBaseMoves(row, col, board)
        let castleMoves = this.getCastleMoves(row, col, board)
        // Todo:
        //  1. Do not allow the king to walk into or castle into check

        let maxMoves = [...baseMoves, ...castleMoves]
        let moves = maxMoves.filter(square => this.squareIsSafe(square, board))
        if(moves.length <= 0){
            moves = [{row: null, col: null}]
        }
        return moves
    }

    squareIsSafe(square, board){
        return true
    }

    getBaseMoves(row, col, board){
        let moves = []
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                let evalRow = row + i;
                let evalCol = col + j
                if( evalRow < 0 || evalCol < 0 || evalRow > 8 || evalCol > 8) continue // if out of bounds
                let square = {row: evalRow, col: evalCol}
                let status = this.hitTest(square, board)
                if(status === squareStatus.foe || status === squareStatus.empty){
                    moves = [...moves, square]
                }
            }
        }
        return moves
    }

    getCastleMoves(row, col, board){
        let king = board[row][col]
        let moves = []
        if(!king.hasMoved){
            let rooks = [board[row][0], board[row][7]]
            rooks.forEach( (rook, index) => {
                if(rook){
                    if(!rook.hasMoved){
                        // Itterate over all square between rook and king, and check if castling is allowed
                        let canCastle = true
                        let castleLeft = index === 0 ? true : false
                        let colStart = castleLeft ? 1 : col + 1
                        let colEnd = castleLeft ? col : 7 
                        for(let i = colStart; i < colEnd; i++ ){
                            let square = {row: row, col: i}
                            let status = this.hitTest(square, board)
                            if(status === squareStatus.friend || status === squareStatus.foe){
                                canCastle = false;
                                break;
                            }  
                        }
                        if(canCastle){
                            let direction = castleLeft ? -1 : 1;
                            moves = [...moves, {row: row, col: col + 2*direction, info: moveInfo.castle}]
                        }
                    }
                }
            })
        }
        return moves
    }


}

const moveInfo = {
    normal: "normal move",
    castle: "castle move",
    enPhassant: "en phassant move"
}

const squareStatus = {
    friend: "friend",
    foe: "foe",
    empty: "empty",
    offBoard: "offBoard"
}

export default ChessModel