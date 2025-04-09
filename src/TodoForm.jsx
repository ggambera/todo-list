import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value;
    event.target.title.value = "";
    onAddTodo({ 'id': Date.now(), 'title': title });
    todoTitleInput.current.focus();
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo &nbsp;</label>
        <input id="todoTitle" ref={todoTitleInput} name="title"></input>
        <button>Add Todo</button>
      </form>
    </>
  )
}

export default TodoForm