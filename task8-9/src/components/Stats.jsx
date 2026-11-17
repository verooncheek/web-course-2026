import React from 'react';

export default function Stats({ stats }) {
  return (
    <div className="stats">
      Всего: {stats.total} | Активных: {stats.active} | Выполнено: {stats.completed}
    </div>
  );
}
