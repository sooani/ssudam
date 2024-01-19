import MainHeader from '../components/Layout/MainHeader';
// import Footer from '../components/Layout/Footer';
import classes from '../styles/pages/MainPage.module.css';
import ListSlider from '../components/MainPage/ListSlider';
import CategoryTab from '../components/MainPage/CategoryTab';
import { useAxiosInterceptors } from '../axios';
import React, { useState, useEffect } from 'react';

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
  const [page, setPage] = useState(1);
  const instance = useAxiosInterceptors();

  // 메인 모집중 게시글
  useEffect(() => {
    instance
      .get(`/v1/parties?page=${page}&size=12`)
      .then((response) => {
        setData(response.data.data);
        // setPage(response.data.pageInfo);
      })
      .catch((error) => {
        console.error('Error party data:', error);
      });
  }, []);

  // 새로운 모임
  useEffect(() => {
    instance
      .get(`/v1/parties/latest?page=${page}&size=12`)
      .then((response) => {
        setLatest(response.data.data);
      })
      .catch((error) => {
        console.error('Error party data:', error);
      });
  }, []);

  return (
    <main className={classes.pageWrapper}>
      {/* 헤더 */}
      <MainHeader />

      {/* 새로운 모임 */}
      <div className={classes.newPost}>
        <ListSlider latest={latest} />
      </div>

      {/* 메인 구역 */}
      <div className={classes.mainContainer}>
        <CategoryTab data={data} />
      </div>

      {/* 푸터 */}
      {/* <Footer /> */}
    </main>
  );
};
export default MainPage;
