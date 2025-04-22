import './App.css'
import { useState } from 'react';
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(newTodo) {
    setTodoList([...todoList, newTodo])
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        let value = true;
        return { ...todo, isCompleted: value };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo}></TodoForm>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}></TodoList>
    </div >
  )
}

export default App
