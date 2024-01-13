import React from 'react';
// import React, { useState } from 'react';
// import ReactPaginate from 'react-paginate';
import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

// // 한 페이지당 표시될 게시글 수
// const ITEMS_PER_PAGE = 12;

// // 한 행당 표시될 게시글 수
// const POSTS_PER_ROW = 3;

const CategoryBox = ({ data, activeTab }) => {
  // 선택된 탭에 따라 데이터를 필터링
  const filteredData = data.filter((item) =>
    activeTab === 'recruiting'
      ? item.partyStatus === 'PARTY_OPENED'
      : item.partyStatus !== 'PARTY_OPENED'
  );
  // const [currentPage, setCurrentPage] = useState(0);
  // const handlePageClick = ({ selected }) => {
  //   setCurrentPage(selected);
  // };
  // // 페이지 및 오프셋 계산
  // const pageCount = Math.ceil(
  //   filteredData.length / (ITEMS_PER_PAGE * POSTS_PER_ROW)
  // );
  // const offset = currentPage * ITEMS_PER_PAGE * POSTS_PER_ROW;

  // // 현재 페이지에 표시될 데이터 슬라이스
  // const currentData = filteredData.slice(
  //   offset,
  //   offset + ITEMS_PER_PAGE * POSTS_PER_ROW
  // );

  // // 행 단위로 데이터를 나누어 렌더링
  // const rows = [];
  // for (let i = 0; i < currentData.length; i += POSTS_PER_ROW) {
  //   rows.push(currentData.slice(i, i + POSTS_PER_ROW));
  // }
  return (
    <div className={classes.listCardContainer}>
      {filteredData.map((party) => (
        <ListCard key={party.partyId} party={party} />
      ))}
    </div>
    // <div className={classes.listCardContainer}>
    //   {rows.map((row, rowIndex) => (
    //     <div key={rowIndex} className={classes.row}>
    //       {row.map((party) => (
    //         <ListCard key={party.partyId} party={party} />
    //       ))}
    //     </div>
    //   ))}
    // <div className={classes.paginationContainer}>
    //   <ReactPaginate
    //     previousLabel={'<'}
    //     nextLabel={'>'}
    //     breakLabel={'...'}
    //     pageCount={pageCount}
    //     marginPagesDisplayed={1}
    //     pageRangeDisplayed={10}
    //     onPageChange={handlePageClick}
    //     containerClassName={'classes.pagination'}
    //     activeClassName={'classes.active'}
    //   />
    // </div>
  );
};
export default CategoryBox;
