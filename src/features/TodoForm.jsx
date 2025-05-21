import { useRef } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledForm = styled.form`
  padding: 0.5rem;
`;
const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
  }
`;

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
      <StyledForm onSubmit={handleAddTodo}>
        <TextInputWithLabel
          elementId={"todoTitle"}
          label={"Todo"}
          ref={todoTitleInput}
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}></TextInputWithLabel>
        <StyledButton type="submit" disabled={workingTodoTitle === ''}>Add Todo</StyledButton>
      </StyledForm>
    </>
  )
}

export default TodoForm