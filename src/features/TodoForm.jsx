import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

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
        <TextInputWithLabel
          elementId={"todoTitle"}
          label={"Todo"}
          ref={todoTitleInput}
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}></TextInputWithLabel>
        <button type="submit" disabled={workingTodoTitle === ''}>Add Todo</button>
      </form>
    </>
  )
}

export default TodoForm