let maxDepth
function AIMove() {
  console.log("AIMove")
  // Analyze board state
  let state = game.board()
  calculateBestMove(state, 3)
  console.log(calculateBestMove())
  // Calculate best move
  // use .in_check() to see if king is in danger
  // Move to that position
  // set turn back to player
}
function flattenBoard(state) {
  const flat = new Array(128)
  for (let x = 0; x < state.length; x++) {
    for (let y = 0; y < state[0].length; y++) {
      flat[y + x*16] = state[x][y]
    }
    
  }
  return flat
}

function evaluateBoard(state, AITurn) {
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
  console.log('white vs black score', whiteScore, blackScore)
  if (AITurn) {
    if (playerColor == "black") {
      return whiteScore - blackScore
    } else {
      return blackScore - whiteScore
    }
  } else {
    if (playerColor == "black") {
      return blackScore - whiteScore
    } else {
      return whiteScore - blackScore
    }
  }
}
function boardNode(state, depth, score, firstMove, AITurn = true) {
  return { state, depth, score, firstMove, AITurn }
}
// function availableMoves(state, currentPiece, x, y, colorPlayerTurn) {
//   let output = []
//   switch (currentPiece.type) {
//     case "p":
//       let direction = currentPiece.color == "w" ? 1 : -1
//       if (!state[x][y + direction] && y < 8 && y > 0) {
//         output.push(xytoChess(x, y + direction))
//       }
      
//       break;
  
//     default:
//       break;
//   }
//   return output
// }
function calculateBestMove() {
  let queue = [boardNode(game.board(), 0, evaluateBoard(game.board()))]
  let bestNode = null
  console.log(flattenBoard(game.board()))

  let count = 0
  while (queue.length && ++count < 100) {
    let { state, depth, firstMove, AITurn} = queue.shift()
    //  get all the available moves for the current player and add them to queue
    for (let y = 0; y < state.length; y++) {
      for (let x = 0; x < state.length; x++) {
        let piece = state[y][x]
        //console.log('potential piece', piece, xytoChess(x, y));
        if (piece && ((AIColor[0] == piece.color && AITurn) || (playerColor[0] == piece.color && !AITurn))) {
          console.log('piece avaliable to move on', xytoChess(x, y), "depth" , depth);
          let availableMoves = game.moves({ square: xytoChess(x, y), verbose: true, turn: AITurn ? AIColor[0] : playerColor[0], state: flattenBoard(state) })
          state[y][x] = null
          for (let i = 0; i < availableMoves.length; i++) {
            let [newX, newY] = chesstoXY(availableMoves[i].to)
            state[newY][newX] = piece
            let score = evaluateBoard(state, AITurn)
            let currentNode = boardNode([...state], depth + 1, score, firstMove || availableMoves[i].to, !AITurn)
            if (depth < 3) {
              queue.push(currentNode)
            } else if (!bestNode || bestNode.score < currentNode.score) {
              bestNode = currentNode
            }
            state[newY][newX] = null
          }
        }
        state[y][x] = piece
      }
    }
  }
  return game.move(bestNode.firstMove)
}
// evaluates the board to find the best move
// function calculateBestMove(state = game.board(), depth, AITurn = true, firstMove = "") {
// Alternate between calculating best move for yourself and opponent
// find the path which leads to the greatest advantage for your color
// return the first move of the path
//   let highScore = -Infinity
//   let bestMove = ""
//   let oldPos;
//   let totalMoves = 0;
//   console.log('board state before moving', state)
//   for (let y = 0; y < state.length; y++) {
//       for (let x = 0; x < state.length; x++) {
//           let piece = state[y][x]
//           state[y][x] = null
//           //console.log('potential piece', piece, xytoChess(x, y));
//           if (piece && ((AIColor[0] == piece.color && AITurn) || (playerColor[0] == piece.color && !AITurn))) {
//             console.log('piece avaliable to move on',xytoChess(x, y));
//             let availableMoves = game.moves({square: xytoChess(x, y), verbose: true})
//             totalMoves += availableMoves.length
//             for (let i = 0; i < availableMoves.length; i++) {
//                 let [newX, newY] = chesstoXY(availableMoves[i].to)
//                 state[newY][newX] = piece
//                 let score = evaluateBoard(state, AITurn)
//                 if (score > highScore) {
//                     oldPos = xytoChess(x, y);
//                     highScore = score
//                     bestMove = availableMoves[i].san
//                 }
//                 state[newY][newX] = null
//             }
//             state[y][x] = piece
//         console.log(piece, "score", highScore, "availablemoves", availableMoves.length)
//       }
//     }
//   }
//   console.log('best move is ',bestMove, 'out of ', totalMoves, evaluateBoard(state))
//   //return game.move({from: oldPos ,to: bestMove})
//   //return game.move(bestMove)
//   if (depth == maxDepth) {
//     firstMove = bestMove
//   }
//   if(depth > 0) {
//     const [score, bestMove] = calculateBestMove(state, depth--, !AITurn, firstMove);
//   }
//   return [highScore, bestMove]
// }
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


function evaluatePiece(piece) {
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
