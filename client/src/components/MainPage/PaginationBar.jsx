import React from 'react';
import classes from '../../styles/components/PaginationBar.module.css';

const PaginationBar = ({ pageInfo, onPageChange }) => {
  if (!pageInfo) {
    return null;
  }

  const { page, totalPages } = pageInfo;

  const handlePageChange = (direction) => {
    // 만약 pageInfo가 주어지지 않았다면 null을 반환합니다 (아무것도 렌더링하지 않음).
    if (typeof onPageChange === 'function') {
      onPageChange(direction);
    }
  };
  return (
    <div className={classes.paginationBar}>
      {/* 이전 페이지로 이동하는 버튼, 첫 번째 페이지인 경우 비활성화됨 */}
      <button onClick={() => handlePageChange('prev')} disabled={page === 1}>
        이전
      </button>
      {/* 페이지 번호 표시 */}
      {page && totalPages && (
        <div className={classes.pageNum}>
          {/* 각 페이지 번호에 대한 버튼을 생성하기 위해 배열을 매핑 */}
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <button
              key={pageNumber + 1}
              onClick={() => handlePageChange(pageNumber + 1)}
              // 현재 페이지에 해당하는 경우 'active' 클래스를 적용
              className={page === pageNumber + 1 ? 'active' : ''}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>
      )}
      {/* 다음 페이지로 이동하는 버튼, 마지막 페이지인 경우 비활성화됨 */}
      <button
        onClick={() => handlePageChange('next')}
        disabled={page === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default PaginationBar;
