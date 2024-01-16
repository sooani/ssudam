import React from 'react';
import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';
import PaginationBar from './PaginationBar';

const CategoryBox = ({ categoryData, pageInfo, onPageChange }) => {
  return (
    <div className={classes.listCardContainer}>
      {categoryData.map((party) => (
        <ListCard key={party.partyId} party={party} />
      ))}
      <PaginationBar pageInfo={pageInfo} onPageChange={onPageChange} />
    </div>
  );
};
export default CategoryBox;
