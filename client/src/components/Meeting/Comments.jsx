import classes from "../../styles/components/Comments.module.css";
import footerLogo from "../../images/footerLogo.png";
import ReactPaginate from "react-paginate";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "../../axios";
const Comments = (props) => {
  const [commentLikes, setCommentLikes] = useState({});
  const [comments, setComments] = useState(props.comments);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 2;
  console.log(props.comments);
  // const commentsLength = props.comments.length;
  useEffect(() => {
    // props.comments가 변경될 때마다 comments 상태를 업데이트
    setComments(props.comments);
  }, [props.comments]);
  useEffect(() => {
    const initialCommentLikes = {};
    if (comments) {
      comments.forEach((comment) => {
        axios
          .get(
            `/v1/likes/comments/${comment.commentId}/like-status?memberId=${props.loggedInUser.id}`
          )

          .then((response) => {
            console.log(response);
            if (response.data === true) {
              setCommentLikes((prevState) => ({
                ...prevState,
                [comment.commentId]: true,
              }));
            } else {
              setCommentLikes((prevState) => ({
                ...prevState,
                [comment.commentId]: false,
              }));
            }
          })
          .catch((error) => {
            console.error("Error getting likes data: ", error);
            alert("오류가 발생했습니다!");
          });
      });
    }
  }, [comments]);

  const likeHandler = (commentId) => {
    // 댓글 좋아요 상태 토글
    setCommentLikes((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));

    // 좋아요 요청 보내기
    axios
      .post(`/v1/likes/comments/${commentId}?memberId=${props.loggedInUser.id}`)
      .then((response) => {
        console.log(response);
        const updatedComments = comments.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              likeCount: commentLikes[commentId]
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            };
          }
          return comment;
        });
        console.log(updatedComments);
        setComments(updatedComments);
      })
      .catch((error) => {
        console.error("Error liking comment data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  const [sortOption, setSortOption] = useState("recent");
  const [sortedComments, setSortedComments] = useState([]);

  useEffect(() => {
    // 최신 순으로 정렬
    if (sortOption === "recent" && comments) {
      const sortedByRecent = [...comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedComments(sortedByRecent);
    }
    // 좋아요 순으로 정렬
    else if (sortOption === "likes" && comments) {
      const sortedByLikes = [...comments].sort(
        (a, b) => b.likeCount - a.likeCount
      );
      setSortedComments(sortedByLikes);
    }
  }, [comments, sortOption]);
  useEffect(() => {
    console.log("updated commentLikes");
  }, [commentLikes]);
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };
  // useEffect(() => {
  //   axios
  //     .post(
  //       `/v1/likes/comments/${commentId}/like-status?memberId=${props.loggedInUser.memberId}`
  //     )

  //     .then((response) => {
  //       if (response.data === true) {
  //         setCommentLikes((prevState) => ({
  //           ...prevState,
  //           [commentId]: true,
  //         }));
  //       } else {
  //         setCommentLikes((prevState) => ({
  //           ...prevState,
  //           [commentId]: false,
  //         }));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error getting likes data: ", error);
  //       alert("오류가 발생했습니다!");
  //     });
  // }, []);
  // useEffect(() => {
  //   console.log(commentsPerPage);
  //   const fetchComments = async () => {
  //     try {
  //       const response = await axios.get(
  //         `/v1/comments?partyId=${props.partyId}&page=${page}&size=${commentsPerPage}`
  //       );
  //       console.log(response.data.data);
  //       // setComments(response.data.data);
  //       // setTotalComments(response.data.pageInfo.totalElements);
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //     }
  //   };

  //   fetchComments();
  // }, [page]);
  return (
    <div className={classes.comments}>
      <div className={classes.dropdown}>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="recent">최신 순</option>
          <option value="likes">좋아요 순</option>
        </select>
      </div>
      {!props.isLoading &&
        comments &&
        sortedComments.map((comment) => {
          return (
            <div key={comment.commentId} className={classes.comm}>
              <div className={classes.info}>
                <img
                  alt="ProfileImage"
                  src={footerLogo}
                  width="50px"
                  height="50px"
                />
                <div className={classes.user}>
                  <div>{comment.nickname}</div>{" "}
                  <div>
                    {new Date(comment.createdAt).toLocaleString("ko-KR")}{" "}
                  </div>
                </div>
              </div>

              <div className={classes.commcontent}>
                {comment.comment}{" "}
                <div
                  className={classes.likes}
                  onClick={() => {
                    likeHandler(comment.commentId);
                  }}
                >
                  <FaThumbsUp
                    style={{
                      fontSize: "1.5rem",
                      color: commentLikes[comment.commentId]
                        ? "green"
                        : "black",
                    }}
                  />{" "}
                  {comment.likeCount}
                </div>
              </div>
            </div>
          );
        })}
      {/* <ReactPaginate
        pageCount={Math.ceil(totalComments / commentsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={classes.pagination}
        activeClassName={classes.active}
      /> */}
    </div>
  );
};
export default Comments;
