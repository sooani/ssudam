//LeaveModal.jsx
//회원정보수정>회원탈퇴시 뜨는 확인 팝업입니다. (작업자:안민주) 

// LeaveModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import classes from '../styles/pages/LeaveModal.module.css';

function LeaveModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
          <button
            className={classes.Yes}
            onClick={() => {
              // 탈퇴 후 메인으로 돌아감
              setModalIsOpen(false);
            }}
          >
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