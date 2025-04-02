import './App.css'
import { useState } from 'react';
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function App() {
  const [newTodo, setNewTodo] = useState("Example Text")

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm></TodoForm>
      <p>{newTodo}</p>
      <TodoList></TodoList>
    </div>
  )
}

export default App
