import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodo, setWorkingTodo] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo({ 'id': Date.now(), 'title': workingTodo, 'isCompleted': false });
    setWorkingTodo('');
    todoTitleInput.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo &nbsp;</label>
        <input type="text"
          id="todoTitle"
          ref={todoTitleInput}
          name="title"
          value={workingTodo}
          onChange={(e) => setWorkingTodo(e.target.value)}></input>
        <button type="submit" disabled={workingTodo === ''}>Add Todo</button>
      </form>
    </>
  )
}

export default TodoForm