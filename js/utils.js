'use strict'

function drawNum(nums) {
    var randIdx = getRandomInt(0, nums.length)
    var num = nums[randIdx]
    nums.splice(randIdx, 1)
    return num
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function shuffle(items) {
    var randIdx, keep;
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function getTime() {
    return new Date().toString().split(' ')[4];
}

function getEmptyCells(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isShown && !board[i][j].isMine) {
                emptyCells.push({ i, j })
            }
        }
    }
    return (shuffle(emptyCells))
}

function emptyCellHint(board) {
    const emptyCells = []
    console.log(negsCounter)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isShown) continue
            if (board[i][j].isMine) continue
            var negsCounter = minesNegsCount(i, j)
            if (negsCounter === 0 || negsCounter === 1) {
                emptyCells.push({ i, j })
            }
        }
    }
    return (drawNum(shuffle(emptyCells)))
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" class="${className} ">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    console.log(cellSelector)
    elCell.innerHtml = value

}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++
        }
    }
    return neighborsCount
}

function showHints() {
    for (var i = 1; i <= 3; i++) {
        document.querySelector(`.hint-${i}`).classList.remove('hidden')
    }
}

function showElement(selector) {
    document.querySelector(`${selector}`).classList.remove('hidden')
}
function hideElement(selector) {
    document.querySelector(`${selector}`).classList.add('hidden')
}


function showNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            gBoard[i][j].isShown = true
            renderBoard(gBoard)
            gNeighbors.push({ i, j })
        }
    }
    console.log(gNeighbors)
}
