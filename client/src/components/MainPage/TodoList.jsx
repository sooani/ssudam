import classes from '../../styles/components/TodoList.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const TodoList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`/v1/todos?page=1&size=3`)
        .then((response) => {
          setData(response.data.data);
        })
        .catch((error) => {
          console.error('데이터를 받아오는 동안 오류가 발생했습니다:', error);
        });
    };
    // Load initial data
    fetchData();

    // Load new data every day
    const dailyIntervalId = setInterval(() => {
      fetchData();
    }, 24 * 60 * 60 * 1000); // 24시간

    // Release interval when component is unmounted
    return () => clearInterval(dailyIntervalId);
  }, []);

  return (
    <div className={classes.todoListSection}>
      <div className={classes.todoTitle}>Todo List</div>
      <div className={classes.todoList}>
        {data.map((todo) => (
          <li key={todo.todolistId}>{todo.title}</li>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
