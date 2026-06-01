console.log("js is connected");
const mainList=document.querySelector(".main-list");
const expenseName=document.querySelector(".ex-name");
const expenseAmount=document.querySelector(".ex-amount");
const addBtn=document.querySelector(".add-btn");
const expenseCategory=document.querySelector("#ex-category");
const searchBtn=document.querySelector(".search-btn");

let expenseArray=[];
loadExpense();

function totalspend(arr){//function for adding all expences
        let total=0;
        arr.forEach(expense =>{
          total =total + Number(expense.amount);
        });
        const totalAmount=document.querySelector("#total-amount");
        totalAmount.innerHTML="&#8377; "+total;
}

function addExpense(){//function for adding expence in list
        const exName=expenseName.value.trim();
        const exAmount=expenseAmount.value;
        const exCategory=expenseCategory.value;

        if(exName !== "" && exAmount !==""){
            let expense = {
                id:Date.now(),
                title:exName,
                amount:exAmount,
                category:exCategory
            }
            expenseArray.push(expense);
            createList(expense);
            totalspend(expenseArray);
            saveExpense();
            expenseName.value="";
            expenseAmount.value="";
            console.log(expenseArray);
        }
        else{
                let warn=alert("Enter some values"); 
        }
}


function createList(expense){//function for creating list
        const li= document.createElement("li");
        li.dataset.id=expense.id;
        const span1 =document.createElement("span");
        const span2=document.createElement("span");
        const p1=document.createElement("p");
        const p2=document.createElement("p");
        const delBtn=document.createElement("button");
        const editBtn=document.createElement("button");
        const category=document.createElement("small");

        span1.className="ex-row";
        span2.className="action-div";

        p1.innerHTML=expense.title;
        p2.innerHTML="&#8377; "+expense.amount;
        delBtn.innerText="Delete";
        delBtn.className="del-btn";
        editBtn.innerText="Edit";
        editBtn.className="edit-btn";
        category.textContent=expense.category;
        
        span2.appendChild(p2);
        span2.appendChild(delBtn);
        span2.appendChild(editBtn);
        span1.appendChild(p1);
        span1.appendChild(category);
        span1.appendChild(span2);
        li.appendChild(span1);
        mainList.appendChild(li);

        editBtn.addEventListener('click',()=>{
                const newTitle=prompt("Enter new expence",expense.title);
                const newAmount=prompt("Enter new amount",expense.amount);

                if(newTitle !== null && newTitle.trim() !== ''){
                        expense.title=newTitle;
                        expense.amount=newAmount;

                        p1.innerHTML=expense.title;
                        p2.innerHTML="&#8377; "+expense.amount;
                        saveExpense();
                        totalspend(expenseArray);
                }
        });
}

function delExpense(event){//function for deleting expence

     if( event.target.classList.contains("del-btn")){
          
        const liElement=event.target.closest("li");
        const expenseId=liElement.dataset.id;
        
        expenseArray=expenseArray.filter(expense => expense.id != expenseId);
        liElement.remove();

        totalspend(expenseArray);
        saveExpense();
        console.log(expenseArray);
       }
}

function saveExpense(){//funtion to save expences in localStorage
        localStorage.setItem("allExpense",JSON.stringify(expenseArray));
}

function loadExpense(){
        let loadEx=localStorage.getItem("allExpense");

        if(loadEx){
          let parseEx=JSON.parse(loadEx);//parsing data 

          expenseArray=parseEx;
          expenseArray.forEach(expense=>{//creating list for each expence
                createList(expense);
              
          });
          totalspend(expenseArray);
        }
} 

function search(){//function for filtering by category
        const searchCategory=expenseCategory.value;//store search category
        if(searchCategory=="All"){
            renderSearch(expenseArray);
            totalspend(expenseArray);
        }
        else
        {
          const filtered = expenseArray.filter(expense => expense.category === searchCategory);//filter search
          console.log(filtered);
          renderSearch(filtered);
          totalspend(filtered);
        }
}

function renderSearch(arr){//helper function for rendering searched category
        mainList.innerHTML="";
        arr.forEach(x=>createList(x));
}

searchBtn.addEventListener('click',search);
mainList.addEventListener('click',delExpense);
addBtn.addEventListener('click',addExpense);