import React, { useEffect, useRef } from 'react';

const InfiniteScroll = ({ onScrollEnd }) => {
  const containerRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // 스크롤이 끝에 도달했을 때 onScrollEnd 함수 호출
        onScrollEnd();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [onScrollEnd]);

  return (
    <div
      ref={containerRef}
      style={{ overflowY: 'auto', maxHeight: '500px' /* 원하는 높이 설정 */ }}
    />
  );
};

export default InfiniteScroll;
