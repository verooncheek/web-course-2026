import React, { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, completed);
    setText('');
    setCompleted(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Что нужно сделать?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        className="status-select"
        value={completed ? 'completed' : 'active'}
        onChange={(e) => setCompleted(e.target.value === 'completed')}
      >
        <option value="active">Невыполненная</option>
        <option value="completed">Выполненная</option>
      </select>
      <button type="submit" className="btn-primary">Добавить</button>
    </form>
  );
}
