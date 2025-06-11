import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 0.5rem;
`;
const StyledInput = styled.input`
  padding: 0.3rem;
`;
const StyledSelect = styled.select`
  padding: 0.3rem;
`;

function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {

  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString)
    }, 500);
    return () => { clearTimeout(debounce) };
  }, [localQueryString, setQueryString]);

  function preventRefresh(event) {
    event.preventDefault();
  }

  return (
    <>
      <StyledForm onSubmit={preventRefresh}>
        <div>
          <label>Search todos: &nbsp;</label>
          <StyledInput type="text" value={localQueryString} onChange={(e) => setLocalQueryString(e.target.value)} />
          <button type="button" onClick={() => setLocalQueryString('')}>Clear</button>
        </div>
        <div>
          <label>Sort by &nbsp;</label>
          <StyledSelect value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="createdTime">Time added</option>
            <option value="title">Title</option>
          </StyledSelect>
          <label>Direction &nbsp;</label>
          <StyledSelect value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </StyledSelect>
        </div>
      </StyledForm>
    </>
  )
}

export default TodosViewForm