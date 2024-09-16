"use client";
import styles from './page.module.css';
import { useState, useEffect } from 'react';

export interface ITodo {
  _id?: string;
  name: string;
  description: string;
  duedate: string;
  status: boolean;
}


export default function Home() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duedate, setDuedate] = useState('');
  const [status, setStatus] = useState(false);


  const handleAddTodo = () => {
    if (name.trim() === '' || description.trim() === '' || duedate.trim() === '') return;
    setTodos([...todos, { name, description, duedate, status }]);
    setName('');
    setDescription('');
    setDuedate('');
    setStatus(false);

    fetch('/api/v1/todo', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        status,
        duedate
      })
    }).then(res=>res.json()).then(data=>{
      console.log(data);
    }).catch(err=>{
      console.log(err);
    })
  };


  const toggleTodo = (index: number) => {
    const todoToToggle = todos[index];

    if (!todoToToggle._id) return;

    // Optimistically update the status in the frontend
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, status: !todo.status } : todo
    );
    setTodos(updatedTodos);
  
    // Send the PUT request to update the status in the backend
    fetch('/api/v1/todo', {
      method: 'PUT',
      body: JSON.stringify({
        id: todoToToggle._id, // Use the _id to identify the todo
        status: !todoToToggle.status, // Toggle the current status
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    };

  const handleDeleteTodo = (index: number) => {
    const todoToDelete = todos.at(index);
    if (!todoToDelete || !todoToDelete._id) return;

    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);

    fetch('/api/v1/todo', {
      method: 'DELETE',
      body: JSON.stringify({
        id: todoToDelete._id, 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    };



  useEffect(()=>{
    fetch('/api/v1/todo', {
      method: 'GET'
    }).then(res=>res.json()).then(data=>{
      const todos = data.data;
      setTodos(todos);
    })
  }, [])


  return (
    <div className={styles.page}>
      <div className={styles['todo-container']}>
        <h1 className={styles['todo-header']}>Todo List</h1>
        <div className={styles['input-group']}>
          <input
            type="text"
            className={styles['todo-input']}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task Name"
          />
          <input
            type="text"
            className={styles['todo-input']}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="text"
            className={styles['todo-input']}
            value={duedate}
            onChange={(e) => setDuedate(e.target.value)}
            placeholder="Due Date"
          />
          <button className={styles['todo-button']} onClick={handleAddTodo}>
            Add Task
          </button>
        </div>
        <ul className={styles['todo-list']}>
          {todos.map((todo, index) => (
            <li
              key={index}
              className={styles['todo-item']}
            >
              <div className={styles['todo-item-content']}>
                <div className={styles['todo-item-header']}>
                  <strong>{todo.name}</strong>
                </div>
                <p className={styles['todo-description']}>{todo.description}</p>
                <span className={styles['todo-duedate']}>Due: {todo.duedate}</span>
              </div>
              <div className={styles['todo-actions']}>
                <button
                  className={`${styles['status-button']} ${todo.status ? styles['completed'] : styles['incomplete']}`}
                  onClick={() => toggleTodo(index)}
                >
                  {todo.status ? '✔' : '✘'}
                </button>
                <button
                  className={styles['delete-button']}
                  onClick={() => handleDeleteTodo(index)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
