const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input"); 
const toDoList = document.querySelector(".toDoList");
const finList = document.querySelector(".finList");

const TODOS_LS = "PENDING";
const FIN_LS = "FINISHED";

let toDos = [];
let fins = [];

function deleteToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);

    const cleanToDos = toDos.filter(function(toDo){ // toDos array 안에서 해당되는 것을 가져오는 것
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
}

function deleteFin(event) {
    const btn = event.target;
    const li = btn.parentNode;
    finList.removeChild(li);
  
    const cleanFins = fins.filter(function (fin) {
      return fin.id !== parseInt(li.id);
    });
    fins = cleanFins;
    saveFins();
}

function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function saveFins() {
    localStorage.setItem(FIN_LS, JSON.stringify(fins));
}

function finishing(event) {
    const btn = event.target;
    const li = btn.parentNode;
    const txt = li.querySelector("span");
  
    paintFin(txt.innerText);
    deleteToDo(event);
    saveFins();
    //todo에서 finished로 보내기
}

function paintToDo(text){
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const finBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteToDo);
    finBtn.innerText = "✅";
    finBtn.addEventListener("click", finishing);
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(finBtn);
    li.id = newId;
    toDoList.appendChild(li);
    const toDoObj = {
      text: text,
      id: newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = ""; // submit된 후엔 초기화돼서 새로운 것 제출 가능케 함
}

function restore(event) {
    const btn = event.target;
    const li = btn.parentNode;
    const txt = li.querySelector("span");
  
    paintToDo(txt.innerText);
    deleteFin(event);
    saveToDos();
    //finished에서 pending으로 보내기
}

function paintFin(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const resBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = fins.length + 1;
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteFin);
    resBtn.innerText = "⏪";
    resBtn.addEventListener("click", restore);
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(resBtn);
    li.id = newId;
    finList.appendChild(li);
    const finObj = {
      text: text,
      id: newId
    };
    fins.push(finObj);
    saveFins();
}

function loadToDos(){
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if(loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos); // string이었던 것 object로 변경

        parsedToDos.forEach(function(toDo){ // 배열에 대해서 forEach 사용하면 각 value에 모두 이걸 해줄 수 있음
            paintToDo(toDo.text);
        })
    } 
}

function loadFins() {
    const loadedFins = localStorage.getItem(FIN_LS);
    if (loadedFins !== null) {
      const parsedFins = JSON.parse(loadedFins);
  
      parsedFins.forEach(function (fin) {
        paintFin(fin.text);
      });
    }
  }

function init(){
    loadToDos();
    loadFins();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();