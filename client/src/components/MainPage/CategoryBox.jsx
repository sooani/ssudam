import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

// ListCard 컴포넌트를 렌더링

const CategoryBox = ({ categoryData }) => {
  return (
    <div className={classes.listCardContainer}>
      {categoryData.map((party) => (
        <ListCard
          key={party.partyId} // 각 ListCard에 고유한 키를 부여하여 React가 컴포넌트를 렌더링할 때 구분
          className={classes.ListCard}
          party={party} // ListCard 컴포넌트에 party 데이터를 전달
        />
      ))}
    </div>
  );
};
export default CategoryBox;
