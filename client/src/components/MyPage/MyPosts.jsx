// MyPosts.jsx
import React, { useState, useEffect } from 'react';
import instance from 'axios';
import Pagination from './Pagination';
import classes from '../../styles/components/MyPosts.module.css';

function MyPosts() {
  const [partyTitles, setPartyTitles] = useState([]);  // 상태 변수 이름 수정
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchPartyTitles = async () => {
      try {
        const response = await instance.get('/v1/comments');
        const extractedPartyTitles = response.data.data.map(comment => comment.partyTitle);
        setPartyTitles(extractedPartyTitles);
      } catch (error) {
        console.error('Error fetching partyTitles:', error);
      }
    };

    fetchPartyTitles();
  }, [limit, page]);

  return (
    <div className={classes.MyPostsContainer}>
      {partyTitles.length === 0 ? (
        <p className={classes.MyPostsMSG}>아직 작성한 댓글이 없습니다.</p>
      ) : (
        partyTitles.slice(offset, offset + limit).map((partyTitle, index) => (
          <article key={index}>
            <p className={classes.PartyTitle}>{partyTitle}</p>
          </article>
        ))
      )}

      <Pagination total={partyTitles.length} limit={limit} page={page} setPage={setPage} />
    </div>
  );
}

export default MyPosts;
