import classes from '../../styles/components/TodoList.module.css';
import { useEffect } from 'react';

const TodoList = ({ todos }) => {
  useEffect(() => {
    console.log('TodoList 컴포넌트: todos가 변경되었습니다.', todos);
  }, [todos]);
  return (
    <div className={classes.todoListSection}>
      <div className={classes.todoTitle}>Todo List</div>
      <div className={classes.todoList}>
        {todos.map((todo) => (
          <li key={todo.todolistId}>{todo.title}</li>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
