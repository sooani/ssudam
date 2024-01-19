import classes from '../../styles/components/ShowTodoList.module.css';
import React, { useState, useEffect } from 'react';
import useAxiosInstance from '../../axios';
const ShowTodoList = () => {
  const instance = useAxiosInstance();
  const [data, setData] = useState([]);
  const today = new Date();

  // 날짜를 어떻게 표시할지를 설정
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  // 한국어로 표시
  const formattedDate = today.toLocaleDateString('ko-KR', options);

  useEffect(() => {
    const fetchData = () => {
      instance
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
      <div className={classes.todoTitle}>
        {formattedDate}
        <p>오늘 할 일!</p>
      </div>
      <div className={classes.todoList}>
        {data.map((todo) => (
          <li key={todo.todolistId}>{todo.title}</li>
        ))}
      </div>
    </div>
  );
};

export default ShowTodoList;
