const X_CLASS = ['x0', 'x1', 'x2']
const CIRCLE_CLASS = ['circle0', 'circle1', 'circle2']
const X = 'x'
const CIRCLE = 'c'
// 所有贏法
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

/*
    加alpha-beta  https://www.youtube.com/watch?v=LKhmyl4etnE&ab_channel=%E5%AE%89%E5%AE%89%E9%82%8A%E7%B7%A3%E5%AD%90
    minimax win不了會卡住
*/
var index = { 0: 'small', 1: 'medium', 2: 'large' }
const button1 = document.getElementById('small')
const button2 = document.getElementById('medium')
const button3 = document.getElementById('large')
var button_count_x = [3, 3, 3]
var button_count_c = [3, 3, 3]
var element_size = 0  // OX大小 small: 1 medium: 2 large: 3
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn
var element_size_old
startGame()
restartButton.addEventListener('click', startGame)

function startGame() {
  button1.disabled = false
  button2.disabled = false
  button3.disabled = false
  element_size_old = 0
  circleTurn = false
  button_count_x = [3, 3, 3]
  button_count_c = [3, 3, 3]
  document.getElementById('turn').textContent = 'Turn: X'
  document.getElementById('small').innerHTML = 'small: 3'
  document.getElementById('medium').innerHTML = 'medium: 3'
  document.getElementById('large').innerHTML = 'large: 3'
  cellElements.forEach(cell => {
    cell.classList.remove('x0', 'x1', 'x2')
    cell.classList.remove('circle0', 'circle1', 'circle2')
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick)
  })
  //setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

// 每回合 
var cellElements_old = new Array(9)
var element_old = 0  // 點選格子原OX之value: cell x0
function handleClick(e) {
  const cell = e.target // 點到的格子
  const currentClass = circleTurn ? CIRCLE_CLASS[element_size] : X_CLASS[element_size]

  // cell.classList.value: 該格前一value (cell x0)     .at(-1)
  // 刪原cell class 再新增(大的才可取代小的)
  element_old = cell.classList.value
  cell.classList.remove('x0', 'x1', 'x2')
  cell.classList.remove('circle0', 'circle1', 'circle2')
  cell.classList.add(currentClass)
  //console.log(cell.classList.value[5])  // 目前類別 x or c

  let B = { 'x': button_count_x[element_size], 'c': button_count_c[element_size] }
  // 相同不可再按
  console.log(cellElements)
  if (!ListsAreEqual(cellElements, cellElements_old)) {
    // 比較OX大小 l為還沒按過
    if ((element_size > element_old.at(-1)) || (element_old.at(-1) == 'l') && (B[currentClass[0]] > 0)) {
      // switch 顯示
      if (currentClass[0] == 'c') { document.getElementById('turn').textContent = 'Turn: X' }
      else { document.getElementById('turn').textContent = 'Turn: Circle' }
      // 顯示button剩餘次數, disable
      element_size_old = element_size
      button_check(currentClass, element_size_old)

      // copy list
      for (let i = 0; i < cellElements.length; i++) { cellElements_old[i] = cellElements[i].classList.value; }

      if (checkWin(currentClass)) { endGame(false) }
      else if (isDraw()) { endGame(true) }
      else { swapTurns() }
    }
    else {
      cell.classList.remove(currentClass)
      if (element_old.at(5) == 'x' && element_old.at(-1) != 'l')
        cell.classList.add('x' + element_old.at(-1))
      else if (element_old.at(5) == 'c' && element_old.at(-1) != 'l')
        cell.classList.add('circle' + element_old.at(-1))
      console.log('not allowed')
    }

    // ai move
    result = bestMove()
    // place mark
    console.log('new move '+ result[0])
    console.log('circle'+result[1])
    // 刪原本的在家
    let cellNameOld = cellElements[result[0]].classList.value
    let sizeOld = cellElements[result[0]].classList.value.at(-1)

    if(cellNameOld!='cell'){
      if(cellNameOld[5]=='c'){cellElements[result[0]].classList.remove('circle'+sizeOld)}
      else{cellElements[result[0]].classList.remove('x'+sizeOld)}
    }

    cellElements[result[0]].classList.add('circle'+result[1])
    button_count_c[result[1]] -= 1
    console.log(cellElements)
    circleTurn = true
    if (checkWin('c')) { endGame(false) }
    else if (isDraw()) { endGame(true) }
    else { swapTurns() }
    
  }
}

