import classes from '../../styles/components/ListCard.module.css';
import footerLogo from '../../images/footerLogo.png';
import dummy from '../../dummyCard.json';
/*
    새로운 모임을 위한 게시글 컴포넌트
    더미 데이터를 이용하여 확인 입니다.
*/
const ListCard = () => {
  return (
    <div className={classes.ListCard}>
      <img src={footerLogo} alt="게시판 이미지" />
      <div className={classes.ListCardTitle}>{dummy.title}</div>
      <div className={classes.ListCardContent}>{dummy.content}</div>
    </div>
  );
};

export default ListCard;
