'use strict'

const highScores = [localStorage.record]// to do
var firstClick
var gTimer
var gInterval
var gShownCount
var gMinesMarkedCounter = 0
var gNeighbors = []
var gStartTime
var gLives
var lastCell = []
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
    difficulty: 'Easy'
}

function onInit() {
    gLives = 2
    firstClick = 0
    document.querySelector('.lives').innerText = gLives
    gGame.isOn = true
    if (localStorage.record) {
        showHighScores(localStorage.record.split(','))
    }
    console.log(localStorage.record.split(','))
    resetGame()
    clearInterval(gInterval)
    // document.querySelector('.record').innerText = ''
    document.querySelector('.modal').classList.add('hidden')
    gBoard = createBoard()
    renderBoard(gBoard)
}

function createBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
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
    for (var i = 0; i < gLevel.MINES; i++) {
        board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
    }

    return board
}

// function setMines() {
//     var empty = getEmptyCells(gBoard)
//     console.log(empty)
//     for (var i = 0; i < gLevel.MINES; i++) {
//         gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
//     }
// }

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr\n>`
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var className = ''
            if (cell.isMine) className = 'mine'
            if (cell.isShown) className += ' shown'
            if (cell.isSelected) className = 'selected'

            var cellType
            if (cell.isShown) {
                cellType = minesNegsCount(i, j)
                cell.minesNegsCount = cellType
                if (cellType === 0) {
                    cellType = ''
                }
            } else {
                cellType = ''
            }
            if (cell.isMine && cell.isShown || cell.isMine && cell.isMarked) {
                cellType = '💣'
            }
            if (cell.isMarked) {
                cellType = '🚩'
            }
            strHtml += `\t<td data-i="${i}" data-j="${j}" class="cell-${i}-${j} ${className}"
             onclick="onClickCell(this, ${i},${j})" oncontextmenu="onRight(this, ${i}, ${j})">${cellType}</td>\n`
        }
        strHtml += `</tr>\n`
    }
    const elCell = document.querySelector('.container-matrix')
    elCell.innerHTML = strHtml
}

function onRight(e, i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown) return
    gGame.markedCount += 1
    document.querySelector('.marked-counter').innerText = gGame.markedCount
    gBoard[i][j].isMarked = true
    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
        gShownCount++
        console.log(gShownCount);
    }
    renderCell({ i, j }, '🚩')
    checkVictory()
    if (checkVictory() === true) {
        document.querySelector('.emoji').innerText = '😊'
        isVictory()
    }
    document.oncontextmenu = function (e) {
        e.preventDefault()
        return false
    }
}

function checkVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (gShownCount === (gLevel.SIZE ** 2)) {
                if (cell.isMarked)
                    return true
            }
        }
    }
}


function onClickCell(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isShown || !gGame.isOn) return
    if (!gInterval) {
        startTimer()
    }
    console.log(gShownCount);
    if (cell.isMine && cell.isShown === true) return


    markedCell(i, j)
    if (cell.isMine === true) {
        gLives--
        gShownCount++
        const elLives = document.querySelector('.lives')
        elLives.innerText = gLives
        cell.isShown = true
        renderCell({ i, j }, '💣')
        if (gLives <= 0) {
            gameOver()
        }
    }
    var negsCounter = minesNegsCount(i, j)
    cell.minesNegsCount = negsCounter

    console.log(cell)
    if (negsCounter === 0) {
        showNegs(i, j)
    }
    if (negsCounter > 0 && cell.isMine !== true) {
        showCell(i, j)
    }

    shownCount()
    checkVictory()
}

function markedCell(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    lastCell.push(cell)
    for (var i = 0; i < lastCell.length; i++) {
        lastCell[i].isSelected = false
    }
    cell.isSelected = true
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isShown = true
                renderBoard(gBoard)
            }
        }
    }
}

function gameOver() {
    revealMines()
    gGame.isOn = false
    clearInterval(gInterval)
    document.querySelector('h1').innerText = 'Game Over!'
    document.querySelector('.emoji').innerText = '😭'
    document.querySelector('.modal').classList.remove('hidden')
}
function isVictory() {
    gGame.isOn = false
    highScores.push(gTimer)
    localStorage.setItem('record', highScores)
    clearInterval(gInterval)
    document.querySelector('h1').innerText = 'Victory!'
    document.querySelector('.modal').classList.remove('hidden')
}

function showHighScores(highScores) {
    var bestScore = Infinity
    for (var i = 0; i < highScores.length; i++) {
        if (+highScores[i] < bestScore) {
            console.log(+highScores[i])
            bestScore = +highScores[i]
        }
    }
    console.log(bestScore);
    var strHtml = ''
    strHtml += `<ul>${bestScore}</ul>\n`
    const elRecords = document.querySelector('.record')
    elRecords.innerHTML = strHtml
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

function shownCount() {
    gShownCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown) {
                gShownCount++
            }
        }
    }
    document.querySelector('.shown-counter').innerText = gShownCount
}

function startTimer() {
    gTimer = 0
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        gTimer = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.timer')
        elH2.innerText = gTimer.toFixed(3)
    }, 10);
}
function resetGame() {
    document.querySelector('.emoji').innerText = '😌'
    clearInterval(gInterval)
    gInterval = null
    gLives = 2
    gGame.markedCount = 0
    document.querySelector('.marked-counter').innerText = gGame.markedCount
    showHints()
    gShownCount = 0
    document.querySelector('.shown-counter').innerText = gShownCount
    document.querySelector('.lives').innerText = gLives
    var elH2 = document.querySelector('.timer')
    elH2.innerText = '0.000'
}

function onHintClick(elBtn) {
    var emptyCell = emptyCellHint(gBoard)
    console.log(emptyCell)
    if (emptyCell === undefined) {
        return
    }
    elBtn.classList.add('hidden')
    renderCell(emptyCell, '💡')
}

function difficult(e) {
    if (e.outerText === 'Easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gLevel.difficulty = 'Easy'
        onInit()
    }
    if (e.outerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gLevel.difficulty = 'Medium'
        onInit()
    }
    if (e.outerText === 'Hard') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gLevel.difficulty = 'Hard'
        onInit()
    }
}
