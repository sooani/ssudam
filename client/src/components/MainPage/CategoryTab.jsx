import classes from '../../styles/components/CategoryTab.module.css';
import { useAxiosInterceptors } from '../../axios';
import React, { useState, useEffect } from 'react';
import CategoryBox from '../MainPage/CategoryBox';

const CategoryTab = () => {
  const instance = useAxiosInterceptors();
  // 모든 데이터를 담을 상태 변수를 선언하고 초기값을 빈 배열로 설정
  const [allData, setAllData] = useState([]);
  // 현재 활성화된 탭을 나타내는 상태 변수를 선언하고 초기값을 'all'로 설정
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // 더 많은 데이터를 불러올 수 있는지를 나타내는 상태 변수를 선언하고 초기값을 true로 설정
  const [hasMore, setHasMore] = useState(true);

  // API로부터 파티 데이터를 가져오는 비동기 함수
  const fetchParties = async (page, status) => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/v1/parties?page=${page}&size=500&status=${status}`
      );
      const { data } = response;
      // 'all' 상태일 때는 모든 데이터를, 'recruiting' 상태일 때는 'PARTY_OPENED' 상태인 데이터만 필터링하여 가져옴
      const partiesToShow =
        status === 'all'
          ? data.data
          : data.data.filter((party) => party.partyStatus === 'PARTY_OPENED');

      // 이전 데이터에 현재 가져온 데이터를 추가
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

  // 탭이 변경됐을 때의 처리 함수
  const handleTabChange = (tab) => {
    setActiveTab(tab); // 현재 활성화된 탭을 업데이트
    setAllData([]); // 모든 데이터를 초기화
    setPage(1);
    fetchParties(1, tab); // 새로운 탭에 해당하는 파티 데이터를 가옴
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // 페이지 하단에 도달하면서 로딩 중이 아니고 더 불러올 데이터가 있는 경우 페이지를 업데이트
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 'all' 탭에 해당하는 파티 데이터를 가져옴
  useEffect(() => {
    handleTabChange('all');
  }, []);

  // 스크롤 이벤트 리스너를 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너를 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, activeTab, loading]);

  // 페이지나 탭이 변경될 때마다 해당하는 파티 데이터를 가져옴
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
