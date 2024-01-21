import React, { useState } from 'react';
import classes from '../../styles/components/MainHeader.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserLarge } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { logout } from '../../features/userSlice';
import SignUpModal from '../../pages/SignUpModal';
import { MdSearch } from 'react-icons/md';
import ShowTodoList from '../MainPage/ShowTodoList';
/*
  헤더
  로고 왼쪽에 표시 클릭 시 메인페이지로 이동
  새 글 쓰기, 로그인, 회원가입 버튼 오른쪽에 표시 클릭 시 각 페이지로 이동
  로그인 안 하고 새 글 쓰기 버튼 클릭 시 모달창을 통해 회원가입 페이지 출력
  로그인 완료 시 로그아웃으로 변경, 회원가입 버튼 마이페이지 이모티콘으로 변경되서 출력
*/

const MainHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const isAdmin = user && user.roles.includes('ADMIN');

  const [searchkeyword, setSearchkeyword] = useState('');

  const gotoHome = () => {
    navigate('/');
  };
  const gotoPost = () => {
    if (!user) {
      setModalIsOpen(true);
    } else {
      // 로그인하지 않은 경우 모달 창 열기
      navigate('/meetings/new');
    }
  };
  const gotoLogin = () => {
    navigate('/login');
  };
  const gotoSignUp = () => {
    navigate('/signup');
  };
  const gotoFreeboard = () => {
    navigate('/freeboard');
  };
  const gotoMyPage = () => {
    // 마이페이지로 이동
    // 사용자 정보에 따라 동적으로 경로 설정 가능
    navigate(`/mypage/${user?.memberId}`);
  };
  const gotoTodolist = () => {
    navigate(`/todolist`);
  };
  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    // 로그아웃 액션 디스패치
    dispatch(logout());
    // 로그아웃 후 홈페이지로 이동
    navigate('/');
  };

  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
  };
  const onSearchHandler = () => {
    if (searchkeyword.trim() === '') {
      alert('키워드를 입력하세요!');
    } else {
      navigate(`/search/${searchkeyword}`);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchHandler();
    }
  };
  return (
    <header className={classes.header}>
      <h1 className={classes.logo} onClick={gotoHome}>
        쓰담
      </h1>
      <ShowTodoList />
      <div className={classes.search}>
        <input
          type="text"
          placeholder="검색할 키워드를 입력하세요..."
          value={searchkeyword}
          onChange={onKeywordHandler}
          onKeyPress={handleKeyPress}
        />
        <MdSearch className={classes.icon} onClick={onSearchHandler}>
          검색
        </MdSearch>
      </div>
      <div className={classes.loginElement}>
        {user ? (
          <>
            {isAdmin && (
              <div className={classes.postRegister} onClick={gotoTodolist}>
                관리자
              </div>
            )}
            <div className={classes.postRegister} onClick={gotoFreeboard}>
              게시판
            </div>
            <div className={classes.postRegister} onClick={gotoPost}>
              새 글 쓰기
            </div>
            <div className={classes.logout} onClick={handleLogout}>
              로그아웃
            </div>
            <div className={classes.mypage} onClick={gotoMyPage}>
              <FaUserLarge />
            </div>
          </>
        ) : (
          <>
            <div className={classes.postRegister} onClick={gotoFreeboard}>
              게시판
            </div>
            <div className={classes.postRegister} onClick={gotoSignUp}>
              새 글 쓰기
            </div>
            <div className={classes.login} onClick={gotoLogin}>
              로그인
            </div>
            <div className={classes.join} onClick={gotoSignUp}>
              회원가입
            </div>
            <SignUpModal
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
