import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

const CategoryBox = ({ categoryData }) => {
  return (
    // <div className={classes.listCardContainer}>
    //   {categoryData.map((party, index) => (
    //     <ListCard
    //       className={classes.ListCard}
    //       key={`${party.partyId}-${index}`}
    //       party={party}
    //     />
    //   ))}
    // </div>
    <div className={classes.listCardContainer}>
      {categoryData.map((party) => (
        <ListCard
          key={party.partyId}
          className={classes.ListCard} // ListCard 컴포넌트에서 className을 사용하도록 하세요.
          party={party}
        />
      ))}
    </div>
  );
};
export default CategoryBox;
