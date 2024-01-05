import { useState, useEffect } from "react";
import classes from "../styles/pages/DetailPost.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
const DetailPost = () => {
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.container}>content</div>
    </div>
  );
};
export default DetailPost;
