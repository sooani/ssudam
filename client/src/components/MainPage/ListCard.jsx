import React, { useState } from 'react';
import classes from '../../styles/components/ListCard.module.css';
import SignUpModal from '../../pages/SignUpModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

/*
    게시글 컴포넌트
    더미 데이터를 이용하여 확인 합니다.
    제목, 내용, 작성일 출력
*/

const ListCard = ({ party }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Redux store에서 사용자 정보 가져오기
  const user = useSelector(selectUser);
  const handlePostClick = () => {
    // 사용자 정보가 없으면 (null이면) 로그인되지 않은 상태
    if (!user) {
      // 로그인되어 있지 않다면, 회원 가입 모달 열기
      setModalIsOpen(true);
    } else {
      // 사용자 정보가 있다면, 포스트의 세부 정보 페이지로 이동
      window.location.href = `/meetings/${party.partyId}`;
    }
  };

  // 전체 날짜 및 시간에서 날짜만 추출하는 함수
  const extractDate = (fullDate) => {
    const dateObject = new Date(fullDate);
    // 날짜를 'YYYY-MM-DD' 형식으로 변환
    const formattedDate = dateObject.toISOString().split('T')[0];
    return formattedDate;
  };
  return (
    <div className={classes.listCard} onClick={handlePostClick}>
      <div className={classes.listCardTitle}>
        <span>{party?.title}</span>
      </div>
      <div className={classes.listCardMeetingDate}>
        <span>모임날짜 : {extractDate(party?.meetingDate)}</span>
      </div>
      <div className={classes.listCardClosingDate}>
        <span>마감일 : {extractDate(party?.closingDate)}</span>
      </div>
      ----------------------------------
      <div>닉네임</div>
      <div className={classes.listCardCurrentCapacity}>
        <span>{party?.currentCapacity}/</span>
      </div>
      <div className={classes.listCardMaxCapacity}>
        <span>{party?.maxCapacity}</span>
      </div>
      <SignUpModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </div>
  );
};

export default ListCard;
