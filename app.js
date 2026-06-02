console.log("js is connected");
// DOM Elements
const mainList = document.querySelector(".main-list");
const expenseName = document.querySelector(".ex-name");
const expenseAmount = document.querySelector(".ex-amount");
const addBtn = document.querySelector(".add-btn");
const expenseCategory = document.querySelector("#ex-category");
const searchBtn = document.querySelector(".search-btn");
const totalAmount = document.querySelector("#total-amount");

let expenseArray = [];
let chart = null;

// Initialize App
init();

function init() {
    loadExpenses();
    addBtn.addEventListener('click', addExpense);
    searchBtn.addEventListener('click', filterByCategory);
    
    // Event delegation for delete and edit buttons
    mainList.addEventListener('click', handleListClick);
}

// Calculate and display total spend
function updateTotalSpend(arr) {
    const total = arr.reduce((sum, expense) => sum + Number(expense.amount), 0);
    totalAmount.innerHTML = `&#8377; ${total.toFixed(2)}`;
}

// Add Expense
function addExpense() {
    const name = expenseName.value.trim();
    const amount = expenseAmount.value.trim();
    const category = expenseCategory.value;

    if (!name || !amount || Number(amount) <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    // Prevent adding under "All" category
    if (category === "All") {
        alert("Please select a valid category.");
        return;
    }

    const expense = {
        id: Date.now().toString(), // String ID for consistency
        title: name,
        amount: parseFloat(amount),
        category: category
    };

    expenseArray.push(expense);
    
    // Reset inputs and refresh UI
    expenseName.value = "";
    expenseAmount.value = "";
    
    updateUI();
}

// Render entire list based on array provided
function renderList(arr) {
    mainList.innerHTML = "";
    
    if (arr.length === 0) {
        mainList.innerHTML = `<li class="empty-msg">No expenses found.</li>`;
        return;
    }

    arr.forEach(expense => {
        const li = document.createElement("li");
        li.dataset.id = expense.id;
        li.innerHTML = `
            <span class="ex-row">
                <p class="ex-title-text">${expense.title}</p>
                <small class="ex-category-tag">${expense.category}</small>
                <span class="action-div">
                    <p class="ex-amount-text">&#8377; ${expense.amount}</p>
                    <button class="edit-btn">Edit</button>
                    <button class="del-btn">Delete</button>
                </span>
            </span>
        `;
        mainList.appendChild(li);
    });
}

// Handle click events on list (Delete / Edit)
function handleListClick(event) {
    const target = event.target;
    const liElement = target.closest("li");
    if (!liElement || !liElement.dataset.id) return;
    
    const expenseId = liElement.dataset.id;

    if (target.classList.contains("del-btn")) {
        expenseArray = expenseArray.filter(exp => exp.id.toString() !== expenseId);
        liElement.remove();
        updateUI();
    } 
    
    if (target.classList.contains("edit-btn")) {
        const expense = expenseArray.find(exp => exp.id.toString() === expenseId);
        if (!expense) return;

        const newTitle = prompt("Edit expense title:", expense.title);
        const newAmount = prompt("Edit amount:", expense.amount);

        if (newTitle && newTitle.trim() !== "" && !isNaN(newAmount) && Number(newAmount) > 0) {
            expense.title = newTitle.trim();
            expense.amount = parseFloat(newAmount);
            updateUI();
        } else if (newTitle !== null || newAmount !== null) {
            alert("Invalid inputs. Changes not saved.");
        }
    }
}

// Filter expenses by category
function filterByCategory() {
    const selectedCategory = expenseCategory.value;
    if (selectedCategory === "All") {
        renderList(expenseArray);
        updateTotalSpend(expenseArray);
    } else {
        const filtered = expenseArray.filter(exp => exp.category === selectedCategory);
        renderList(filtered);
        updateTotalSpend(filtered);
    }
}

// Centralized state update
function updateUI() {
    saveExpenses();
    renderList(expenseArray);
    updateTotalSpend(expenseArray);
    drawChart();
}

// Storage operations
function saveExpenses() {
    localStorage.setItem("allExpense", JSON.stringify(expenseArray));
}

function loadExpenses() {
    const saved = localStorage.getItem("allExpense");
    if (saved) {
        expenseArray = JSON.parse(saved);
        updateUI();
    }
}

// Chart.js Data Prep
function getCategoryData() {
    const totals = {};
    expenseArray.forEach(expense => {
        totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount);
    });
    return totals;
}

// Draw/Update Chart
function drawChart() {
    const data = getCategoryData();
    const labels = Object.keys(data);
    const values = Object.values(data);
    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    if (labels.length === 0) return; // Don't draw an empty canvas

    chart = new Chart(ctx, {
        type: "doughnut", // Switched to doughnut—looks significantly cleaner for breakdown data!
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses Summary",
                data: values,
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#35a29f'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });        
}