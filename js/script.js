'use strict';

const storageKey = 'toDoList';
const deleteBtnClassName = 'todo-remove';
const completeBtnClassName = 'todo-complete';

class ToDo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todolist = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem(storageKey)));
    }

    addToStorage() {
        localStorage.setItem(storageKey, JSON.stringify([...this.todoData]));
    }

    render() {
        this.todolist.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todolist.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(todoItemElement) {
        const key = todoItemElement.key;
        this.todoData.delete(key);
        this.render();
    }

    completedItem(todoItemElement) {
        const key = todoItemElement.key;
        const data = this.todoData.get(key);
        this.todoData.set(key, {
            ...data,
            completed: !data.completed,
        });
        this.render();
    }

    handler(ev) {
        if (!ev.target ||
            !ev.target instanceof HTMLElement) {
            return;
        }
        if (ev.target.classList.contains(deleteBtnClassName)) {
            this.deleteItem(ev.target.closest('.todo-item'));
        }
        if (ev.target.classList.contains(completeBtnClassName)) {
            this.completedItem(ev.target.closest('.todo-item'));
        }
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.todoContainer.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();
