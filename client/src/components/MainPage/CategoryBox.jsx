import React from 'react';
import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

const CategoryBox = ({ categoryData }) => {
  return (
    <div className={classes.listCardContainer}>
      {categoryData.map((party) => (
        <ListCard
          className={classes.ListCard}
          key={party.partyId}
          party={party}
        />
      ))}
    </div>
  );
};
export default CategoryBox;
