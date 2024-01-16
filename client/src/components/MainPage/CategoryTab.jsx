import classes from '../../styles/components/CategoryTab.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CategoryBox from './CategoryBox';
import PaginationBar from './PaginationBar';

const CategoryTab = () => {
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
      const response = await axios.get(
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
      setRecruitingData(recruitingParties);
      setCompletedData(completedParties);

      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //     // 상태에 따라 데이터를 설정합니다.
  //     if (status === 'recruiting') {
  //       setRecruitingData(recruitingParties);
  //     } else if (status === 'completed') {
  //       setCompletedData(completedParties);
  //     }

  //     setPageInfo(data.pageInfo);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setIsLoading(false);
  //   }
  // };
  //   try {
  //     const response = await axios.get(
  //       `/v1/parties?page=${page}&size=12&status=${status}`
  //     );
  //     const { data } = response;

  //     const recruitingParties = data.data.filter(
  //       (party) => party.partyStatus === 'PARTY_OPENED'
  //     );
  //     const completedParties = data.data.filter(
  //       (party) => party.partyStatus === 'PARTY_CLOSED'
  //     );

  //     setRecruitingData(recruitingParties);
  //     setCompletedData(completedParties);

  //     setPageInfo(data.pageInfo);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && pageInfo.page > 1) {
      fetchParties(pageInfo.page - 1, activeTab);
    } else if (direction === 'next' && pageInfo.page < pageInfo.totalPages) {
      fetchParties(pageInfo.page + 1, activeTab);
    } else if (typeof direction === 'number') {
      fetchParties(direction, activeTab);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchParties(1, tab); // 탭이 변경될 때 해당 탭에 맞는 데이터를 가져오도록 수정
  };

  useEffect(() => {
    fetchParties(pageInfo.page, activeTab);
  }, [activeTab, pageInfo.page]);

  return (
    <div className={classes.categoryTab}>
      <div>
        <button
          onClick={() => handleTabChange('recruiting')}
          style={{ fontWeight: activeTab === 'recruiting' ? 'bold' : 'normal' }}
          className={activeTab === 'recruiting' ? 'active' : ''}
        >
          모집중
        </button>
        <button
          onClick={() => handleTabChange('completed')}
          style={{ fontWeight: activeTab === 'completed' ? 'bold' : 'normal' }}
          className={activeTab === 'completed' ? 'active' : ''}
        >
          모집완료
        </button>
      </div>

      {activeTab === 'recruiting' && (
        <>
          <CategoryBox categoryData={recruitingData} />
          <PaginationBar pageInfo={pageInfo} onPageChange={handlePageChange} />
        </>
      )}
      {activeTab === 'completed' && (
        <>
          <CategoryBox categoryData={completedData} />
          <PaginationBar pageInfo={pageInfo} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default CategoryTab;
