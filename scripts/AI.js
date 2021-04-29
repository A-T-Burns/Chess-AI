function AIMove() {
    console.log("AIMove")
    // Analyze board state
    let state = game.board()
    calculateBestMove(3)
  //   console.log(calculateBestMove())
    // Calculate best move
    // use .in_check() to see if king is in danger
    // Move to that position
    // set turn back to player
  }
  
  function evaluateBoard(state) {
    // if (playerColor == "white")
    let whiteScore = 0
    let blackScore = 0
    for (let x = 0; x < state.length; x++) {
      for (let y = 0; y < state[x].length; y++) {
        if (state[x][y]) {
          state[x][y].color == "w" ? whiteScore += evaluatePiece(state[x][y]) : blackScore += evaluatePiece(state[x][y])
        }
      }
    }
    console.log('white vs black score',whiteScore, blackScore)
    if (playerColor == "black") {
      return whiteScore - blackScore
    } else {
      return blackScore - whiteScore
    }
  }
  
  // evaluates the board to find the best move
  function calculateBestMove(depth) {
    // if(depth > 0) {
    //   calculateBestMove(depth--)
    // }
    let state = game.board()
    console.log('board state before moving',state)
    let highScore = -Infinity
    let bestMove = ""
    let oldPos;
    let totalMoves = 0;
    for (let y = 0; y < state.length; y++) {
        for (let x = 0; x < state.length; x++) {
            let piece = state[y][x]
            state[y][x] = null
            //console.log('potential piece', piece, xytoChess(x, y));
            if (piece && AIColor[0] == piece.color) {
              console.log('piece avaliable to move on',xytoChess(x, y));
              let availableMoves = game.moves({square: xytoChess(x, y), verbose: true})
              totalMoves += availableMoves.length
              for (let i = 0; i < availableMoves.length; i++) {
                  let [newX, newY] = chesstoXY(availableMoves[i].to)
                  state[newY][newX] = piece
                  let score = evaluateBoard(state)
                  if (score > highScore) {
                      oldPos = xytoChess(x, y);
                      highScore = score
                      bestMove = availableMoves[i].san
                  }
                  state[newY][newX] = null
              }
              state[y][x] = piece
          console.log(piece, "score", highScore, "availablemoves", availableMoves.length)
        }
      }
    }
    console.log('best move is ',bestMove, 'out of ', totalMoves, evaluateBoard(state))
    //return game.move({from: oldPos ,to: bestMove})
    return game.move(bestMove)
  }
  function xytoChess(x, y) {
    return `${chessColumn[x]}${chessRow[y]}`
  }
  
  function chesstoXY(placement) {
    let x = 0
    let y = 0
    x = chessColumn.indexOf(placement[0])
    y = chessRow.indexOf(Number(placement[1]))
    return [x, y]
  }
  
  
  function evaluatePiece(piece){
    switch (piece.type) {
      case "q":
        return 9
      case "r":
        return 5
      case "b":
      case "n":
        return 3
      case "p":
        return 1
      case "k":
        return 999
      default:
        return 0
    }
  }
  