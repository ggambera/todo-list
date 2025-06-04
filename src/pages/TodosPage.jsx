import styles from './TodosPage.module.css';
import { useEffect, useState, useCallback, useReducer } from 'react';
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'
import TodosViewForm from './features/TodosViewForm';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState
} from '../reducers/todos.reducer';

function TodosPage() {

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    (async () => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      try {
        dispatch({ type: todoActions.fetchTodos });
        const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    })();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (newTodo) => {
    console.log('App: addTodo: async');
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error: error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  const updateTodo = async (editedTodo) => {
    console.log('App: updateTodo: async');
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, error: error, originalTodo: originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  const completeTodo = async (id) => {
    console.log('App: completeTodo: async');
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    dispatch({ type: todoActions.completeTodo, id: id });
    const payload = {
      records: [
        {
          id: id,
          fields: {
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, error: error, originalTodo: originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  function cleanErrorMessage() {
    dispatch({ type: todoActions.clearError });
  }

  return (
    <>
      <TodoForm onAddTodo={addTodo}></TodoForm>
      <TodoList todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}></TodoList>
      <div><hr /></div>
      <TodosViewForm sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}></TodosViewForm>
      {todoState.errorMessage && <div className={styles.error}><p>{todoState.errorMessage}</p><button type="button" onClick={cleanErrorMessage}>Dismiss Error Message</button></div>}
    </>
  );
}

export default TodosPage