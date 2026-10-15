let tasks = [];
let currentFilter = 'all';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const filterButtons = document.querySelectorAll('.filter-btn');
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Пожалуйста, введите текст задачи!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = '';
    render();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentFilter = btn.getAttribute('data-filter');
        render();
    });
});

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    render();
}

function render() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    todoList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (task.completed) {
            li.classList.add('is-completed');
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-item-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');
        }

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✕';
        deleteBtn.title = 'Удалить';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    const activeCount = totalCount - completedCount;

    taskCounter.textContent = `Осталось: ${activeCount} | Выполнено: ${completedCount}`;
}

render();