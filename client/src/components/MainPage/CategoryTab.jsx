import classes from '../../styles/components/CategoryTab.module.css';
import React, { useState } from 'react';

// const TabItem = () => {
//   return (
//     <div className={classes.tabItem}>
//       <span onClick={onclick}>{dummy2.title}</span>
//       <span>{dummy2.title}</span>
//     </div>
//   );
// };

const CategoryTab = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState('recruiting');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  return (
    <div className={classes.categoryTab}>
      <div className={classes.categoryTabTitle}>
        <button
          onClick={() => handleTabClick('recruiting')}
          style={{ fontWeight: activeTab === 'recruiting' ? 'bold' : 'normal' }}
        >
          모집 중
        </button>
        <button
          onClick={() => handleTabClick('completed')}
          style={{ fontWeight: activeTab === 'completed' ? 'bold' : 'normal' }}
        >
          모집완료
        </button>
      </div>
    </div>
  );
};

export default CategoryTab;
