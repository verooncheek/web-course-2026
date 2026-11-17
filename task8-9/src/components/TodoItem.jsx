import React from 'react';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-info">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="todo-text">{todo.text}</span>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDelete(todo.id)}
        title="Удалить задачу"
      >
        ✕
      </button>
    </div>
  );
}

export default React.memo(TodoItem);
