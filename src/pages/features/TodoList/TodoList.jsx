import TodoListItem from "./TodoListItem"
import styles from './TodoList.module.css';
import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams(params => {
        params.set("page", currentPage + 1);
        return params;
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams(params => {
        params.set("page", currentPage - 1);
        return params;
      });
    }
  };

  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      {isLoading ? (<p>Todo list loading...</p>) :
        filteredTodoList.length === 0 ? (<p>Add a todo above to get started</p>) :
          (<ul className={styles.list}>
            {currentTodos.map((todo) => {
              return (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  onCompleteTodo={onCompleteTodo}
                  onUpdateTodo={onUpdateTodo}
                />
              );
            })}
          </ul >
          )}
      <div>
        <button type="button" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </>
  )
}

export default TodoList