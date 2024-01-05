//LeaveModal.jsx
//회원정보수정>회원탈퇴시 뜨는 확인 팝업입니다. (작업자:안민주) 

// LeaveModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/pages/LeaveModal.css'; 

function LeaveModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <button className="LeaveButton" onClick={() => setModalIsOpen(true)}>
        회원탈퇴
      </button>
      <Modal
        isOpen={modalIsOpen}
        className="custom-modal" 
        overlayClassName="custom-overlay" 
      >
        <button className="X" onClick={() => setModalIsOpen(false)}>
          X
        </button>
        <p className="leave-message">정말 탈퇴 하시겠습니까?</p>
        <div className="buttons">
          <button
            className="Yes"
            onClick={() => {
              // 탈퇴후 메인으로 돌아감
              setModalIsOpen(false);
            }}
          >
            예
          </button>
          <button className="No" onClick={() => setModalIsOpen(false)}>
            아니오
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LeaveModal;
