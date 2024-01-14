import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import classes from '../styles/pages/MainPage.module.css';
import banner from '../images/banner.png';
import TodoList from '../components/MainPage/TodoList';
import ListSlider from '../components/MainPage/ListSlider';
import CategoryTab from '../components/MainPage/CategoryTab';
// import CategoryBox from '../components/MainPage/CategoryBox';
import axios from '../axios';
import React, { useState, useEffect } from 'react';
// import Pagination from '../components/MainPage/Pagination';
// import dummy from '../dummyTab.json';

/*
    헤더는 컴포넌트로 불러온다.
    배너 구역에 이미지 삽입
    투두 리스트 출력 화면을 왼쪽에 표시 그 옆에 새로운 모임 슬라이드 형태로 출력
    모임중, 모집 완료 탭이 보이고 탭에 따른 게시글 출력
    게시글은 페이지네이션 처리
*/

const MainPage = () => {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState([]);
  // const [activeTab, setActiveTab] = useState('recruiting');
  const [page, setPage] = useState(1);

  // 메인 모집중 게시글
  useEffect(() => {
    axios
      .get(`/v1/parties?page=${page}&size=12`)
      .then((response) => {
        setData(response.data.data);
        setPage(response.data.data);
      })
      .catch((error) => {
        console.error('Error party data:', error);
      });
  }, []);

  // 새로운 모임
  useEffect(() => {
    axios
      .get(`/v1/parties/latest?page=${page}&size=12`)
      .then((response) => {
        setLatest(response.data.data);
      })
      .catch((error) => {
        console.error('Error party data:', error);
      });
  }, []);

  // const handleTabSelect = (tab) => {
  //   setActiveTab(tab);
  // };

  return (
    <main>
      {/* 헤더 */}
      <Header />

      {/* 배너 이미지 출력 */}
      <section className={classes.banner}>
        <img
          className={classes.bannerImage}
          alt="배너 이미지 구역"
          src={banner}
        />
      </section>

      {/* 투두리스트와 새로운 모임 출력 섹션 */}
      <section className={classes.todoAndNewSection}>
        {/* 투두 리스트  */}
        <div className={classes.todoList}>
          <TodoList />
        </div>
        {/* 새로운 모임 */}
        <div className={classes.newPost}>
          <ListSlider latest={latest} />
        </div>
      </section>

      {/* 메인 구역 */}
      <section className={classes.mainContainer}>
        <CategoryTab data={data} />
        {/* <CategoryTab onSelectTab={handleTabSelect}/> */}
        {/* <CategoryBox data={data} activeTab={activeTab} /> */}
      </section>

      {/* 푸터 */}
      <Footer />
    </main>
  );
};
export default MainPage;
