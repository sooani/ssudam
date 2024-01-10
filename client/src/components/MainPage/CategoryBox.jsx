import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

const ITEMS_PER_PAGE = 12;

const CategoryBox = ({ data, activeTab }) => {
  const filteredData = data.filter((item) =>
    activeTab === 'recruiting'
      ? item.partyStatus === 'PARTY_OPENED'
      : item.partyStatus !== 'PARTY_OPENED'
  );
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;

  const currentData = filteredData.slice(offset, offset + ITEMS_PER_PAGE);
  return (
    <div className={classes.listCardContainer}>
      {currentData.map((party) => (
        <ListCard party={party} />
      ))}
      <ReactPaginate
        previousLabel={'이전'}
        nextLabel={'다음'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={0}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};
export default CategoryBox;
