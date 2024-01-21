import React, { useState, useEffect } from 'react';
import classes from '../../styles/components/NewListCard.module.css';
import SignUpModal from '../../pages/SignUpModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { FaRegLightbulb } from 'react-icons/fa';
import { AiFillAlert } from 'react-icons/ai';
/*
    게시글 컴포넌트
    더미 데이터를 이용하여 확인 합니다.
    제목, 내용, 작성일 출력
*/
const NewListCard = ({ party }) => {
  // 회원가입 모달
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Redux store에서 사용자 정보 가져오기
  const user = useSelector(selectUser);
  // 마감일까지 남은 날짜 및 시간 상태 변수
  const [timeLeft, setTimeLeft] = useState(null);
  // 마감일 까지 남은 날짜 계산 함수
  const calculateTimeLeft = () => {
    if (party?.closingDate) {
      const closingDate = new Date(party.closingDate);
      const currentDate = new Date();
      // 마감일까지의 시간 차이 계산
      const timeDifference = closingDate.getTime() - currentDate.getTime();
      // 남은 일 계산
      const daysLeft = Math.floor(timeDifference / (1000 * 3600 * 24));
      // 마감이 지났는지 확인
      const isClosed = timeDifference < 0;
      let timeLeftText = '';
      if (isClosed) {
        timeLeftText = '모집 마감';
      } else if (daysLeft === 0) {
        timeLeftText = '오늘 마감';
      } else {
        timeLeftText = `마감 ${daysLeft}일 전`;
      }
      setTimeLeft(timeLeftText);
    }
  };
  // 컴포넌트가 마운트되거나 party 객체가 변경될 때 남은 날짜 계산
  useEffect(() => {
    calculateTimeLeft();
  }, [party]);
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
    <div
      className={classes.newWrapper}
      style={{ width: '100%', display: 'inline-block' }}
    >
      <div className={classes.listCard} onClick={handlePostClick}>
        <div className={classes.top}>
          <div className={classes.new}>
            <div className={classes.newPost}>
              <FaRegLightbulb className={classes.faRegLightbulb} />
              <span>NEW</span>
            </div>
            {/* 남은 날짜 및 시간 표시 */}
            <div className={classes.listCardTimeLeft}>
              <AiFillAlert className={classes.aiFillAlert} />
              {timeLeft !== null && <span>{timeLeft}</span>}
            </div>
          </div>
        </div>
        <div className={classes.listCardMeetingDate}>
          <span>모임날짜 | {extractDate(party?.meetingDate)}</span>
        </div>
        <div className={classes.listCardClosingDate}>
          <span>마감일 | {extractDate(party?.closingDate)}</span>
        </div>
        {/* <div className={classes.listCardTitle}> */}
        <h1 className={classes.title}>{party?.title}</h1>
        {/* </div> */}
        <div className={classes.bottom}>
          <div className={classes.capacity}>
            <span className={classes.capacityNum}>모집인원 :</span>
            <div className={classes.current}>
              {party?.currentCapacity} / {party?.maxCapacity}
            </div>
          </div>
        </div>
      </div>
      <SignUpModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </div>
  );
};

export default NewListCard;
