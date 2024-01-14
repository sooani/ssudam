import React from 'react';
import classes from '../../styles/components/PaginationBar.module.css';

const PaginationBar = ({ pageInfo, onPageChange }) => {
  if (!pageInfo) {
    return null;
  }

  const { page, totalPages } = pageInfo;

  const handlePageChange = (direction) => {
    if (typeof onPageChange === 'function') {
      onPageChange(direction);
    }
  };
  return (
    <div className={classes.paginationBar}>
      <button onClick={() => handlePageChange('prev')} disabled={page === 1}>
        이전
      </button>
      {page && totalPages && (
        <div className={classes.pageNum}>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <button
              key={pageNumber + 1}
              onClick={() => handlePageChange(pageNumber + 1)}
              className={page === pageNumber + 1 ? 'active' : ''}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => handlePageChange('next')}
        disabled={page === totalPages}
      >
        다음
      </button>
    </div>
    // <div>
    //   <button
    //     onClick={() => onPageChange('prev')}
    //     disabled={pageInfo.page === 1}
    //   >
    //     이전 페이지
    //   </button>
    //   <span>{`페이지: ${pageInfo.page} / 총 페이지: ${pageInfo.totalPages}`}</span>
    //   <button
    //     onClick={() => onPageChange('next')}
    //     disabled={pageInfo.page === pageInfo.totalPages}
    //   >
    //     다음 페이지
    //   </button>
    // </div>
  );
};

export default PaginationBar;
