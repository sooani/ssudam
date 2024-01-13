import classes from '../../styles/components/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
// import { FaUserLarge } from 'react-icons/fa6';

/*
  헤더
  로고 왼쪽에 표시 클릭 시 메인페이지로 이동
  새 글 쓰기, 로그인, 회원가입 버튼 오른쪽에 표시 클릭 시 각 페이지로 이동
  로그인 안 하고 새 글 쓰기 버튼 클릭 시 모달창을 통해 회원가입 페이지 출력
  로그인 완료 시 로그아웃으로 변경, 회원가입 버튼 마이페이지 이모티콘으로 변경되서 출력
*/

const Header = (props) => {
  const navigate = useNavigate();
  const gotoPost = () => {
    navigate('/meetings/new');
  };
  const gotoLogin = () => {
    navigate('/Login');
  };
  const gotoSignUp = () => {
    navigate('/SignUp');
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
          <button className={classes.login} onClick={gotoLogin}>
            로그인
          </button>
          <button className={classes.join} onClick={gotoSignUp}>
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
};
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { login, logout, selectIsLoggedIn } from '../features/user/userSlice';
// import classes from '../../styles/components/Header.module.css';

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isLoggedIn = useSelector(selectIsLoggedIn);

//   const gotoPost = () => {
//     navigate('/meetings/new');
//   };

//   const gotoLogin = () => {
//     navigate('/Login');
//   };

//   const gotoSignUp = () => {
//     navigate('/SignUp');
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <header>
//       <div className={classes.header}>
//         <h1>
//           <Link to="/">쓰담</Link>
//         </h1>
//         <div className={classes.loginElement}>
//           <button className={classes.postRegister} onClick={gotoPost}>
//             새 글 쓰기
//           </button>
//           {isLoggedIn ? (
//             <>
//               <button className={classes.logout} onClick={handleLogout}>
//                 로그아웃
//               </button>
//               <button className={classes.mypage}><FaUserLarge /></button>
//             </>
//           ) : (
//             <>
//               <button className={classes.login} onClick={gotoLogin}>
//                 로그인
//               </button>
//               <button className={classes.join} onClick={gotoSignUp}>
//                 회원가입
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };
export default Header;
