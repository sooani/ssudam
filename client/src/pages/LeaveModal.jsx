// // LeaveModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import classes from "../styles/pages/LeaveModal.module.css";
import { useAxiosInterceptors } from "../axios";
// import useAxiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

function LeaveModal({}) {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const dispatch = useDispatch();
  const { memberId } = useParams();
  // const instance = useAxiosInstance();
  const instance = useAxiosInterceptors();
  const handleLeave = async () => {
    try {
      await instance.delete(`/v1/members/${memberId}`);
      console.log("회원 정보 삭제 성공");
      // 회원 정보 삭제 성공 시, 로컬 스토리지에서 JWT 토큰 삭제?
      // 토큰삭제는 구현안된부분이라고함!!
      setModalIsOpen(false);
      setLeaveSuccess(true);
      dispatch(logout()); // 로그아웃 액션 호출
    } catch (error) {
      console.error("회원 정보 삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (leaveSuccess) {
      setTimeout(() => {
        setLeaveSuccess(false);
        navigate("/");
      }, 100); // 0.1초 후 이동
    }
  }, [leaveSuccess, navigate]);

  return (
    <div>
      <button
        className={classes.LeaveButton}
        onClick={() => setModalIsOpen(true)}
      >
        회원탈퇴
      </button>
      <Modal
        isOpen={modalIsOpen}
        className={classes["custom-modal"]}
        overlayClassName={classes["custom-overlay"]}
      >
        <button className={classes.X} onClick={() => setModalIsOpen(false)}>
          X
        </button>
        <p className={classes["leave-message"]}>정말 탈퇴 하시겠습니까?</p>
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

// LeaveModal.jsx
// import React, { useState, useEffect } from "react";
// import Modal from "react-modal";
// import classes from "../styles/pages/LeaveModal.module.css";
// import { useAxiosInterceptors } from "../axios";
// // import useAxiosInstance from "../axios";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../features/userSlice";
// import { useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";

// function LeaveModal({}) {
//   const navigate = useNavigate();
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [leaveSuccess, setLeaveSuccess] = useState(false);
//   const dispatch = useDispatch();
//   const { memberId } = useParams();
//   const { Id } = useParams();
//   // const instance = useAxiosInstance();


//   const instance = useAxiosInterceptors();

//   const handleLeave = async () => {
//     try {
//       const commentResponse = await instance.get(`/v1/comments?page=1&size=10000&memberId=${memberId}`);
//       const comments = commentResponse.data?.data || [];
      
//       // 각 댓글 삭제
//       for (const comment of comments) {
//         const commentId = comment.commentId;
//         await instance.delete(`/v1/comments/${commentId}`);
//         console.log(`${commentId} 댓글 삭제 성공`);
//       }
//       //후기 삭제
//       // await instance.delete(`/v1/reviews/${commentId}`);
//       // 회원과 관련된 파티 가져오기
//       const response = await instance.get(`/v1/parties?memberId=${memberId}`);
//       const parties = response.data?.data || [];
//       console.log("멤버의 parties:", parties);
  
//       // 각 파티를 삭제
//       for (const party of parties) {
//         const partyId = party.partyId;
//         await instance.delete(`/v1/parties/${partyId}`);
//         console.log(`${partyId} 파티 삭제 성공`);
//       }

//       await instance.delete(`/v1/members/${memberId}`);
  
//       console.log("회원 정보 삭제 성공");
//       setModalIsOpen(false);
//       setLeaveSuccess(true);
//       dispatch(logout()); // 로그아웃 액션 호출
//     } catch (error) {
//       console.error("회원 정보 삭제 실패:", error);
//     }
//   };

//   useEffect(() => {
//     if (leaveSuccess) {
//       setTimeout(() => {
//         setLeaveSuccess(false);
//         navigate("/");
//       }, 100); // 0.1초 후 이동
//     }
//   }, [leaveSuccess, navigate]);

//   return (
//     <div>
//       <button
//         className={classes.LeaveButton}
//         onClick={() => setModalIsOpen(true)}
//       >
//         회원탈퇴
//       </button>
//       <Modal
//         isOpen={modalIsOpen}
//         className={classes["custom-modal"]}
//         overlayClassName={classes["custom-overlay"]}
//       >
//         <button className={classes.X} onClick={() => setModalIsOpen(false)}>
//           X
//         </button>
//         <p className={classes["leave-message"]}>정말 탈퇴 하시겠습니까?</p>
//         <div className={classes.buttons}>
//           <button className={classes.Yes} onClick={handleLeave}>
//             예
//           </button>
//           <button className={classes.No} onClick={() => setModalIsOpen(false)}>
//             아니오
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default LeaveModal;

