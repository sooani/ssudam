// import { useState } from 'react';
import Pagination from 'react-js-pagination';
import classes from '../../styles/components/Paging.module.css';

const Paging = ({ page, count, setPage }) => {
  // const [page, setPage] = useState(1);

  // const handlePageChange = (page) => {
  //   setPage(page);
  //   console.log(page);
  // };

  return (
    <div className={classes.pagination}>
      <Pagination
        // 현재 페이지
        activePage={page}
        // 한 페이지당 보여줄 리스트 아이템의 개수
        itemsCountPerPage={10}
        // 총 아이템의 개수
        totalItemsCount={count}
        // Paginator 내에서 보여줄 페이지의 범위
        pageRangeDisplayed={5}
        prevPageText={'‹'}
        nextPageText={'›'}
        onChange={setPage}
      />
    </div>
  );
};
export default Paging;
