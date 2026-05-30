console.log("js is connected");
const mainList=document.querySelector(".main-list");
const expenceName=document.querySelector(".ex-name");
const expenceAmount=document.querySelector(".ex-amount");
const addBtn=document.querySelector(".add-btn");


function addExpence(){
        const exName=expenceName.value;
        const exAmount=expenceAmount.value;

        if(exName !== ""){
            createList(exName,exAmount);
            expenceName.value="";
            expenceAmount.value="";
        }
}


function createList(name,amount){
        const li= document.createElement("li");
        const span =document.createElement("span");
        const p1=document.createElement("p");
        const p2=document.createElement("p");

        span.className="ex-row";

        p1.innerHTML=name;
        p2.innerHTML=amount;

        span.appendChild(p1);
        span.appendChild(p2);
        li.appendChild(span);
        mainList.appendChild(li);
}
addBtn.addEventListener('click',addExpence);