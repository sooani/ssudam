import { useEffect } from 'react';

const InfiniteScroll = ({ onScrollEnd }) => {
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 화면 하단에 닿았을 때 (끝에 도달하면 추가 데이터 로딩)
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      onScrollEnd();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollEnd]); // onScrollEnd가 변경될 때마다 리스너를 갱신

  return null;
};

export default InfiniteScroll;
