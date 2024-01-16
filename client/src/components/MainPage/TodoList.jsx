import classes from '../../styles/components/TodoList.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const TodoList = () => {
  const [todoData, setTodoData] = useState([]);
  useEffect(() => {
    const apiUrl = '/v1/todos?page=1&size=3';

    const fetchTodoData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setTodoData(response.data.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    };

    // 매 5초마다 API에서 데이터 다시 가져오기
    const intervalId = setInterval(() => {
      fetchTodoData();
    }, 5000000);

    // 컴포넌트가 언마운트될 때 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.todoListSection}>
      <div className={classes.todoTitle}>Todo List</div>
      <div className={classes.todoList}>
        {todoData.map((todo) => (
          <li key={todo.todolistId}>{todo.title}</li>
        ))}
      </div>
    </div>
  );
};
// const TodoList = ({ todos }) => {
//   useEffect(() => {
//     console.log('TodoList 컴포넌트: todos가 변경되었습니다.', todos);
//   }, [todos]);
//   return (
//     <div className={classes.todoListSection}>
//       <div className={classes.todoTitle}>Todo List</div>
//       <div className={classes.todoList}>
//         {todos.map((todo) => (
//           <li key={todo.todolistId}>{todo.title}</li>
//         ))}
//       </div>
//     </div>
//   );
// };

export default TodoList;
