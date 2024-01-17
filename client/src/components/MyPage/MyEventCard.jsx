// MyEventCard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from '../../styles/components/MyEventCard.module.css';
import ssudamhand from '../../images/ssudamhand.png';
import Pagination from './Pagination';

function MyEventCard() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const eventsPerPage = 4; 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/v1/parties?partyMemberId=1&_page=${page}&_limit=${eventsPerPage}`);
        setEvents(response.data.data);
      } catch (error) {
        console.error('나의 모임 받아오기 오류:', error);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <div className={classes.EventCardContainer}>

      {/* <div classname={classes.CardContainer}>
        <p classname={classes.CardTitle}>제목입니다.</p>
        <div classname={classes.CardStatus}>모집중</div>
        <img src={ssudamhand} alt="Ssudamhand" classname={classes.CardImage}/>
        <button classname={classes.CardButton}>바로가기</button>
      </div> */}

      {events.length === 0 ? (
        <p>아직 참여한 모임이 없어요!</p>
      ) : (
        <>
          {events.map(event => (
            <div key={event.partyId}>
              <div className={classes.EventTitle}>
                {event.title}
                {event.partyStatus === 'PARTY_OPENED' ? ' (모집중)' : ' (모집완료)'}
              </div>
              <img src={ssudamhand} alt="Ssudamhand" />
              <button>바로가기</button>
            </div>
          ))}
          <Pagination total={events.length} limit={eventsPerPage} page={page} setPage={setPage} />
        </>
      )}
    </div>
  );
}

export default MyEventCard;
