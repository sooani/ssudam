import classes from '../../styles/components/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserLarge } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

/*
  헤더
  로고 왼쪽에 표시 클릭 시 메인페이지로 이동
  새 글 쓰기, 로그인, 회원가입 버튼 오른쪽에 표시 클릭 시 각 페이지로 이동
  로그인 안 하고 새 글 쓰기 버튼 클릭 시 모달창을 통해 회원가입 페이지 출력
  로그인 완료 시 로그아웃으로 변경, 회원가입 버튼 마이페이지 이모티콘으로 변경되서 출력
*/

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const gotoPost = () => {
    navigate('/meetings/new');
  };
  const gotoLogin = () => {
    navigate('/Login');
  };
  const gotoSignUp = () => {
    navigate('/SignUp');
  };
  const gotoMyPage = () => {
    // 마이페이지로 이동
    // 사용자 정보에 따라 동적으로 경로 설정 가능
    navigate(`/MyPage/1`);
  };

  return (
    <header>
      <div className={classes.header}>
        <h1>
          <Link to="/">쓰담</Link>
        </h1>
        <div className={classes.loginElement}>
          <button className={classes.postRegister} onClick={gotoPost}>
            새 글 쓰기
          </button>
          {user ? (
            <>
              <button className={classes.logout}>로그아웃</button>
              <button className={classes.mypage} onClick={gotoMyPage}>
                <FaUserLarge />
              </button>
            </>
          ) : (
            <>
              <button className={classes.login} onClick={gotoLogin}>
                로그인
              </button>
              <button className={classes.join} onClick={gotoSignUp}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
