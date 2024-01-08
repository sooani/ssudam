import classes from '../../styles/components/ListCard.module.css';
import footerLogo from '../../images/footerLogo.png';
import dummy from '../../dummyCard.json';
import { useNavigate } from 'react-router-dom';
/*
    새로운 모임을 위한 게시글 컴포넌트
    더미 데이터를 이용하여 확인 입니다.
*/

const ListCard = () => {
  const navigate = useNavigate();
  const gotoSignUpModal = () => {
    navigate('/SignUpModal');
  };
  return (
    <div className={classes.ListCard} onClick={gotoSignUpModal}>
      <img src={footerLogo} alt="게시판 이미지" />
      <div className={classes.ListCardTitle}>
        <span>{dummy.title}</span>
      </div>
      <div className={classes.ListCardContent}>
        <span>{dummy.content}</span>
      </div>
      <div className={classes.ListCardMeetingDate}>
        <span>{dummy.meetingDate}</span>
      </div>
    </div>
  );
};

export default ListCard;
