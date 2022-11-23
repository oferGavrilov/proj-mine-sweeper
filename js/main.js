'use strict'


var lastCell = []
var gBoard
var gGame = {
    isOn: false,
    shownCount:0,
    markedCount:0,
    secsPassed:0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gGame.isOn = true
    document.querySelector('.modal').classList.add('hidden')
    gBoard = createBoard()
    renderBoard(gBoard)
}


function createBoard() {
    console.log(gGame)
    const board = []
    for (var i = 0; i < 4; i++) {
        board[i] = []
        for (var j = 0; j < 4; j++) {
            const cell = {
                minesNegsCount: null,
                isMine: false,
                isShown: false,
                isMarked: false,
                isSelected: false
            }
            if (cell.isMine === false || cell.isShown === false) {
                board[i][j] = cell.minesNegsCount
            }
            board[i][j] = cell
        }
    }
    board[3][3].isMine = true
    console.log(board)
    return board
}


function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr\n>`
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var className = ''
            if (cell.isMine) className = ' mine'
            if (cell.isShown) className = 'shown'
            if (cell.isSelected) className = 'selected'


            const negsCounter = (cell.isShown) ? minesNegsCount(i, j) : ''
            strHtml += `\t<td data-i="${i}" data-j="${j}" class="cell-${i}-${j} ${className}"
             onclick="onClickCell(this, ${i},${j})" oncontextmenu="onRight(this, ${i}, ${j})">${negsCounter}</td>\n`
        }
        strHtml += `</tr>\n`
    }
    const elCell = document.querySelector('.container-matrix')
    elCell.innerHTML = strHtml
}

function onRight(e, i, j) {
    if(!gGame.isOn || gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = true
    renderCell({ i, j }, '🚩')
    checkVictory()
    if(checkVictory() === true){
        document.querySelector('h1').innerText = 'Victory!'
        isVictory()
    }
    document.oncontextmenu = function (e) {
        e.preventDefault()
        return false
    }
}

function checkVictory() {
    var minesCounter = 0 
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && cell.isShown === false) return false
            if (cell.isMine === true && cell.isMarked === false) {
                return false
            }
        }
    }
    return true
}


function onClickCell(elCell, i, j) {
    console.dir(elCell.oncontextmenu)
    if (elCell.button === 2) {
        console.log('clicked')
    }
    if (gBoard[i][j].isShown || !gGame.isOn) return
    var negsCounter = minesNegsCount(i, j)

    if (gBoard[i][j].isMine === true) {
        gameOver()
        console.log('enter')
        renderCell({ i, j }, 'X')
        return
    }
    markedCell(i, j)

    if (negsCounter === 0 && gBoard[i][j].isMine !== true) {
        showNegs(i, j)
        return
    }
    if (negsCounter > 0 && gBoard[i][j].isMine !== true) {
        showCell(i, j)
        return
    }
}

function markedCell(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    lastCell.push(cell)
    for (var i = 0; i < lastCell.length; i++) {
        lastCell[i].isSelected = false
    }
    console.log(lastCell)
    cell.isSelected = true
}



function gameOver() {
    gGame.isOn = false
    document.querySelector('h1').innerText = 'Game Over!'
    document.querySelector('.modal').classList.remove('hidden')
}
function isVictory() {
    gGame.isOn = false
    document.querySelector('h1').innerText = 'Victory!'
    document.querySelector('.modal').classList.remove('hidden')
}



function showCell(cellI, cellJ) {
    gBoard[cellI][cellJ].isShown = true
    renderBoard(gBoard)
}



function minesNegsCount(cellI, cellJ) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}



function showNegs(cellI, cellJ) {
    var neighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if(gBoard[i][j].isMine){
                gBoard[i][j].isShown = false//delete
            }else{
                gBoard[i][j].isShown = true
            }
            renderBoard(gBoard)
            neighbors.push(gBoard[i][j], i, j)
        }
    }
    console.log(neighbors)
}