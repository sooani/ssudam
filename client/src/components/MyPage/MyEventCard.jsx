import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import classes from '../../styles/components/ListCard.module.css';

const MyEventCard = ({ page }) => {
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        const fetchEventData = async () => {
            try {//api 넣어야함
                const response = await axios.get(`/api/events?page=${page}`);
                setEventData(response.data);
            } catch (error) {
                console.error('나의 모임을 불러오는 중 에러:', error);
            }
        };

        fetchEventData();
    }, [page]);

    return (
        <div>
            {eventData.map((event) => (
                <div key={event.id} className={classes.EventCard}>
                    <Link to={`/events/${event.id}`} className={classes.DirectLinkButton}>
                        {event.title}
                    </Link>

                    {/* 나머지 컴포넌트 내용 */}
                </div>
            ))}
        </div>
    );
};

export default MyEventCard;

