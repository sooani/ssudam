import React, { useEffect, useRef } from 'react';

const InfiniteScroll = ({ onScrollEnd }) => {
  const loadingRef = useRef(null);

  const handleScroll = () => {
    if (
      loadingRef.current &&
      loadingRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      onScrollEnd();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollEnd]);

  return (
    <div ref={loadingRef} style={{ display: 'none' }}>
      로딩 중.
    </div>
  );
};

export default InfiniteScroll;
