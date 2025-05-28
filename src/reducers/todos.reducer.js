const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: '',
  isSaving: false,
};

const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      const mappedArray = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return {
        ...state,
        todoList: mappedArray,
        isLoading: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    case actions.updateTodo:
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return { ...action.editedTodo };
        } else {
          return todo;
        }
      });
      const updatedState = {
        ...state,
        todoList: [...updatedTodos],
      };
      if (action.error) {
        updatedState = {
          ...state,
          todoList: [...updatedTodos],
          errorMessage: action.error.message,
        };
      }
      return updatedState;
    case actions.completeTodo:
      const completedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          const updatedTodo = {
            id: todo.id,
            title: todo.title,
            isCompleted: true,
          };
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });
      return {
        ...state,
        todoList: [...completedTodos],
      };
    case actions.revertTodo:
      const revertedTodos = state.todoList.map((todo) => {
        if (todo.id === action.originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      return {
        ...state,
        todoList: [...revertedTodos],
      };
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
  }
}

export { initialState, actions, reducer };
