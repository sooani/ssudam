import ListCard from './ListCard';
import classes from '../../styles/components/CategoryBox.module.css';

const CategoryBox = () => {
  return (
    <div className={classes.listCardContainer}>
      <div className={classes.list1}>
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
      </div>
      <div className={classes.list2}>
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
      </div>
      <div className={classes.list3}>
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
      </div>
      <div className={classes.list4}>
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
      </div>
    </div>
  );
};
export default CategoryBox;
