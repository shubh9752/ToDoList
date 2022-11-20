//declaration
const inputBox = document.querySelector(".inputField input");
const submitBtn = document.querySelector(".inputField button");
const filters = document.querySelectorAll(".filters span");
const deleteAllTasks = document.querySelector(".clearAllTask");
const taskList = document.querySelector(".task-box");

let pendingPara = document.getElementById("left");


let editId;
let isEdited = false;
let todos = JSON.parse(localStorage.getItem("todo-data")); //getting localstorage todo-data and transforming json string into a js objesct

//time and date for display
const today =
  new Date().toDateString().split(" ").slice(0, 1) +
  ", " +
  new Date().toDateString().split(" ").slice(1, 4).join(" ");

const setTime = document.getElementById("today");
const onDisplay = document.getElementsByClassName("display");
setTime.addEventListener("mouseover", () => {
  setTime.textContent = today;
});

//for filter div sections 
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTasks(btn.id);
  });
});

//show the task in list
showTasks = (filter) => {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      //if todo status is completed,set the isCompleted value to checked
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        //filtering data and adding in tasks list
        li += `<li class="task">
        <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted} >
            <p class="${isCompleted}">${todo.name}</p>
        </label>
        <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="task-menu count">
                <li onclick='editTask(${id},"${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteTask(${id},'${filter}')"><i class="uil uil-trash"></i>Delete</li>
            </ul>
        </div>
         </li>`;
      }
    });

    taskList.innerHTML = li;
    //adding classes in clear all btn
    taskLeft();
    let checkList = taskList.querySelectorAll(".task");
    !checkList.length
      ? deleteAllTasks.classList.remove("active")
      : deleteAllTasks.classList.add("active");
    taskList.offsetHeight >= 300
      ? taskList.classList.add("overflow")
      : taskList.classList.remove("overflow");
  }
};
showTasks("all");

//to show the menu of edit and delete option
function showMenu(selectedTask) {
  //getting task menu div
  let taskOpt = selectedTask.parentElement.lastElementChild;
  taskOpt.classList.add("show");
  document.addEventListener("click", (e) => {
    //removing show class from window when someone click outside menu
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskOpt.classList.remove("show");
    }
  });
}
//creating function for edit option
function editTask(editId1, taskName) {
  editId = editId1;
  isEdited = true;
  inputBox.value = taskName;
  inputBox.focus();
  inputBox.classList.add("active");
}

//function for task deletion
function deleteTask(deleteId, filter) {
  //console.log(deleteId)
  //removing  selected task from the task list
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-data", JSON.stringify(todos));
  taskLeft();
  showTasks(filter);
}

//clearing all tasks || deleting all task
deleteAllTasks.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-data", JSON.stringify(todos));
  taskLeft();
  showTasks();
});

//update status =completed/pending
function updateStatus(checkBox) {
  //getting paragraph that contains task or checkbox
  let taskName = checkBox.parentElement.lastElementChild;
  if (checkBox.checked) {
    taskName.classList.add("checked");
    //updating the status of selected task to comleted 
    todos[checkBox.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    //updating the status of selected task to pending
    todos[checkBox.id].status = "pending";
  }
  console.log(todos);
  taskLeft();
  localStorage.setItem("todo-data", JSON.stringify(todos));
}

//shows the task left
function taskLeft(){  
  var counter = {};
  for (var i = 0; i < todos.length; i += 1) { //for countin status length 
    counter[todos[i].status] = (counter[todos[i].status] || 0) + 1;
  }

  for (var key in counter) {
    if (counter[key] > 1) {
      console.log("we have ", key, "  status ", counter[key], " times");
    }
  }
  if(counter.pending==undefined){
    pendingPara.innerHTML="0";
    return;
  }
  
  pendingPara.innerHTML=counter.pending;
  console.log(counter);
}

//adding event listner in submitbottn so whenever someone press button task added 
submitBtn.addEventListener("click", () => {
  let userData = inputBox.value.trim();
  if (!isEdited) {
    if (!todos) {
      //if todo isn't exist then pass an empty array to todos
      todos = [];
    }
    let taskData = { name: userData, status: "pending" };
    todos.push(taskData); // adding a new data or task in todos storage
  } else {
    isEdited = false;
    todos[editId].name = userData;
  }

  inputBox.value = "";
  submitBtn.classList.remove("submit");
  taskLeft();
  localStorage.setItem("todo-data", JSON.stringify(todos)); //transforming js object into a json string

  showTasks(document.querySelector("span.active").id);
});

inputBox.addEventListener("keyup", (e) => {
  let userData = inputBox.value.trim();
  if (userData != 0) {
    //if the user value isn't only spaces
    submitBtn.classList.add("submit"); //active the add button
  } else {
    submitBtn.classList.remove("submit"); //unactive the add button
  }
  if (e.key == "Enter" && userData) {
    // console.log(userData)
    if (!isEdited) { //if isedited is not true
      if (!todos) {
        //if todo isn't exist then pass an empty array to todos list
        todos = [];
      }
      let taskData = { name: userData, status: "pending" };//by default tsk status is pending
      console.log(taskData);
      objectLength = Object.keys(taskData).length;
      console.log(objectLength);
      todos.push(taskData); // adding a new data or task in todos storage
    } else {
      isEdited = false;
      todos[editId].name = userData;
    }

    inputBox.value = "";
    submitBtn.classList.remove("submit");
    console.log("todos data ", todos);
    taskLeft();
    localStorage.setItem("todo-data", JSON.stringify(todos)); //transforming js object into a json string & saving todo-data in todos

    showTasks(document.querySelector("span.active").id);
  }
});
