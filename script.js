const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
let playerColor = "white"
const chessColumn  = ["a", "b", "c", "d", "e", "f", "g", "h"]
const chessRow = [1, 2, 3, 4, 5, 6, 7, 8]
window.addEventListener('resize', resizeCanvas, false);
document.querySelector(".start").addEventListener("click", () => {
  document.getElementById("intro").className = "hidden"
  document.getElementById("myBoard").classList.remove("hidden")
})

class Particle{

    constructor(){
        this.x = Math.random()*$(document).width()*2-$(document).width()
        this.y = Math.random()*$(document).height()*2-$(document).height()
        this.direction = Math.random()*2*Math.PI
        this.speed = Math.random()*9+1
        this.color = `rgba(0, 0, 255, ${Math.random()*256})`
        this.color = `blue`
        this.size = Math.random()*40+1
        Particle.particles.push(this)
    }

    draw(){
        context.beginPath()
        context.fillStyle = this.color
        context.arc(this.x, this.y, this.size, 0, 2*Math.PI)
        context.fill()
    }

    move(){
        this.x += Math.sin(this.direction)*this.speed
        this.y += Math.cos(this.direction)*this.speed
        if (this.x >= canvas.width) {
          this.x = 1
        }
        if (this.y >= canvas.height) {
          this.y = 1
        }
        if (this.x <= 0) {
          this.x = canvas.width - 1
        }
        if (this.y <= 0) {
          this.y = canvas.height - 1
        }
    }

    remove(){
        particles.splice(particles.findIndex(this), 1)
    }
    static particles = []

    static Tick() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        Particle.particles.forEach(particle => {
            particle.move()
            particle.draw()
        })
    }
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Redraw everything after resizing the window 
  }
  function drawParticles(){
      for (let i = 0; i < 20; i++) {
          new Particle().draw()
      }
      setInterval(Particle.Tick, 10)
  }
  
  resizeCanvas();
  drawParticles()
console.log(Particle.particles)
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
}
const board = Chessboard('myBoard', config)
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

if (Math.random() > .5 && false) {
  playerColor = "black"
  AIMove()
}
console.log("You are" , playerColor)

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
  AIMove()
}

function AIMove() {
  console.log("AIMove")
  // Analyze board state
  let state = game.board()
  console.log(calculateBestMove())
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
  if (playerColor == "black") {
    return whiteScore - blackScore
  } else {
    return blackScore - whiteScore
  }
}

function calculateBestMove() {
  let state = game.board()
  let highScore = 0
  let bestMove = ""
  let oldPos;
  for (let x = 0; x < state.length; x++) {
    for (let y = 0; y < state[x].length; y++) {
      let piece = state[x][y]
      if (piece && playerColor[0] == piece.color) {
        let availableMoves = game.moves({square: xytoChess(x, y)})
        for (let i = 0; i < availableMoves.length; i++) {
          state[x][y] = null
          let [newX, newY] = chesstoXY(availableMoves[i])
          state[newX, newY] = piece
          let score = evaluateBoard(state)
          console.log(score)
          if (score > highScore) {
            oldPos = xytoChess(x, y);
            highScore = score
            bestMove = availableMoves[i]
          }
        }
      }
    }
  }
  console.log(oldPos, bestMove)
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
    case "N":
      return 3
    case "p":
      return 1
    case "k":
      return 999
    default:
      return 0
  }
}

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
}

function onSnapEnd () {
  board.position(game.fen())
}
// Use legal moves method in order to highlight squares that are available
// Use turn selector like in tic tac toe
