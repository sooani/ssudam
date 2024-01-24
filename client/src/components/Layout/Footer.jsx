import classes from "../../styles/components/Footer.module.css";
import footerLogo from "../../images/logo.png";

/*
  푸터는 간단하게 카피라이트만 나옴
*/
const Footer = (props) => {
  return (
    <footer className={classes.container}>
      <div className={classes.footer}>
        <div className={classes.logoContainer}>
          <img
            src={footerLogo}
            alt="footerLogo"
            height={"50px"}
            weight={"50px"}
          />
          <p>쓰담</p>
        </div>
        <p>© {new Date().getFullYear()} 쓰담. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
