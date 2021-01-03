let input = null;
let arrayValues = [];
// let arrayValues = JSON.parse(localStorage.getItem('tasks')) || [];
let value = '';
let activeTaskEdit = null;

window.onload = function initPage() {
  input = document.getElementById('main_input_task')
  input.addEventListener('change', changeValue);
  render();
}

function render() {
  const parentBlock = document.getElementById('block-content-tasks');
  while (parentBlock.firstChild) {
    parentBlock.removeChild(parentBlock.firstChild);
  }

  arrayValues.map((task, index) => {
    const taskBlock = document.createElement('div');
    taskBlock.id = `task-container-${index}`;
    taskBlock.className = 'task-container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.isCheck;
    checkbox.onclick = function() {
      changeCheckbox(index);
    }
    taskBlock.appendChild(checkbox);

    if(activeTaskEdit >= 0 && activeTaskEdit === index) {
      const inputTaskEdit = document.createElement('input');
      inputTaskEdit.value = task.text;
      inputTaskEdit.addEventListener('change', editTask);
      inputTaskEdit.addEventListener('blur', doneEditTask);
      taskBlock.appendChild(inputTaskEdit);
    } else {
      const text = document.createElement('span');
      text.innerText = task.text;
      text.className = task.isCheck ? 'done-task-text' : 'text-task';
      taskBlock.appendChild(text);
    }

    if(!task.isCheck) {
      if(activeTaskEdit >= 0 && activeTaskEdit === index) {
        const buttonDoneEdit = document.createElement('img');
        buttonDoneEdit.src = 'images/done.svg';
        buttonDoneEdit.onclick = function() {
          doneEditTask();
        }
        taskBlock.appendChild(buttonDoneEdit);
      } else {
        const buttonEdit = document.createElement('img');
        buttonEdit.src = 'images/edit.svg';
        buttonEdit.onclick = function() {
          activeTaskEdit = index;
          render();
        }
        taskBlock.appendChild(buttonEdit);
      }
  
      const buttonDelete = document.createElement('img');
      buttonDelete.src = 'images/close.svg';
      buttonDelete.onclick = function() {
        deleteTask(index);
      }
      taskBlock.appendChild(buttonDelete);
    }

    parentBlock.appendChild(taskBlock);
  });
}

function addNewTask() {
  arrayValues.push({text: value, isCheck: false});
  // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  input.value = '';
  value = '';
  render();
}

function changeValue(e) {
	value = e.target.value;
}

function changeCheckbox(index) {
  arrayValues[index].isCheck = !arrayValues[index].isCheck;
  // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  render(); 
}

function editTask(e) {
  arrayValues[activeTaskEdit].text = e.target.value; 
}

function deleteTask(index) {
  arrayValues.splice(index, 1);
  // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  render();
}

function doneEditTask() {
  activeTaskEdit = null;
  // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  render();
}