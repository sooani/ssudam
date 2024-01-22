import classes from '../../styles/components/CategoryTab.module.css';
import { useAxiosInterceptors } from '../../axios';
import React, { useState, useEffect } from 'react';
import CategoryBox from '../MainPage/CategoryBox';

const CategoryTab = () => {
  const instance = useAxiosInterceptors();
  const [allData, setAllData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchParties = async (page, status) => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/v1/parties?page=${page}&size=500&status=${status}`
      );
      const { data } = response;
      const partiesToShow =
        status === 'all'
          ? data.data
          : data.data.filter((party) => party.partyStatus === 'PARTY_OPENED');

      setAllData((prevData) =>
        page === 1 ? partiesToShow : [...prevData, ...partiesToShow]
      );
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAllData([]);
    setPage(1);
    fetchParties(1, tab);
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    handleTabChange('all');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, activeTab, loading]);

  useEffect(() => {
    fetchParties(page, activeTab);
  }, [page, activeTab]);

  return (
    <div className={classes.categoryTab}>
      <section className={classes.tab}>
        <div
          onClick={() => handleTabChange('all')}
          style={{
            fontWeight: activeTab === 'all' ? 'bold' : '600',
            background: 'transparent',
            color: activeTab === 'all' ? 'black' : 'gray',
          }}
          className={activeTab === 'all' ? 'active' : ''}
        >
          <span className={classes.all}>전체</span>
        </div>
        <div
          onClick={() => handleTabChange('recruiting')}
          style={{
            fontWeight: activeTab === 'recruiting' ? 'bold' : '600',
            background: 'transparent',
            color: activeTab === 'recruiting' ? 'black' : 'gray',
          }}
          className={activeTab === 'recruiting' ? 'active' : ''}
        >
          <span className={classes.join}>모집 중</span>
        </div>
      </section>
      <CategoryBox categoryData={allData} />
      {loading && <h4>Loading...</h4>}
    </div>
  );
};
export default CategoryTab;