initial_move = [4, 0, 2, 6, 8]

// 人: x ai: circle
function bestMove() {
  let bestScore = -Infinity
  let Move
  let size
  let count = 0
  for (let i = 0; i < cellElements.length; i++) {
    if (cellElements[i].classList.value != 'cell')
      count++
  }
  if (count < 3) {
    for (let i = 0; i < 5; i++) {
      if (cellElements[initial_move[i]].classList.value == 'cell') {
        return [initial_move[i], 2]
      }
    }
  }


  for (let i = 0; i < cellElements.length; i++) {
    // 找可下之cell 
    for (let j = 2; j > -1; j--) {
      let classname = 0
      // 可蓋掉時 刪除原棋子
      size = j
      console.log('button_count '+button_count_c[j]+' j: '+j)
      if ((button_count_c[j] > 0) && (j > cellElements[i].classList.value.at(-1) || cellElements[i].classList.value == 'cell')) {
        console.log(i)
        console.log(j)
        if (cellElements[i].classList.value != 'cell') {
          classname = getClassname(cellElements[i].classList.value[5], cellElements[i].classList.value.at(-1))
          cellElements[i].classList.remove(classname)
        }

        cellElements[i].classList.add('circle' + j)
        button_count_c[j] -= 1
        let score = minimax(0, false) // ai 下完換human-> ismaximinzing = false
        cellElements[i].classList.remove('circle' + j)

        if (classname != 0) {
          cellElements[i].classList.add(classname)
        }
        button_count_c[j] += 1

        if (score > bestScore) {
          bestScore = score
          Move = i // 該格
        }
        console.log('move1 ' +Move)
        if (bestScore == 1) {
          return [Move, size]
        }
      }
    }
  }
  console.log(cellElements)
  console.log('move2 ' +Move)
  return [Move, size]
}

let scores = {
  c: 1,
  x: -1
}

function minimax(depth, isMaximizing) {
  // win: true, no win: false

  if (checkWin('c')) { return 1 }
  else if (checkWin('x')) { return -1 }
  // Draw score = 0
  else if (isDraw()) { return 0 }

  if (depth > 4) {
    return 0
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < cellElements.length; i++) {
      for (var j = 0; j < 3; j++) {
        if ((button_count_c[j] > 0) && (j > cellElements[i].classList.value.at(-1) || cellElements[i].classList.value == 'cell')) {
          console.log('button count c  '+button_count_c[j])
          let classname = 0
          if (cellElements[i].classList.value != 'cell') {
            classname = getClassname(cellElements[i].classList.value[5], cellElements[i].classList.value.at(-1))
            cellElements[i].classList.remove(classname)
          }

          cellElements[i].classList.add('circle' + j)
          button_count_c[j] -= 1
          let score = minimax(cellElements, depth + 1, false)

          cellElements[i].classList.remove('circle' + j)

          if (classname != 0) {
            cellElements[i].classList.add(classname)
          }
          button_count_c[j] += 1

          if (score > bestScore) {
            bestScore = score
          }
          console.log('bestsocre c '+bestScore)
          if (bestScore == 1) {
            return bestScore
          }

        }
      }
    }
    return bestScore
  }
  else {
    let bestScore = Infinity
    for (let i = 0; i < cellElements.length; i++) {
      for (var j = 0; j < 3; j++) {
        if ((button_count_x[j] > 0) && (j > cellElements[i].classList.value.at(-1) || cellElements[i].classList.value == 'cell')) {
          let classname = 0
          if (cellElements[i].classList.value != 'cell') {
            classname = getClassname(cellElements[i].classList.value[5], cellElements[i].classList.value.at(-1))
            cellElements[i].classList.remove(classname)
          }

          cellElements[i].classList.add('x' + j)
          button_count_x[j] -= 1
          let score = minimax(cellElements, depth + 1, true)

          cellElements[i].classList.remove('x' + j)
          if (classname != 0) {
            cellElements[i].classList.add(classname)
          }
          button_count_x[j] += 1
          if (score < bestScore) {
            bestScore = score
          }
          console.log('bestsocre x '+bestScore)
          if (bestScore == -1) { 
            console.log('x return')
            return bestScore }
        }
      }
    }
    return bestScore
  }

}

