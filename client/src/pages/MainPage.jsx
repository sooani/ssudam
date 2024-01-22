import React, { useState, useEffect, useRef } from 'react';
import MainHeader from '../components/Layout/MainHeader';
import Footer from '../components/Layout/Footer';
import ListSlider from '../components/MainPage/ListSlider';
import CategoryTab from '../components/MainPage/CategoryTab';
import ScrollToTopButton from '../components/MainPage/ScrollToTopButton';
import classes from '../styles/pages/MainPage.module.css';
import { useAxiosInterceptors } from '../axios';

/*
    헤더는 컴포넌트로 불러온다.
    배너 구역에 이미지 삽입
    투두 리스트 출력 화면을 왼쪽에 표시 그 옆에 새로운 모임 슬라이드 형태로 출력
    모임중, 모집 완료 탭이 보이고 탭에 따른 게시글 출력
    게시글은 페이지네이션 처리
*/

const MainPage = () => {
  const instance = useAxiosInterceptors();
  const scrollRef = useRef(null);
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState([]);
  const [page, setPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);

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

  // 스크롤 위치 변경 처리
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 특정 위치로 스크롤하는 함수
  const scrollToTarget = () => {
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      {/* 맨 위로 스크롤 버튼 */}
      <ScrollToTopButton onClick={scrollToTop} />

      {/* 특정 위치로 스크롤 버튼과 입력 폼 */}
      <div className={classes.scrollToTargetSection}>
        <input
          type="number"
          value={targetScroll}
          onChange={(e) => setTargetScroll(e.target.value)}
        />
        <button onClick={scrollToTarget}>해당 위치로 이동</button>
      </div>

      {/* 현재 스크롤 위치 표시 */}
      <div className={classes.scrollPositionInfo}>
        현재 스크롤 위치: {scrollPosition}
      </div>
      {/* 푸터 */}
      <Footer />
    </main>
  );
};
export default MainPage;
