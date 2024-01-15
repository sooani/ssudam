//LeaveModal.jsx
//회원정보수정>회원탈퇴시 뜨는 확인 팝업입니다. (작업자:안민주) 

// LeaveModal.jsx
// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import classes from '../styles/pages/LeaveModal.module.css';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function LeaveModal() {
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   return (
//     <div>
//       <button className={classes.LeaveButton} onClick={() => setModalIsOpen(true)}>
//         회원탈퇴
//       </button>
//       <Modal
//         isOpen={modalIsOpen}
//         className={classes['custom-modal']} 
//         overlayClassName={classes['custom-overlay']}
//       >
//         <button className={classes.X} onClick={() => setModalIsOpen(false)}>
//           X
//         </button>
//         <p className={classes['leave-message']}>정말 탈퇴 하시겠습니까?</p>
//         <div className={classes.buttons}>
//           <Link to="/"
//             className={classes.Yes}
//             onClick={() => {
//               setModalIsOpen(false);
//             }}
//           >
//             예
//           </Link>
//           <button className={classes.No} onClick={() => setModalIsOpen(false)}>
//             아니오
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default LeaveModal;





// LeaveModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import classes from '../styles/pages/LeaveModal.module.css';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';

function LeaveModal() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  const handleLeave = async () => {
    try {
      await axios.delete('v1/members/{member-id}');
      console.log('회원 정보 삭제 성공');
      // 회원 정보 삭제 성공 시, 로컬 스토리지에서 JWT 토큰 삭제
      localStorage.removeItem('jwtToken');
      console.log('JWT 토큰이 로컬 스토리지에서 삭제되었습니다.');
      setModalIsOpen(false);
      setLeaveSuccess(true);
    } catch (error) {
      console.error('회원 정보 삭제 실패:', error);
    }
  };

  useEffect(() => {
    if (leaveSuccess) {
      setTimeout(() => {
        setLeaveSuccess(false);
        navigate('/'); // 메인 화면으로 이동
      }, 2000);
    }
  }, [leaveSuccess, navigate]);

  return (
    <div>
      <button className={classes.LeaveButton} onClick={() => setModalIsOpen(true)}>
        회원탈퇴
      </button>
      <Modal
        isOpen={modalIsOpen}
        className={classes['custom-modal']}
        overlayClassName={classes['custom-overlay']}
      >
        <button className={classes.X} onClick={() => setModalIsOpen(false)}>
          X
        </button>
        <p className={classes['leave-message']}>정말 탈퇴 하시겠습니까?</p>
        <div className={classes.buttons}>
          <button className={classes.Yes} onClick={handleLeave}>
            예
          </button>
          <button className={classes.No} onClick={() => setModalIsOpen(false)}>
            아니오
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LeaveModal;

