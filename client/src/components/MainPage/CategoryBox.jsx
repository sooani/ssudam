import React from 'react';
import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';
import PaginationBar from './PaginationBar';

const CategoryBox = ({ categoryData, pageInfo, onPageChange }) => {
  // const CategoryBox = ({ data, activeTab, PARTY_OPENED }) => {
  // 선택된 탭에 따라 데이터를 필터링
  // const filteredData = data.filter((item) =>
  //   activeTab === 'recruiting'
  //     ? item.partyStatus === 'PARTY_OPENED'
  //     : item.partyStatus !== 'PARTY_OPENED'
  // );

  return (
    // <div className={classes.listCardContainer}>
    //   {filteredData.map((party) => (
    //     <ListCard
    //       key={party.partyId}
    //       party={party}
    //       partyStatus={PARTY_OPENED}
    //     />
    //   ))}
    //   <PaginationBar pageInfo={pageInfo} />
    // </div>
    <div className={classes.listCardContainer}>
      {categoryData.map((party) => (
        <ListCard key={party.partyId} party={party} />
      ))}
      <PaginationBar pageInfo={pageInfo} onPageChange={onPageChange} />
    </div>
  );
};
export default CategoryBox;
