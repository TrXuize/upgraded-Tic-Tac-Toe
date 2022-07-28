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
    button disable後還可以用那類
*/
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
document.getElementById('turn').textContent = 'Turn: X'
startGame()
restartButton.addEventListener('click', startGame)

function startGame() {
  button1.disabled = false
  button2.disabled = false
  button3.disabled = false
  circleTurn = false
  button_count_x = [3, 3, 3]
  button_count_c = [3, 3, 3]
  document.getElementById('small').innerHTML = 'small: 3'
  document.getElementById('medium').innerHTML = 'medium: 3'
  document.getElementById('large').innerHTML = 'large: 3'
  cellElements.forEach(cell => {
    cell.classList.remove('x00', 'x11', 'x22')
    cell.classList.remove('circle00', 'circle11', 'circle22')
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick)
  })
  //setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

// 每回合 
var cellElements_old = new Array(9)
var element_old = 0  // 點選格子原OX之value: cell x00
function handleClick(e) {
  const cell = e.target // 點到的格子
  const currentClass = circleTurn ? CIRCLE_CLASS[element_size] : X_CLASS[element_size]
  if (currentClass[0] == 'c') {
    document.getElementById('turn').textContent = 'Turn: X'
  }
  else {
    document.getElementById('turn').textContent = 'Turn: Circle'
  }

  // cell.classList.value: 該格前一value (cell x00)     .at(-1)
  // 刪原cell class 再新增(大的才可取代小的)
  element_old = cell.classList.value
  cell.classList.remove('x00', 'x11', 'x22')
  cell.classList.remove('circle00', 'circle11', 'circle22')
  cell.classList.add(currentClass + element_size)

  //console.log(cell.classList.value[5])  // 目前類別 x or c
  
  
  let B = {'x':button_count_x[element_size], 'c':button_count_c[element_size]}
  // 相同不可再按
  if (!ListsAreEqual(cellElements, cellElements_old )) {
    // 比較OX大小 l為還沒按過
    if ((element_size > element_old.at(-1)) || (element_old.at(-1) == 'l') && (B[currentClass[0]]>0)) {
      if (checkWin(currentClass)) {
        endGame(false)
      } else if (isDraw() && button_is_zero()) {
        endGame(true)
      } else {
        swapTurns()
      }
      console.log('---------')
      if (currentClass[0] == 'x' && button_count_x[element_size] > 0) {
        button_count_x[element_size] -= 1
        if (element_size == 0)
          document.getElementById('small').innerHTML = 'small: ' + button_count_c[element_size]
        else if (element_size == 1)
          document.getElementById('medium').innerHTML = 'medium: ' + button_count_c[element_size]
        else
          document.getElementById('large').innerHTML = 'large: ' + button_count_c[element_size]
        if (button_count_c[element_size] == 0) {
          if (element_size == 0)
            button1.disabled = true
          else if (element_size == 1)
            button2.disabled = true
          else
            button3.disabled = true
        }
      }
      else if (currentClass[0] == 'c' && button_count_c[element_size] > 0) {
        button_count_c[element_size] -= 1
        if (element_size == 0)
          document.getElementById('small').innerHTML = 'small: ' + button_count_x[element_size]
        else if (element_size == 1)
          document.getElementById('medium').innerHTML = 'medium: ' + button_count_x[element_size]
        else
          document.getElementById('large').innerHTML = 'large: ' + button_count_x[element_size]
        if (button_count_x[element_size] == 0) {
          if (element_size == 0)
            button1.disabled = true
          else if (element_size == 1)
            button2.disabled = true
          else
            button3.disabled = true
        }
      }

      for (let i = 0; i < cellElements.length; ++i) {
        cellElements_old[i] = cellElements[i].classList.value;
      }
    }
    else {
      cell.classList.remove(currentClass + element_size)
      if (element_old.at(5) == 'x')
        cell.classList.add('x' + element_old.at(-1) + element_old.at(-1))
      else
        cell.classList.add('circle' + element_old.at(-1) + element_old.at(-1))
      console.log('not allowed')
    }
  
  }

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
  cell.classList.add(currentClass + element_size)
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
  }
  winningMessageElement.classList.add('show')
}

function isDraw() {
  return [...cellElements].every(cell => {
    return (cell.classList.contains('x00') || cell.classList.contains('x11') || cell.classList.contains('x22') || cell.classList.contains('circle00') || cell.classList.contains('circle11') || cell.classList.contains('circle22'))
  })
}
// loop all 看每格還能不能被蓋
function button_is_zero(){
  for(var i=1; i<3; i++){
    if((button_count_c[i] !=0) || button_count_x[i]!=0)
      return false 
  }
  return true
}

function swapTurns() {
  circleTurn = !circleTurn
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      console.log(cellElements[index].classList.value)
      if (cellElements[index].classList.value.at(5) == currentClass[0]){ 
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
