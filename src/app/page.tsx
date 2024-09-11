"use client";
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className={styles.page}>
      <div className={styles['todo-container']}>
        <h1 className={styles['todo-header']}>Todo List</h1>
        <input
          type="text"
          className={styles['todo-input']}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button className={styles['todo-button']} onClick={handleAddTodo}>
          Add Task
        </button>
        <ul className={styles['todo-list']}>
          {todos.map((todo, index) => (
            <li
              key={index}
              className={
                todo.completed ? styles['todo-item-completed'] : styles['todo-item']
              }
            >
              <span onClick={() => toggleTodo(index)}>
                {todo['text']}
              </span>
              <button
                className={styles['delete-button']}
                onClick={() => handleDeleteTodo(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
