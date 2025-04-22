import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(title) {
    title.preventDefault();
    onAddTodo({ 'id': Date.now(), 'title': workingTodoTitle, 'isCompleted': false });
    setWorkingTodoTitle('');
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
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}></input>
        <button type="submit" disabled={workingTodoTitle === ''}>Add Todo</button>
      </form>
    </>
  )
}

export default TodoForm