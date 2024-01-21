import classes from '../../styles/components/CategoryTab.module.css';
import { useAxiosInterceptors } from '../../axios';
import React, { useState, useEffect, useRef } from 'react';
import CategoryBox from './CategoryBox';
// import PaginationBar from './PaginationBar';

// 모집중 / 모집완료 탭을 구분 하는 컴포넌트
const CategoryTab = () => {
  const instance = useAxiosInterceptors();
  const loadingRef = useRef(null);
  const [activeTab, setActiveTab] = useState('recruiting');
  const [recruitingData, setRecruitingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 12,
    totalElements: 'totalElements',
    totalPages: 'totalPages',
  });

  const fetchParties = async (page, status) => {
    try {
      const response = await instance.get(
        `/v1/parties?page=${page}&size=12&status=${status}`
      );
      const { data } = response;
      // 전체 데이터를 받아왔을 때, 상태(status)에 따라 데이터를 분류합니다.
      const recruitingParties = data.data.filter(
        (party) => party.partyStatus === 'PARTY_OPENED'
      );
      const completedParties = data.data.filter(
        (party) => party.partyStatus === 'PARTY_CLOSED'
      );
      // setRecruitingData(recruitingParties);
      // setCompletedData(completedParties);

      // 무한 스크롤일 때는 기존 데이터에 추가
      setRecruitingData((prevData) => [...prevData, ...recruitingParties]);
      setCompletedData((prevData) => [...prevData, ...completedParties]);

      setPageInfo(data.pageInfo);

      // 더 이상 가져올 데이터가 없을 때 로딩 메시지를 숨김
      if (data.pageInfo.page >= data.pageInfo.totalPages) {
        loadingRef.current.style.display = 'none';
      } else {
        loadingRef.current.style.display = 'block';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = () => {
    // 무한 스크롤에서는 사용자가 스크롤을 아래로 내릴 때마다 페이지를 증가시킴
    fetchParties(pageInfo.page + 1, activeTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 탭이 변경될 때 기존 데이터 초기화
    setRecruitingData([]);
    setCompletedData([]);
    fetchParties(1, tab);
  };

  useEffect(() => {
    // 초기 렌더링 시 데이터 로드
    fetchParties(pageInfo.page, activeTab);
  }, [activeTab]);

  // 무한 스크롤을 감지하는 이벤트 핸들러
  const handleScroll = () => {
    if (
      loadingRef.current &&
      loadingRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      handlePageChange();
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // const handlePageChange = (direction) => {
  //   if (direction === 'prev' && pageInfo.page > 1) {
  //     fetchParties(pageInfo.page - 1, activeTab);
  //   } else if (direction === 'next' && pageInfo.page < pageInfo.totalPages) {
  //     fetchParties(pageInfo.page + 1, activeTab);
  //   } else if (typeof direction === 'number') {
  //     fetchParties(direction, activeTab);
  //   }
  // };

  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  //   fetchParties(1, tab); // 탭이 변경될 때 해당 탭에 맞는 데이터를 가져오도록 수정
  // };

  // useEffect(() => {
  //   fetchParties(pageInfo.page, activeTab);
  // }, [activeTab, pageInfo.page]);

  return (
    <div className={classes.categoryTab}>
      <section className={classes.tab}>
        <div
          onClick={() => handleTabChange('recruiting')}
          style={{
            fontWeight: activeTab === 'recruiting' ? 'bold' : '600',
            background: 'transparent',
            color: activeTab === 'recruiting' ? 'black' : 'gray',
          }}
          className={activeTab === 'recruiting' ? 'active' : ''}
        >
          <span className={classes.join}>모집중</span>
        </div>
        <div
          onClick={() => handleTabChange('completed')}
          style={{
            fontWeight: activeTab === 'completed' ? 'bold' : '600',
            background: 'transparent',
            color: activeTab === 'completed' ? 'black' : 'gray',
          }}
          className={activeTab === 'completed' ? 'active' : ''}
        >
          <span className={classes.end}>모집완료</span>
        </div>
      </section>
      {activeTab === 'recruiting' && (
        <>
          <CategoryBox categoryData={recruitingData} />
          <div ref={loadingRef} style={{ display: 'none' }}>
            로딩 중...
          </div>
        </>
      )}
      {activeTab === 'completed' && (
        <>
          <CategoryBox categoryData={completedData} />
          <div ref={loadingRef} style={{ display: 'none' }}>
            로딩 중...
          </div>
        </>
      )}
    </div>
  );
};
export default CategoryTab;
