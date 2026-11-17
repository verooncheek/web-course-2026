import React from 'react';

export default function Filters({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'active', label: 'Активные' },
    { id: 'completed', label: 'Выполненные' },
  ];

  return (
    <div className="filters-group">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`btn-filter ${currentFilter === f.id ? 'active' : ''}`}
          onClick={() => onFilterChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
