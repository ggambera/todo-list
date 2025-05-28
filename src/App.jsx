import './App.css'
import styles from './App.module.css';
import { useEffect, useState, useCallback, useReducer } from 'react';
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'
import TodosViewForm from './features/TodosViewForm';
import logo from './assets/todo.png'
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
  actions,
} from './reducers/todos.reducer';

function App() {

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
        /* Before reducer
        setIsLoading(true); 
        */
        dispatch({ type: todoActions.fetchTodos });
        const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();
        /* Before reducer
        setTodoList(records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }));
        */
        dispatch({ type: todoActions.loadTodos, records: records });
      } catch (error) {
        /* Before reducer
        console.error(error);
        setErrorMessage(error.message);
        */
        dispatch({ type: todoActions.setLoadError, error: error });
      } finally {
        /* Before reducer 
        setIsLoading(false);
        */
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
      /* Before reducer
      setIsSaving(true);
      */
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      /* Before reducer
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
      */
      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      /* Before reducer
      console.error(error);
      setErrorMessage(error.message);
      */
      dispatch({ type: todoActions.setLoadError, error: error });
    } finally {
      /* Before reducer
      setIsSaving(false);
      */
      dispatch({ type: todoActions.endRequest });
    }
  }

  const updateTodo = async (editedTodo) => {
    console.log('App: updateTodo: async');
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    // Optimistic Strategy
    /* Before reducer
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList([...updatedTodos]);
    */
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
      /* Before reducer
      setIsSaving(true);
      */
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      /* Before reducer
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      */
      dispatch({ type: todoActions.setLoadError, error: error });
      // Optimistic Strategy
      /* Before reducer
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
      */
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo });
    } finally {
      /* Before reducer
      setIsSaving(false);
      */
      dispatch({ type: todoActions.endRequest });
    }
  }

  const completeTodo = async (id) => {
    console.log('App: completeTodo: async');
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    // Optimistic Strategy
    /* Before reducer
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          id: todo.id,
          title: todo.title,
          isCompleted: true
        };
        return { ...updatedTodo };
      } else {
        return todo;
      }
    });
    setTodoList([...updatedTodos]);
    */
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
      /* Before reducer
      setIsSaving(true);
      */
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      /* Before reducer
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      */
      dispatch({ type: todoActions.setLoadError, error: error });
      // Optimistic Strategy
      /* Before reducer
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
      */
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo });
    } finally {
      /* Before reducer
      setIsSaving(false);
      */
      dispatch({ type: todoActions.endRequest });
    }
  }

  function cleanErrorMessage() {
    /* Before reducer
    setErrorMessage('');
    */
    dispatch({ type: todoActions.clearError });
  }

  return (
    <div className={styles.block}>
      <div className={styles.title}>
        <img src={logo} className={styles.logo} />
        <h1>Todo List</h1>
      </div>
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
    </div >
  )
}

export default App
