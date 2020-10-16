/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 * 
 * TODO: make timeout function, so the alert happens after the winning piece drops
 * TODO: Have the board reset or freeze, so you can't "keep playing" after someone wins
 * 
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  let row = []
  for (let col = 0; col < WIDTH; col ++) { // make a row array based on number of columns (WIDTH)
    row.push(undefined)
  }
  for (let y = 0; y < HEIGHT; y ++) { // combine row arrays into board. make copy of row using spread operator
    rowCopy = [...row]  //need this line, otherwise all the rows will be referencing the same row
    board.push(rowCopy)
  }
  return board
} 

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById('board');

  // create table row at the top of the board with an id of column-top that has a click eventListener
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); // clicking on the top row will call handleClick function

  for (var x = 0; x < WIDTH; x++) { // for each column, create a headCell with an ID attribue of 0 to WIDTH
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);   
    top.append(headCell); // add the headCell element to the top top row element

    downArrow = document.createElement("i");
    downArrow.classList.add("fas");
    downArrow.classList.add("fa-chevron-down");
    headCell.append(downArrow);
  }
  htmlBoard.append(top); // append the created top row with children headCells to the htmlboard

  // make each square element of the game board 
  for (let y = 0; y < HEIGHT; y++) {  // for each row
    const row = document.createElement("tr"); // create a table row
    for (let x = 0; x < WIDTH; x++) { // for each column
      const cell = document.createElement("td"); // create a table data element (cell)
      cell.setAttribute("id", `${y}-${x}`); // give each cell an id attribute row#-column#
      row.append(cell); // append the cell to the current row element
    }
    htmlBoard.append(row); // add each row to the board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x,event) {
  for (let y = HEIGHT - 1; y >= 0; y--){
    if(!board[y][x]) {
      return y
    }
    if (y === 1) {
      event.target.parentElement.classList.add('fullColumn');//fade the drop button when column fills
    }
  }
  
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(x, y) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.animationName = `row${y}`; //animate drop depth based on row#
  piece.style.top = -50 * (y + 2); //(top is refering to top of table (each square is 50px + 2 for the space between)

  const spot = document.getElementById(`${y}-${x}`); //location for piece to drop to
  spot.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.parentElement.id; // need to get parent element, otherwise the click target will be the arrow

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x,evt);
  if (y === null) { // if y === null, the column is filled up. Do nothing
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer; // y-row, x-column
  placeInTable(x, y);


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every(boardSquare => boardSquare == 1 || boardSquare == 2))) {
    return endGame("It's a tie!");
  }


  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every( //check every cell on the board for a 1 or 2 (piece played)
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (var y = 0; y < HEIGHT; y++) { 
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //horizonal win
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //vertical win
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //diagonal to the right win
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //diagonal to the left win

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any of these win situations are true, return true
        return true;
      }
    }
  }
}

makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
