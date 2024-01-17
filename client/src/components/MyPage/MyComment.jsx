// MyComment.jsx
import React from 'react';
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import instance from 'axios';
import classes from '../../styles/components/MyComment.module.css';

function MyComment() {
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await instance.get('/v1/comments');
        // 이 부분에서 'comment' 필드만 추출하여 저장합니다.
        const extractedComments = response.data.data.map(comment => comment.comment);
        setComments(extractedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [limit, page]); 

  return (
    <div className={classes.MyCommentContainer}>
      {comments.length === 0 ? (
        <p className={classes.MyCommentMSG}>아직 작성한 댓글이 없습니다.</p>
      ) : (
        comments.slice(offset, offset + limit).map((comment, index) => (
          <article key={index}>
            <p>{comment}</p>
          </article>
        ))
      )}

      <Pagination
        total={comments.length}
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default MyComment;
