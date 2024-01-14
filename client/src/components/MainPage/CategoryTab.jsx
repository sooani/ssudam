import classes from '../../styles/components/CategoryTab.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CategoryBox from './CategoryBox';
import PaginationBar from './PaginationBar';

const CategoryTab = () => {
  const [activeTab, setActiveTab] = useState('recruiting');
  const [recruitingData, setRecruitingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  // const [categoryData, setCategoryData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 12,
    totalElements: 'totalElements',
    totalPages: 'totalPages',
  });

  const fetchParties = async (page, status) => {
    try {
      const response = await axios.get(
        `/v1/parties?page=${page}&size=${pageInfo.size}&status=${status}`
      );
      const { data } = response;

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
    fetchParties(1, tab);
  };

  useEffect(() => {
    fetchParties(pageInfo.page, activeTab);
  }, [activeTab, pageInfo.page]);

  // useEffect(() => {
  //   fetchParties(pageInfo.page);
  // }, []);

  // Initial fetch
  // const CategoryTab = ({ onSelectTab }) => {
  //   const [activeTab, setActiveTab] = useState('recruiting');

  //   const handleTabClick = (tab) => {
  //     setActiveTab(tab);
  //     onSelectTab(tab);
  //   };

  return (
    <div className={classes.categoryTab}>
      <div>
        <button
          onClick={() => handleTabChange('recruiting')}
          className={activeTab === 'recruiting' ? 'active' : ''}
        >
          모집중
        </button>
        <button
          onClick={() => handleTabChange('completed')}
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

      {/* <CategoryBox
        categoryData={categoryData}
        pageInfo={pageInfo}
        onPageChange={handlePageChange}
      /> */}
      {/* <div className={classes.categoryTabTitle}>
        <button
          onClick={() => handleTabClick('recruiting')}
          style={{ fontWeight: activeTab === 'recruiting' ? 'bold' : 'normal' }}
        >
          모집 중
        </button>
        <button
          onClick={() => handleTabClick('completed')}
          style={{ fontWeight: activeTab === 'completed' ? 'bold' : 'normal' }}
        >
          모집완료
        </button>
      </div> */}
    </div>
  );
};

export default CategoryTab;
