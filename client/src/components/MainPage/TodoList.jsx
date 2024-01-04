import classes from '../../styles/components/TodoList.module.css';

const TodoList = () => {
  return (
    <div className={classes.todoListSection}>
      <div className={classes.todoTitle}>Todo List</div>
      <div className={classes.todoList}>
        <div>1번 할일</div>
        <div>2번 할일</div>
        <div>3번 할일</div>
      </div>
    </div>
  );
};

export default TodoList;
