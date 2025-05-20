import './App.css'
import { useEffect, useState, useCallback } from 'react';
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'
import TodosViewForm from './features/TodosViewForm';

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
        setIsLoading(true);
        const resp = await fetch(encodeUrl(sortField, sortDirection, queryString ), options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();
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
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
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
      setIsSaving(true);
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString ), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const updateTodo = async (editedTodo) => {
    console.log('App: updateTodo: async');
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    // Optimistic Strategy
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList([...updatedTodos]);
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
      setIsSaving(true);
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString ), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      // Optimistic Strategy
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  const completeTodo = async (id) => {
    console.log('App: completeTodo: async');
    const originalTodo = todoList.find((todo) => todo.id === id);
    // Optimistic Strategy
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
    const payload = {
      records: [
        {
          id: originalTodo.id,
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
      setIsSaving(true);
      const resp = await fetch(encodeUrl(sortField, sortDirection, queryString ), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      // Optimistic Strategy
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  function cleanErrorMessage() {
    setErrorMessage('');
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}></TodoForm>
      <TodoList todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}></TodoList>
      <div><hr /></div>
      <TodosViewForm sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}></TodosViewForm>
      {errorMessage && <div><hr /><p>{errorMessage}</p><button type="button" onClick={cleanErrorMessage}>Dismiss Error Message</button></div>}
    </div >
  )
}

export default App
