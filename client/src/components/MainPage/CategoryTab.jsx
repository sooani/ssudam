import classes from '../../styles/components/CategoryTab.module.css';
import dummy2 from '../../dummyTab.json';

// const TabItem = () => {
//   return (
//     <div className={classes.tabItem}>
//       <span onClick={onclick}>{dummy2.title}</span>
//       <span>{dummy2.title}</span>
//     </div>
//   );
// };

const CategoryTab = () => {
  return (
    <div className={classes.categoryTab}>
      <div className={classes.categoryTabTitle}>
        <span>{dummy2.title}</span>
      </div>
      {/* <TabItem /> */}
      {/* {categories?.map(({ id, type }) => (
        <TabItem
          type={type}
          onclick={() => setSelectedId(id)}
          isActive={selectedId === id}
        />
      ))} */}
    </div>
  );
};

export default CategoryTab;
