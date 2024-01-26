import React from 'react';
import classes from '../../styles/components/ScrollToTopButton.module.css';
import { BsChevronDoubleUp } from 'react-icons/bs';

const ScrollToTopButton = ({ onClick }) => {
  return (
    <button className={classes.scrollToTopButton} onClick={onClick}>
      <BsChevronDoubleUp />
    </button>
  );
};

export default ScrollToTopButton;
