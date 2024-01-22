//MyEventard.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAxiosInterceptors } from "../../axios";
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
  const [totalPages, setTotalPages] = useState(0);
  const instance = useAxiosInterceptors();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchEvents = () => {
      const memberId = user ? user.memberId : null;
  
      if (memberId !== null) {
        instance
          .get("/v1/parties", {
            params: {
              partyMemberId: memberId,
              page: page,
              size: eventsPerPage * 2,
            },
          })
          .then((response) => {
            // 총 이벤트 수와 페이지 수 계산
            const totalEvents = response.data.pageInfo.totalElements || 0;
            const numPages = Math.ceil(totalEvents / eventsPerPage);
            // setTotalPages(totalEvents);
            setTotalPages(numPages);
            console.log("numPages:",numPages);
            console.log("totalEvents:",totalEvents);
            console.log("eventsPerPage:",eventsPerPage);

            // 페이지당 이벤트 수 동적으로 설정
            // const eventsPerPage = response.data.pageInfo.size || 10;

            // 올바른 startIndex와 endIndex 계산
        //     const startIndex = (page - 1) * eventsPerPage;
        //     const endIndex = page * eventsPerPage;

        //     // 현재 페이지의 이벤트 추출
        //     const pageEvents = response.data.data.slice(startIndex, endIndex);

        //     setEvents(pageEvents);
        //     console.log("스타트인덱스:",startIndex);
        //     console.log("엔드인덱스:",endIndex);
        //     console.log("페이지이벤트:",pageEvents);
        //   })
        //   .catch((error) => {
        //     console.error("나의 모임 받아오기 오류:", error);
        //   });
        // }
        // };

        const slicedData = [];
        for (let i = 0; i < response.data.data.length; i += eventsPerPage) {
          const pageEvents = response.data.data.slice(i, i + eventsPerPage);
          slicedData.push(pageEvents);
          console.log("슬라이스 데이터:",slicedData);
        }
        const flattenedData = slicedData.flat(); // 배열을 평탄화
        setTotalPages(numPages);
        // setEvents(slicedData[page - 1]);
        setEvents(slicedData[page]);
        setEvents(flattenedData);
      })
      .catch((error) => {
        console.error("나의 모임 받아오기 오류:", error);
      });
  };}

    fetchEvents();
  }, []);

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
          <p className={classes.EmptyEventMessage}>아직 참여한 모임이 없습니다!😊</p>
        ) : (
          <>
            {events.map((event) => (
              <div key={event.partymemberId} onClick={() => EventPostClick(event)}>
                <div className={classes.Statuscontainer}>
                  <p className={`${classes.Status} ${event.partyStatus === "PARTY_OPENED" ? classes.OpenStatus : classes.ClosedStatus}`}>
                    {event.partyStatus === "PARTY_OPENED" ? " 모집중" : " 모집완료"}
                  </p>
                </div>
                <div className={classes.EventTitleBox}>
                  <div className={classes.Title}>{event.title}</div>
                  <div className={classes.Datecontainer}>
                    <p className={classes.meetingDate}> 모임날짜 | {extractDate(event.meetingDate)}</p>
                    <p className={classes.closingDate}> 모임마감 | {extractDate(event.closingDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={classes.CardPagination}>
        <Pagination
          total={totalPages}
          limit={eventsPerPage}
          page={page}
          setPage={setPage}
        />
        
      </div>
    </div>
  );
}

export default MyEventCard;