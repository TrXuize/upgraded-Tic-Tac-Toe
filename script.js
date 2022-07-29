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
    minimax
*/
var index = {0: 'small', 1: 'medium', 2: 'large'}
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
  
  let B = {'x':button_count_x[element_size], 'c':button_count_c[element_size]}
  // 相同不可再按
  if (!ListsAreEqual(cellElements, cellElements_old )) {
    // 比較OX大小 l為還沒按過
    if ((element_size > element_old.at(-1)) || (element_old.at(-1) == 'l') && (B[currentClass[0]]>0)) {
      // switch 顯示
      if (currentClass[0] == 'c') {document.getElementById('turn').textContent = 'Turn: X'}
      else {document.getElementById('turn').textContent = 'Turn: Circle'}
      // 顯示button剩餘次數, disable
      element_size_old = element_size
      button_check(currentClass, element_size_old)

      for (let i = 0; i < cellElements.length; i++) {cellElements_old[i] = cellElements[i].classList.value;}

      if (checkWin(currentClass)) {endGame(false)} 
      else if (isDraw()) {endGame(true)}
      else {swapTurns()}
    }
    else {
      cell.classList.remove(currentClass)
      if (element_old.at(5) == 'x' && element_old.at(-1)!='l')
        cell.classList.add('x' + element_old.at(-1))
      else if(element_old.at(5) == 'c' && element_old.at(-1)!='l')
        cell.classList.add('circle' + element_old.at(-1))
      console.log('not allowed')
    }
    //console.log(cellElements)
    
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
function isDraw(){
  var empty = 0
  //console.log(cellElements[0].classList.value) cell 
  cellElements.forEach(function(cell){
    if(cell.classList.value=='cell'){
      empty = 1
    }
  });
  if (empty == 1){return false}
  // 每格皆有東西
  // button_count[i]>0時 看每格是否可覆蓋(i>value.at(-1))  circleTurn false:x
  for(var i=2; i>0; i--){
    // x 下完看circle還能不能動
    if(button_count_c[i]>0){
      cellElements.forEach(function(cell){
        if(cell.classList.value.at(-1)<i){empty = 1}});
    }
    // circle完看X能不能動
    else if(button_count_x[i]>0){
      cellElements.forEach(function(cell){
        if(cell.classList.value.at(-1)<i){empty = 1}
      });
    }
    if (empty == 1){return false}
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
    //console.log(combination)
    return combination.every(index => {
      //console.log(cellElements[index].classList.value.at(-1))
      if (cellElements[index].classList.value.at(5) == currentClass[0]){  
        //console.log(cellElements[index].classList.value)
        //onsole.log(cellElements[index].classList.value.at(5) + " if中  "+currentClass[0]+"  index: "+index)
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
    
    for(var i=0; i<3; i++){
      document.getElementById(index[i]).innerHTML = index[i] +': ' + button_count_c[i]
      if(button_count_c[i] == 0){
        if(i==0)
          button1.disabled = true
        else if(i==1)
          button2.disabled = true
        else
          button3.disabled = true
      }
    }

  }
  else if (currentClass[0] == 'c' && button_count_c[element_size] > 0) {
    button_count_c[element_size] -= 1
    for(var i=0; i<3; i++){
      document.getElementById(index[i]).innerHTML = index[i] +': ' + button_count_x[i]
      if(button_count_c[i] == 0){
        if(i==0)
          button1.disabled = true
        else if(i==1)
          button2.disabled = true
        else
          button3.disabled = true
      }
    }

  }
}