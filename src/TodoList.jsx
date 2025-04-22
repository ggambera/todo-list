import TodoListItem from "./TodoListItem"

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  todoList = filteredTodoList;

  return (
    <>
      {todoList.length === 0 ? (<p>Add a todo above to get started</p>) :
        (<ul>
          {todoList.map((todo) => {
            return (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
              />
            );
          })}
        </ul >
        )}
    </>
  )
}

export default TodoList