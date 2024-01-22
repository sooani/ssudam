// //MyComment.jsx
// import React, { useState, useEffect } from "react";
// import Pagination from "./Pagination";
// import { useAxiosInterceptors } from "../../axios";
// // import useAxiosInstance from "../../axios";
// import classes from "../../styles/components/MyComment.module.css";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// function MyComment() {
//   const [comments, setComments] = useState([]);
//   const [limit, setLimit] = useState(10);
//   const [page, setPage] = useState(1);
//   const offset = (page - 1) * limit;
//   const { memberId } = useParams();
//   const [size, setSize] = useState(10);
//   // const instance = useAxiosInstance();
//   const instance = useAxiosInterceptors();
//   const navigate = useNavigate();



//   useEffect(() => {
//     const fetchComments = () => {
//       instance
//         // .get(`/v1/comments?memberId=${memberId}`)
//         .get(`/v1/comments`, { params: { memberId, page, limit, size } })
//         .then((response) => {
//           const extractedComments = response.data.data.map(
//             (comment) => comment.comment
//           );
//           setComments(extractedComments);
//         })
//         .catch((error) => {
//           console.error(
//             "댓글 받아오기 오류!:",
//             error.response?.data || "알 수 없는 오류"
//           );
//           // 여기에서 에러 처리를 추가할 수 있습니다.
//         });
//     };

//     fetchComments();
//   }, [limit, page, memberId, size]);

//   return (
//     <div className={classes.MyCommentContainer}>
//       {comments.length === 0 ? (
//         <p className={classes.MyCommentMSG}>아직 작성한 댓글이 없습니다! 😉</p>

//       ) : (
//         comments.slice(offset, offset + limit).map((comment, index) => (
//           <article key={index} className={classes.CommentKey}>
//             <p className={classes.Comment}
//             onClick={() => navigate(`/meetings/${comment.partyId}`)}>{comment}</p>
//           </article>
//         ))
//       )}

//       <Pagination
//         total={comments.length}
//         limit={limit}
//         page={page}
//         setPage={setPage}
//       />
//     </div>
//   );
// }

// export default MyComment;


// MyComment.jsx
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { useAxiosInterceptors } from "../../axios";
// import useAxiosInstance from "../../axios";
import classes from "../../styles/components/MyComment.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function MyComment() {
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const { memberId } = useParams();
  const [size, setSize] = useState(10);
  // const instance = useAxiosInstance();
  const instance = useAxiosInterceptors();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // 댓글 가져오기
        const commentsResponse = await instance.get(`/v1/comments`, {
          params: { memberId, page, limit, size },
        });

        const extractedComments = commentsResponse.data.data.map(
          (comment) => comment.comment
        );
        setComments(extractedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  // }, [limit, page, memberId, size, instance, navigate]);
}, []);



  return (
    <div className={classes.MyCommentContainer}>
      {comments.length === 0 ? (
        <p className={classes.MyCommentMSG}>
          아직 작성한 댓글이 없습니다! 😉
        </p>
      ) : (
        comments.slice(offset, offset + limit).map((comment, index) => (
          <article key={index} className={classes.CommentKey}>
            <p
              className={classes.Comment}
              onClick={() => navigate(`/meetings/${comment.partyId}`)}
            >
              {comment}
            </p>
          </article>
        ))
      )}
  
      <Pagination total={comments.length} limit={limit} page={page} setPage={setPage} />
    </div>
  );
        }
export default MyComment;
