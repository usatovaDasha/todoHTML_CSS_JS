let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
let activeEditTask = null;

window.onload = async function init() {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false
  });
  await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false
    })
  });
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  render();
}

updateValue = (event) => {
  valueInput = event.target.value;
}

render = () => {
  const content = document.getElementById('content-page');
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
  allTasks.map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (index === activeEditTask) {
      const inputTask = document.createElement('input');
      inputTask.type = 'text';
      inputTask.value = item.text;
      inputTask.addEventListener('change', updateTaskText);
      inputTask.addEventListener('blur', doneEditTask);
      container.appendChild(inputTask);
    } else {
      const text = document.createElement('p');
      text.innerText = item.text;
      text.className = item.isCheck ? 'text-task done-text' : 'text-task';
      container.appendChild(text);
    }

    if(!item.isCheck) {
      if (index === activeEditTask) {
        const imageDone = document.createElement('img');
        imageDone.src = 'images/done.svg';
        imageDone.onclick = function () {
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/edit.svg';
        imageEdit.onclick = function () {
          activeEditTask = index;
          render();
        };
        container.appendChild(imageEdit);
      }
      
      const imageDelete= document.createElement('img');
      imageDelete.src = 'images/close.svg';
      imageDelete.onclick = function () {
        onDeleteTask(index);
      }
      container.appendChild(imageDelete);
    }

    content.appendChild(container);
  });
}

onChangeCheckbox = async (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(allTasks[index])
  });
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

onDeleteTask = async (index) => {
  await fetch(`http://localhost:8000/deleteTask?_id=${allTasks[index]._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
  allTasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

updateTaskText = (event) => {
  allTasks[activeEditTask].text = event.target.value;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

doneEditTask = async() => {
  await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(allTasks[activeEditTask])
  });
  activeEditTask = null;
  render();
}