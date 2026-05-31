console.log("js is connected");
const mainList=document.querySelector(".main-list");
const expenceName=document.querySelector(".ex-name");
const expenceAmount=document.querySelector(".ex-amount");
const addBtn=document.querySelector(".add-btn");

let expenceArray=[];

function totalspend(){//function for adding all expences
        let total=0;
        expenceArray.forEach(expence =>{
          total =total + Number(expence.amount);
        });
        const totalAmount=document.querySelector("#total-amount");
        totalAmount.innerHTML="&#8377; "+total;
}

function addExpence(){//function for adding expence in list
        const exName=expenceName.value;
        const exAmount=expenceAmount.value;

        if(exName !== "" && exAmount !==""){
            let expence = {
                id:Date.now(),
                title:exName,
                amount:exAmount
            }
            expenceArray.push(expence);
            createList(expence);
            totalspend();
            expenceName.value="";
            expenceAmount.value="";
            console.log(expenceArray);
        }
        else{
                let warn=alert("Enter some values"); 
        }
}


function createList(expence){//function for creating list
        const li= document.createElement("li");
        li.dataset.id=expence.id;
        const span1 =document.createElement("span");
        const span2=document.createElement("span");
        const p1=document.createElement("p");
        const p2=document.createElement("p");
        const delBtn=document.createElement("button");
        const editBtn=document.createElement("button");

        span1.className="ex-row";
        span2.className="action-div";

        p1.innerHTML=expence.title;
        p2.innerHTML="&#8377; "+expence.amount;
        delBtn.innerText="Delete";
        delBtn.className="del-btn";
        editBtn.innerText="Edit";
        editBtn.className="edit-btn";
        
        span2.appendChild(p2);
        span2.appendChild(delBtn);
        span2.appendChild(editBtn);
        span1.appendChild(p1);
        span1.appendChild(span2);
        li.appendChild(span1);
        mainList.appendChild(li);

        editBtn.addEventListener('click',()=>{
                const newTitle=prompt("Enter new expence",expence.title);
                const newAmount=prompt("Enter new amount",expence.amount);

                if(newTitle !== null && newTitle.trim() !== ''){
                        expence.title=newTitle;
                        expence.amount=newAmount;

                        p1.innerHTML=expence.title;
                        p2.innerHTML="&#8377; "+expence.amount;
                        totalspend();
                }
        });
}

function delExpence(event){//function for deleting expence

     if( event.target.classList.contains("del-btn")){
          
        const liElement=event.target.closest("li");
        const expenceId=liElement.dataset.id;
        
        expenceArray=expenceArray.filter(expence => expence.id != expenceId);
        liElement.remove();

        totalspend();
        console.log(expenceArray);
       }
}


mainList.addEventListener('click',delExpence);
addBtn.addEventListener('click',addExpence);