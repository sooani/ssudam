// // MyEventCard.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAxiosInterceptors } from "../../axios";
// // import useAxiosInstance from "../../axios";
// import classes from "../../styles/components/MyEventCard.module.css";
// import ssudamhand from "../../images/ssudamhand.png";
// import Pagination from "./Pagination";

// import SignUpModal from "../../pages/SignUpModal";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../features/userSlice";

// function MyEventCard() {
//   const { partyMemberId } = useParams();
//   const [events, setEvents] = useState([]);
//   const [page, setPage] = useState(1);
//   const eventsPerPage = 4;
//   const [totalPages, setTotalPages] = useState(0);
//   const instance = useAxiosInterceptors();

//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const user = useSelector(selectUser);

//   useEffect(() => {
//     const fetchEvents = () => {
//       const memberId = user ? user.memberId : null;
  
//       if (memberId !== null) {
//         instance
//           .get("/v1/parties", {
//             params: {
//               partyMemberId: memberId,
//               page: page,
//               size: eventsPerPage,
//             },
//           })
//           .then((response) => {
//             const totalEvents = response.data.total;
//             const numPages = Math.ceil(totalEvents / eventsPerPage);
//             setPage(page > numPages ? numPages : page);
//             setTotalPages(numPages);
  
//             // Extract events for the current page
//             const startIndex = (page - 1) * eventsPerPage;
//             const endIndex = Math.min(startIndex + eventsPerPage, response.data.data.length);
//             const pageEvents = response.data.data.slice(startIndex, endIndex);
  
//             setEvents(pageEvents);
//           })
//           .catch((error) => {
//             console.error("나의 모임 받아오기 오류:", error);
//           });
//       }
//     };

//     const numPages = Math.ceil(totalPages / eventsPerPage);
//     fetchEvents();
//   }, [page, user]);

//     //날짜 형식 표시
//     const extractDate = (fullDate) => {
//       const dateObject = new Date(fullDate);
//       // 날짜를 'YYYY-MM-DD' 형식으로 변환
//       const formattedDate = dateObject.toISOString().split('T')[0];
//       return formattedDate;
//     };

//   const EventPostClick = (event) => {
//     console.log("클릭된 이벤트:", event);

//     if (!user) {
//       setModalIsOpen(true);
//     } else {
//       window.location.href = `/meetings/${event.partyId}`;
//     }
//   };

//   return (
//     <div className={classes.EventCardContainer}>
//       <div className={classes.EventCardMain}>
//         {events.length === 0 ? (
//           <p>아직 참여한 모임이 없어요!</p>
//         ) : (
//           <>
//             {events.map((event) => (

//               <div key={event.partyId} onClick={() => EventPostClick(event)}>
//                 <div className={classes.Statuscontainer}>
//                   <p className={`${classes.Status} ${event.partyStatus === "PARTY_OPENED" ? classes.OpenStatus : classes.ClosedStatus}`}>
//                     {event.partyStatus === "PARTY_OPENED" ? " 모집중" : " 모집완료"}
//                   </p>
//                 </div>
//                 <div className={classes.EventTitleBox}>
//                   <div className={classes.Title}>{event.title}</div>
//                   {/* <img className={classes.Img} src={ssudamhand} alt="Ssudamhand" /> */}
//                   <div className={classes.Datecontainer}>
//                     <p className={classes.meetingDate}> 모임날짜 | {extractDate(event.meetingDate)}</p>
//                     <p className={classes.closingDate}> 모임마감 | {extractDate(event.closingDate)}</p>
//                   </div>
//                   {/* <button>바로가기</button> */}
//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//       <div className={classes.CardPagination}>
//         <Pagination
//           // total={totalPages} 
//           total={numPages}
//           limit={eventsPerPage}
//           page={page}
//           setPage={setPage}
//         />
//       </div>
//     </div>
//   );
// }

// export default MyEventCard;



// MyEventCard.jsx
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
              size: eventsPerPage,
            },
          })
          .then((response) => {
            const totalEvents = response.data.total || 0; // total이 정의되지 않았을 때 0 사용
            const numPages = Math.ceil(totalEvents / eventsPerPage);
            setTotalPages(numPages);
            setPage(page);
            console.log("토탈미팅:",totalEvents);
            console.log("페이지 당 이벤트:",eventsPerPage);
            console.log("페이지넘버:",numPages);


            // Extract events for the current page
            const startIndex = (page - 1) * eventsPerPage;
            const endIndex = Math.min(startIndex + eventsPerPage, response.data.data.length);
            const pageEvents = response.data.data.slice(startIndex, endIndex);

            setEvents(pageEvents);
          })
          .catch((error) => {
            console.error("나의 모임 받아오기 오류:", error);
          });
      }
    };

    fetchEvents();
    console.log("totalPages:", totalPages);
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
