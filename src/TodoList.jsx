import TodoListItem from "./TodoListItem"

{/*extract from TodoList.jsx*/ }

function TodoList() {
  const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
  ]
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <TodoListItem 
            key={todo.id}
            title={todo.title}
          />
        );
       })}
    </ul>

  )
}

export default TodoList