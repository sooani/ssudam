import { useEffect } from 'react';

const InfiniteScroll = ({ onScrollEnd }) => {
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 바닥에 닿았는지 여부를 계산
    const bottomOfWindow = scrollTop + clientHeight >= scrollHeight;

    if (bottomOfWindow) {
      onScrollEnd();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollEnd]);

  return null;
};

export default InfiniteScroll;