let classname_set = {
  'c': 'circle',
  'x': 'x'
}

function getClassname(name, size) {
  let result = classname_set[name] + size
  return result
}

function ListsAreEqual(cellElements, cellElements_old) {
  for (let i = 0; i < cellElements.length; ++i) {
    if (cellElements_old[i] != cellElements[i].classList.value) {
      return false
    }
  }
  return true
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}


function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
  }
  winningMessageElement.classList.add('show')
}


// return: false:還沒結束
function isDraw() {
  var empty = 0
  //console.log(cellElements[0].classList.value) cell 
  cellElements.forEach(function (cell) {
    if (cell.classList.value == 'cell') {
      empty = 1
    }
  });
  if (empty == 1) { return false }
  // 每格皆有東西
  // button_count[i]>0時 看每格是否可覆蓋(i>value.at(-1))  circleTurn false:x
  for (var i = 2; i > 0; i--) {
    // x 下完看circle還能不能動
    if (button_count_c[i] > 0) {
      cellElements.forEach(function (cell) {
        if (cell.classList.value.at(-1) < i) { empty = 1 }
      });
    }
    // circle完看X能不能動
    else if (button_count_x[i] > 0) {
      cellElements.forEach(function (cell) {
        if (cell.classList.value.at(-1) < i) { empty = 1 }
      });
    }
    if (empty == 1) { return false }
  }
  return true
}

function swapTurns() {
  circleTurn = !circleTurn
}

// 有錯
function checkWin(currentClass) {
  // combination: WINNING_COMBINATION中每個row 
  // some(): 測試陣列中是否至少有一個元素,有則 return true
  // combination.every(): 與combination完全相等時回傳true
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      if (cellElements[index].classList.value.at(5) == currentClass[0]) {
        return true
      }
    })
  })
}

function button_small() {
  element_size = 0
}

function button_medium() {
  element_size = 1
}

function button_large() {
  element_size = 2
}


function button_check(currentClass, element_size_old) {

  if (currentClass[0] == 'x' && button_count_x[element_size] > 0) {
    button_count_x[element_size] -= 1

    for (var i = 0; i < 3; i++) {
      document.getElementById(index[i]).innerHTML = index[i] + ': ' + button_count_c[i]
      if (button_count_c[i] == 0) {
        if (i == 0)
          button1.disabled = true
        else if (i == 1)
          button2.disabled = true
        else
          button3.disabled = true
      }
      else {
        if (i == 0)
          button1.disabled = false
        else if (i == 1)
          button2.disabled = false
        else
          button3.disabled = false
      }
    }

  }
  else if (currentClass[0] == 'c' && button_count_c[element_size] > 0) {
    button_count_c[element_size] -= 1
    for (var i = 0; i < 3; i++) {
      document.getElementById(index[i]).innerHTML = index[i] + ': ' + button_count_x[i]
      if (button_count_x[i] == 0) {
        if (i == 0)
          button1.disabled = true
        else if (i == 1)
          button2.disabled = true
        else
          button3.disabled = true
      }
      else {
        if (i == 0)
          button1.disabled = false
        else if (i == 1)
          button2.disabled = false
        else
          button3.disabled = false
      }
    }

  }
}