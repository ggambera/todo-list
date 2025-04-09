import './App.css'
import { useState } from 'react';
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(newTodo) {
    setTodoList([...todoList, newTodo])
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo}></TodoForm>
      <TodoList todoList={todoList}></TodoList>
    </div >
  )
}

export default App
