const leftBtn = document.querySelector("#btn_l")
const rightBtn = document.querySelector("#btn_r")
const field = document.querySelectorAll(".card")

let list = document.querySelector(".history")
const addBtn = document.getElementById("add-button")
// localStorage.clear()

let max_value = 1000

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

let move = 0
const xValues = [];
const yValues = [];
let updateGraph = true;
let counter = 1;
rightBtn.style.background = "grey"

console.log("working")

field.forEach((card, index) => {
    card.style.left = `${index*100}%`
})

const slideCard = () => {
    field.forEach((card, index) => {
        card.style.transform = `translateX(${move*100}%)`
    })
}

leftBtn.addEventListener('click', () => {
    if(move == 0) return
    move = 0
    leftBtn.style.background = "black"
    rightBtn.style.background = "grey"
    console.log(move)
    slideCard()
})

rightBtn.addEventListener('click', () => {
    if(move == -1) return
    move = -1 
    rightBtn.style.background = "black"
    leftBtn.style.background = "grey"
    console.log(move)
    slideCard()
})

const addTransaction = () => {
    const transType = document.getElementById("select-box")
    const textEntered = document.getElementById("text-input")
    const amtEntered = document.getElementById("amount-input")

    if(textEntered.value.trim() === '' || amtEntered.value.trim() === ''){
        alert('please add transaction name and amount')
        return
      }
    
    const transaction = {
        id: generateID(),
        sign : transType.value,
        text: textEntered.value,
        amount: amtEntered.value
    }

    let sign = ''
    let symb = ''
    if(transType.value == 'savings')
    {
        sign = 'plus'
        symb = '+'
    }
    else
    {
        sign = 'minus'
        symb = '-'
    }
    
    const element = document.createElement('div')
    element.classList.add(sign)
    element.setAttribute("id", "trans")

    element.innerHTML = `
        <span>
            <button onclick="removeTransaction(${transaction.id})">X</button>
        </span>
        <span>
            <h4 class="text">${textEntered.value}</h4>
            <h4 class="amount">${symb} ₹${amtEntered.value}</h4>
        </span>
    `
    list.appendChild(element)

    transactions.push(transaction);
    updateLocalStorage()
    updateGraph = true
    updateValues()
    
}

function refereshList(transaction){
    console.log(transaction)
    let sign = ''
    let symb = ''
    if(transaction.sign == 'savings')
    {
        sign = 'plus'
        symb = '+'
    }
    else
    {
        sign = 'minus'
        symb = '-'
    }
    
    const element = document.createElement('div')
    element.classList.add(sign)
    element.setAttribute("id", "trans")

    element.innerHTML = `
        <span>
            <button onclick="removeTransaction(${transaction.id})">X</button>
        </span>
        <span>
            <h4 class="text">${transaction.text}</h4>
            <h4 class="amount">${symb} ₹${transaction.amount}</h4>
        </span>
    `
    list.appendChild(element)
    if(updateGraph)
    {
        yValues.push(transaction.amount)
        xValues.push(counter)
        console.log(yValues)
        console.log(xValues)
        counter++
        createGraph()
    }
}

function removeTransaction(id){
    // transactions = transactions.filter((trans) => trans.id !== id);
    transactions = transactions.filter(transaction => transaction.id !== id);
    console.log(transactions)
    updateLocalStorage();
    updateValues();
    list.innerHTML = `
        <h4 class="text">History</h4>
        <div class="line"></div>
        `
    transactions.forEach(refereshList);
  }

function generateID(){
    return Math.floor(Math.random()*1000000000);
}

function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
}

function updateValues(){
    const totalAmt = document.querySelector(".account-balance")
    const savingsAmt = document.querySelector("#saving-amount")
    const expenseAmt = document.querySelector("#expense-amount")

    let savings = 0
    let expense = 0

    transactions.map((trans) => {
        if(trans.sign == 'savings')
            savings += parseFloat(trans.amount)
        else    
            expense += parseFloat(trans.amount)
    })

    savingsAmt.innerHTML = savings.toFixed(2)
    expenseAmt.innerHTML = expense.toFixed(2)
    totalAmt.innerHTML = (savings - expense).toFixed(2)

    if(updateGraph)
    {
        yValues.push(totalAmt.innerHTML)
        xValues.push(counter)
        console.log(yValues)
        console.log(xValues)
        counter++
        updateGraph = false
        createGraph()
    }
}

addBtn.addEventListener('click', addTransaction)

transactions.forEach(refereshList)
updateGraph = false
updateValues()


function createGraph(){
    max_value = Math.max(...yValues);
    new Chart("my-chart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
          }]
        },
        options: {
          legend: {display: false},
        //   events: ['click'],
          scales: {
            yAxes: [{ticks: {min: 0, max:max_value}}],
          }
        }
      });
}

createGraph()