import classes from "../../styles/components/Comments.module.css";
import footerLogo from "../../images/footerLogo.png";
import ReactPaginate from "react-paginate";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import replyImg from "../../images/reply.png";
import axios from "../../axios";
const Comments = (props) => {
  const [commentLikes, setCommentLikes] = useState({});
  const [comments, setComments] = useState(props.comments);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [isReplyOpened, setIsReplyOpened] = useState([]);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  // const [enteredReply, setEnteredReply] = useState("");
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
      const initialIsReplyOpened = comments.reduce(
        (acc, comment) => ({ ...acc, [comment.commentId]: false }),
        {}
      );
      setIsReplyOpened(initialIsReplyOpened);
    }
  }, [comments]);
  useEffect(() => {}, [isReplyOpened]);
  const openReplyHandler = (commentId) => {
    console.log(isReplyOpened);
    if (comments) {
      // setIsReplyOpened(Array(comments.length).fill(false));
      setIsReplyOpened((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    }
  };
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

  const replyChangeHandler = (e) => {
    setReply((prev) => ({
      ...prev,
      reply: e.target.value,
    }));
  };
  const replyHandler = (e, commentId) => {
    e.preventDefault();
    // console.log(loggedInUser.nickname);
    let replyDTO = {
      // id: Math.random() * 1000,
      // partyId: meetingId,
      commentId: commentId,
      memberId: props.loggedInUser.id,
      reply: reply.reply,
    };
    console.log(replyDTO);
    axios
      .post(`/v1/replies`, replyDTO)
      .then((response) => {
        console.log(response.data);

        alert("대댓글이 등록되었습니다!");
        // setIsReplyOpened((prev) => ({
        //   ...prev,
        //   [commentId]: !prev[commentId],
        // }));
        const locationHeaderValue = response.headers.location;

        // '/v1/comments/{commentId}'에서 commentId 부분을 추출
        const replyIdMatch = locationHeaderValue.match(/\/v1\/replies\/(\d+)/);

        if (replyIdMatch && replyIdMatch[1]) {
          // commentId를 사용하여 원하는 작업 수행
          const replyId = replyIdMatch[1];
          console.log("Extracted Reply ID:", replyId);
          axios.get(`/v1/replies/${replyId}`).then((response) => {
            console.log(response.data.data);
            setReplies((prevReplies) => ({
              ...prevReplies,
              [commentId]: response.data.data,
            }));
          });
        } else {
          console.error("Comment ID not found in Location header.");
        }
      })
      .catch((error) => {
        console.error("Error posting comment data: ", error);
      });
    // console.log(comments);
  };
  console.log(replies);
  useEffect(() => {}, []);
  return (
    <div className={classes.comments}>
      {sortedComments.length >= 2 && (
        <div className={classes.dropdown}>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="recent">최신 순</option>
            <option value="likes">좋아요 순</option>
          </select>
        </div>
      )}
      {!props.isLoading &&
        comments &&
        sortedComments.map((comment) => {
          return (
            <div className={classes.container}>
              {" "}
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
                  </div>{" "}
                </div>

                <div className={classes.commcontent}>
                  {comment.comment}{" "}
                  {props.userInfo.nickname === props.loggedInUser.nickname && (
                    <div
                      className={classes.replyIcon}
                      onClick={() => {
                        openReplyHandler(comment.commentId);
                      }}
                    >
                      {" "}
                      {/* 답글 아이콘은 글 작성자랑 현재 로그인한 사용자의 닉네임이 같을 경우만 띄워짐 */}
                      <FaComment
                        style={{
                          fontSize: "1.5rem",
                          color: "black",
                        }}
                      />
                    </div>
                  )}
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
                    />
                    {comment.likeCount}
                  </div>
                </div>
              </div>
              <>
                {props.userInfo.nickname === props.loggedInUser.nickname && (
                  <div className={classes.reply}>
                    {" "}
                    <div className={classes.info}>
                      <img
                        alt="replyImage"
                        src={replyImg}
                        width="30px"
                        height="30px"
                      />{" "}
                      <div className={classes.comment}>
                        {" "}
                        <textarea
                          placeholder="대댓글 내용을 입력하세요..."
                          value={
                            comment.reply ? comment.reply.reply : reply.reply
                          }
                          onChange={replyChangeHandler}
                          required
                        />
                        {!comment.reply && (
                          <div className={classes.btnCon_2}>
                            <button
                              className={classes.joinBtn_1}
                              // type="submit"
                              onClick={(e) => {
                                replyHandler(e, comment.commentId);
                              }}
                            >
                              등록
                              {/* <FaPlus style={{ fontSize: "1.5rem" }} /> */}
                            </button>
                          </div>
                        )}
                        {comment.reply && (
                          <div className={classes.btnCon_2}>
                            <button
                              className={classes.joinBtn}
                              // onClick={commentEditHandler}
                            >
                              수정
                            </button>
                            <button
                              className={classes.deleteBtn}
                              // onClick={commentDeleteHandler}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!props.userInfo.nickname === props.loggedInUser.nickname && (
                  <div className={classes.reply}>
                    {" "}
                    <div className={classes.info}>
                      <img
                        alt="replyImage"
                        src={replyImg}
                        width="30px"
                        height="30px"
                      />
                      <img
                        alt="ProfileImage"
                        src={footerLogo}
                        width="50px"
                        height="50px"
                      />
                      <div className={classes.user}>
                        <div>{comment.reply.nickname}</div>{" "}
                        <div>
                          {new Date(comment.reply.createdAt).toLocaleString(
                            "ko-KR"
                          )}{" "}
                        </div>
                      </div>
                    </div>
                    <div className={classes.commcontent}>
                      {comment.reply.reply}{" "}
                      {/* <div
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
                        </div> */}
                    </div>
                  </div>
                )}
              </>
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
