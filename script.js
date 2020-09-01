
let tasksList = [];
let taskIdCounter;

const formEl = document.querySelector('.add-task');
 

formEl.addEventListener('submit', (event) => {
  event.preventDefault(); //don't refresh the page
  //Add new task
  const formEl = event.currentTarget;
  const taskId = addNewTaskData(formEl.addTaskInput.value, formEl.importance.value, new Date());
  addNewTaskEl(taskId);
  //Clear current task input
  formEl.addTaskInput.value = "";
  formEl.addTaskInput.blur();

  addTaskToLocalStorage(taskId);
});


/** Handle delete click event on Task item */
function deleteTaskHandler(currentDeleteBtnEl, taskId){
  deleteTaskData(taskId);
  deleteTaskEl(currentDeleteBtnEl);
  removeTaskFromLocalStorage(taskId);
}
/** Handle update event on Task item */
function updateTaskHandler(currentTaskInputEl, taskId){
  const updatedTaskContent = currentTaskInputEl.value;
  updateTaskData(taskId, updatedTaskContent);
  updateTaskEl(currentTaskInputEl, updatedTaskContent);
  updateTaskToLocalStorage(taskId);
}

/** Add new task element */
function addNewTaskEl(taskId){
  const taskData = getTaskById(taskId);
  
  const tasksContainerEl = document.querySelector('.tasks-list');
  //Create task container element
  const taskContainerEl = document.createElement('div');
  taskContainerEl.classList.add('task-item');
  //Create content element
  const taskEl = document.createElement('input');
  taskEl.classList.add('list-item-input');
  taskEl.setAttribute("type", "text");
  taskEl.setAttribute("value", taskData.task);
  taskEl.addEventListener('keyup', (event) => {
    if(event.key === 'Enter'){
      updateTaskHandler(event.currentTarget, taskData.id);
    }
  });
  //Create Task meta container element
  const taskMetaContainerEl = document.createElement('div');
  taskMetaContainerEl.classList.add('task-item-meta');
  //Create Date elements
  const dateEl = document.createElement('div');
  dateEl.textContent = taskData.date
  //Create Delete button
  const deleteBtnEl = document.createElement('button');
  deleteBtnEl.classList.add('far', 'fa-trash-alt');
  deleteBtnEl.addEventListener('click', (event) => deleteTaskHandler(event.currentTarget, taskData.id));
  //Create Appends
  taskMetaContainerEl.appendChild(dateEl);
  taskMetaContainerEl.appendChild(deleteBtnEl);
  taskContainerEl.appendChild(taskEl);
  taskContainerEl.appendChild(taskMetaContainerEl);
  tasksContainerEl.appendChild(taskContainerEl);
}
/** Remove task element */
function deleteTaskEl(currentDeleteBtnEl){
  const taskItem = currentDeleteBtnEl.closest('.task-item');
  taskItem.remove();
}
/** Update task element with new task content */
function updateTaskEl(currentTaskInputEl, updatedTaskContent){
  currentTaskInputEl.setAttribute("value", updatedTaskContent);
  currentTaskInputEl.blur();
}

/*********************** Local Storage ***************************/
function addTaskToLocalStorage(taskId){
  const taskJson = JSON.stringify(getTaskById(taskId));
  localStorage.setItem(taskId, taskJson);
  console.log("new local");
  localStorage.setItem("taskId", taskId.toString());
}
function updateTaskToLocalStorage(taskId){
  const taskJson = JSON.stringify(getTaskById(taskId));
  localStorage.setItem(taskId, taskJson);
}
function removeTaskFromLocalStorage(taskId){
  localStorage.removeItem(taskId);
}

/*********************** Data ***********************************/
/** Add new task object to tasks list */
function addNewTaskData(task, importanceLevel, date){
  tasksList.push({
    id: taskIdCounter,                             //number
    task: task,                             //string 
    importance: importanceLevel,            //number
    date: parseDate(date)                   //string
  });
  const currentTaskId = taskIdCounter;
  taskIdCounter++;
  return currentTaskId;
}
/** Delete task object from tasks list */
function deleteTaskData(taskId){
  const taskIndex = tasksList.findIndex((task) => taskId === task.id);
  tasksList.splice(taskIndex, 1);
}
/** Update task string inside tasks list */
function updateTaskData(taskId, updatedTaskContent){
  const task = tasksList.find((task) => taskId === task.id);
  task.task = updatedTaskContent;
};

/** Get task object by its id */
function getTaskById(taskId){
  return tasksList.find((task) => task.id === taskId);
}
/** Retrieve date string pattern -> day-month-year */
function parseDate(date){
  return `${date.getDate()}-${date.getMonth() + 1}-${ date.getFullYear()}`
}

/**************************** Init ************************************ */
function initApp(){
  let taskId = localStorage.getItem('taskId');

  if(!taskId){ 
    taskIdCounter = 0;
    console.log('new Storage');
  } else {
    taskIdCounter = parseInt(taskId) + 1;
    for(let i = 0; i<localStorage.length; i++){
      const strTaskObj = localStorage.getItem(localStorage.key(i));
      console.log(strTaskObj);
      const taskObj = JSON.parse(strTaskObj);
      console.log(taskObj);
      if(typeof taskObj === 'object'){
        tasksList.push(taskObj);
        addNewTaskEl(taskObj.id);
      }
    }  
  }
}
initApp();



