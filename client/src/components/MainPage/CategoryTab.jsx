import classes from '../../styles/components/CategoryTab.module.css';
import { useAxiosInterceptors } from '../../axios';
import React, { useState, useEffect } from 'react';
import CategoryBox from './CategoryBox';
// import InfiniteScroll from '../MainPage/InfiniteScroll';
// 모집중 / 모집완료 탭을 구분 하는 컴포넌트
const CategoryTab = () => {
  const instance = useAxiosInterceptors();
  const [activeTab, setActiveTab] = useState('recruiting');
  const [recruitingData, setRecruitingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 10000,
    totalElements: 'totalElements',
    totalPages: 'totalPages',
  });
  const fetchParties = async (page, status) => {
    try {
      const response = await instance.get(
        `/v1/parties?page=${page}&size=10000&status=${status}`
      );
      const { data } = response;
      const recruitingParties = data.data.filter(
        (party) => party.partyStatus === 'PARTY_OPENED'
      );
      const completedParties = data.data.filter(
        (party) => party.partyStatus === 'PARTY_CLOSED'
      );

      if (status === 'recruiting' && activeTab === 'recruiting') {
        setRecruitingData((prevData) => [
          ...prevData.filter((party) => party.partyStatus === 'PARTY_OPENED'),
          ...recruitingParties,
        ]);
      } else if (status === 'completed' && activeTab === 'completed') {
        setCompletedData((prevData) => [...prevData, ...completedParties]);
      }
      if (status === 'completed' && activeTab === 'recruiting') {
        setRecruitingData((prevData) => [
          ...prevData.filter((party) => party.partyStatus === 'PARTY_OPENED'),
          ...recruitingParties,
        ]);
        setCompletedData((prevData) => [...prevData, ...completedParties]);
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    }
  };
  const handlePageChange = () => {
    fetchParties(pageInfo.page + 1, activeTab);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'recruiting') {
      setRecruitingData([]);
    } else if (tab === 'completed') {
      setCompletedData([]);
    }
    fetchParties(1, tab);
  };
  useEffect(() => {
    fetchParties(pageInfo.page, activeTab);
  }, [activeTab, pageInfo.page]);

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
          {/* <InfiniteScroll onScrollEnd={handlePageChange} /> */}
        </>
      )}
      {activeTab === 'completed' && (
        <>
          <CategoryBox categoryData={completedData} />
          {/* <InfiniteScroll onScrollEnd={handlePageChange} /> */}
        </>
      )}
    </div>
  );
};
export default CategoryTab;
