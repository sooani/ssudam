// MyEventCard.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAxiosInterceptors } from "../../axios";
// import useAxiosInstance from "../../axios";
import classes from "../../styles/components/MyEventCard.module.css";
import ssudamhand from "../../images/ssudamhand.png";
import Pagination from "./Pagination";

import SignUpModal from "../../pages/SignUpModal";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function MyEventCard() {
  const { partyMemberId } = useParams();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const eventsPerPage = 4;
  const instance = useAxiosInterceptors();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchEvents = () => {
      // user 객체에서 user.memberId가 있다고 가정합니다
      const memberId = user ? user.memberId : null;

      if (memberId !== null) {
        instance
          .get("/v1/parties", {
            params: {
              partyMemberId: memberId,
              page,
              size: eventsPerPage,
            },
          })
          .then((response) => {
            setEvents(response.data.data);
          })
          .catch((error) => {
            console.error("나의 모임 받아오기 오류:", error);
          });
      }
    };

    fetchEvents();
  }, [page, user]); 

    //날짜 형식 표시
    const extractDate = (fullDate) => {
      const dateObject = new Date(fullDate);
      // 날짜를 'YYYY-MM-DD' 형식으로 변환
      const formattedDate = dateObject.toISOString().split('T')[0];
      return formattedDate;
    };

  const EventPostClick = (event) => {
    console.log("클릭된 이벤트:", event);

    if (!user) {
      setModalIsOpen(true);
    } else {
      window.location.href = `/meetings/${event.partyId}`;
    }
  };

  return (
    <div className={classes.EventCardContainer}>
      <div className={classes.EventCardMain}>
        {events.length === 0 ? (
          <p>아직 참여한 모임이 없어요!</p>
        ) : (
          <>
            {events.map((event) => (
              <div key={event.partyId} onClick={() => EventPostClick(event)}>
                <div className={classes.Statuscontainer}>
                  <p className={classes.Status}>
                    {" "}
                    {event.partyStatus === "PARTY_OPENED"
                      ? " 모집중"
                      : " 모집완료"}
                  </p>
                </div>
                <div className={classes.EventTitleBox}>
                  <div className={classes.Title}>{event.title}</div>
                  {/* <img className={classes.Img} src={ssudamhand} alt="Ssudamhand" /> */}
                  <div className={classes.Datecontainer}>
                    <p className={classes.meetingDate}> 모임날짜 | {extractDate(event.meetingDate)}</p>
                    <p className={classes.closingDate}> 모임마감 | {extractDate(event.closingDate)}</p>
                  </div>
                  {/* <button>바로가기</button> */}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={classes.CardPagination}>
        <Pagination
          total={events.length}
          limit={eventsPerPage}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default MyEventCard;
