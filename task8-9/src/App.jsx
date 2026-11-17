import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import Filters from './components/Filters';
import Stats from './components/Stats';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('react_todos');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Изучить компоненты и пропсы в React', completed: true, createdAt: Date.now() - 3000 },
        { id: 2, text: 'Освоить хуки useState и useEffect', completed: true, createdAt: Date.now() - 2000 },
        { id: 3, text: 'Настроить мемоизацию (useMemo, useCallback)', completed: false, createdAt: Date.now() - 1000 },
      ];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState('all');
  const [sortType, setSortType] = useState('date-desc');

  useEffect(() => {
    try {
      localStorage.setItem('react_todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }, [todos]);

  const handleAddTodo = useCallback((text, isCompleted = false) => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: Boolean(isCompleted),
      createdAt: Date.now(),
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  const handleToggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const processedTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortType === 'alphabet') return a.text.localeCompare(b.text);
      if (sortType === 'date-asc') return a.createdAt - b.createdAt;
      return b.createdAt - a.createdAt;
    });
  }, [todos, filter, sortType]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, active: total - completed, completed };
  }, [todos]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>✨ React Todo List</h1>
        <TodoForm onAdd={handleAddTodo} />
      </header>

      <section className="controls-panel">
        <Filters currentFilter={filter} onFilterChange={setFilter} />
        <Stats stats={stats} />
        <div className="sort-group">
          <select className="sort-select" value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="date-desc">Сначала новые</option>
            <option value="date-asc">Сначала старые</option>
            <option value="alphabet">По алфавиту (A-Я)</option>
          </select>
        </div>
      </section>

      <TodoList todos={processedTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
    </div>
  );
}
