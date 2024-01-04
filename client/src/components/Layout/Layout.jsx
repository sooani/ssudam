import Header from "./Header";
import classes from "./Layout.module.css";
const Layout = (props) => {
  return (
    <div className={classes.layout}>
      <Header />
      <main>{props.children}</main>
    </div>
  );
};
export default Layout;
