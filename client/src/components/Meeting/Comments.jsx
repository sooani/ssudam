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
  const [newReplyId, setNewReplyId] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [isReplyOpened, setIsReplyOpened] = useState([]);
  const [reply, setReply] = useState([]);
  const [replies, setReplies] = useState([]);
  const [hasReply, setHasReply] = useState({});
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
      setReply((prev) => {
        const newReplies = [...prev];
        comments.forEach((comment) => {
          newReplies[comment.commentId] = {
            replyId: comment.reply ? comment.reply.replyId : undefined,
            reply: comment.reply ? comment.reply.reply : undefined,
          };
        });
        return newReplies;
      });
      setReplies((prev) => {
        const newReplies = { ...prev };

        comments.forEach((comment) => {
          newReplies[comment.commentId] = {
            ...newReplies[comment.commentId],
            reply: comment.reply ? comment.reply : {},
          };
        });

        return newReplies;
      });
      setReplies((prev) => {
        const newReplies = { ...prev };

        comments.forEach((comment) => {
          newReplies[comment.commentId] = {
            ...newReplies[comment.commentId],
            reply: comment.reply ? comment.reply : {},
          };
        });

        return newReplies;
      });
      setHasReply((prevHasReply) => {
        const newHasReply = { ...prevHasReply };

        comments.forEach((comment) => {
          // comment.reply가 null이 아니면 true, 그렇지 않으면 false
          newHasReply[comment.commentId] = comment.reply !== null;
        });

        return newHasReply;
      });
    }
  }, [comments]);
  console.log(hasReply);
  useEffect(() => {
    console.log(isReplyOpened);
  }, [isReplyOpened]);
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
  // console.log(reply);
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
  // console.log(reply);
  const replyChangeHandler = (e, commentId) => {
    const { value } = e.target;
    console.log(reply);
    setReply((prev) => {
      const newReplies = [...prev];
      newReplies[commentId] = { reply: value };
      return newReplies;
    });
  };
  const replyHandler = (e, commentId) => {
    e.preventDefault();
    // console.log(loggedInUser.nickname);
    let replyDTO = {
      // id: Math.random() * 1000,
      // partyId: meetingId,
      commentId: commentId,
      memberId: props.loggedInUser.id,
      reply: reply[commentId].reply,
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
            // setReplies((prevReplies) => ({
            //   ...prevReplies,
            //   [commentId]: response.data.data,
            // }));
            console.log(response.data.data.replyId);
            //  const id = response.data.data.replyId;
            setReplies((prev) => {
              const newReplies = { ...prev };

              newReplies[commentId] = {
                ...newReplies[commentId],
                reply: {
                  ...newReplies[commentId].reply,
                  replyId: response.data.data.replyId,
                },
              };

              return newReplies;
            });
            setHasReply((prevHasReply) => ({
              ...prevHasReply,
              [commentId]: true,
            }));
          });
          // setNewReplyId(response.data.data.replyId);
        } else {
          console.error("Comment ID not found in Location header.");
        }
      })
      .catch((error) => {
        console.error("Error posting comment data: ", error);
      });
    // console.log(comments);
    // return id;
  };
  console.log("replies", replies);
  const replyEditHandler = (commentId, replyId) => {
    console.log(commentId, replyId);
    // if (replies[commentId] && replies[commentId].reply) {
    const updatedDTO = {
      replyId: replyId,
      reply: reply[commentId].reply,
    };
    axios
      .patch(`/v1/replies/${replyId}`, updatedDTO)
      .then((response) => {
        console.log(response.data.data);
        alert("대댓글이 수정되었습니다!");
      })
      .catch((error) => {
        console.error("Error patching reply data: ", error);
      });
    // }
  };
  const replyDeleteHandler = (commentId, replyId) => {
    const userConfirmed = window.confirm("해당 대댓글을 삭제하시겠습니까?");

    if (userConfirmed) {
      axios
        .delete(`/v1/replies/${replyId}`)
        .then((response) => {
          console.log(response.data.data);
          alert("대댓글이 삭제되었습니다!");
          // setReplies((prevReplies) => ({
          //   ...prevReplies,
          //   [commentId]: null,
          // }));
          setReply((prev) => {
            const newReplies = [...prev];
            newReplies[commentId] = { reply: "" };
            return newReplies;
          });
          setReplies((prev) => {
            const newReplies = { ...prev };

            comments.forEach((comment) => {
              newReplies[comment.commentId] = {
                ...newReplies[comment.commentId],
                reply: comment.reply ? comment.reply : {},
              };
            });

            return newReplies;
          });
          setHasReply((prevHasReply) => ({
            ...prevHasReply,
            [commentId]: false,
          }));
        })
        .catch((error) => {
          console.error("Error deleting reply data: ", error);
        });
    }
  };
  // console.log("hasReply", hasReply);
  useEffect(() => {
    props.getComments();
  }, []);
  useEffect(() => {
    if (newReplyId !== null) {
      console.log("New Reply ID:", newReplyId);
      // Perform any actions or use the newReplyId as needed
    }
  }, [newReplyId]);
  // console.log(replies[1].reply.replyId);
  // if (reply[1]) console.log("reply", reply[1].replyId);
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
                {props.userInfo.nickname === props.loggedInUser.nickname &&
                  (isReplyOpened[comment.commentId] ||
                    hasReply[comment.commentId]) && (
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
                              reply[comment.commentId]
                                ? reply[comment.commentId].reply
                                : ""
                              // reply.reply
                            }
                            onChange={(e) => {
                              replyChangeHandler(e, comment.commentId);
                            }}
                            required
                          />
                          {!hasReply[comment.commentId] ? (
                            <div className={classes.btnCon_2}>
                              {/* {Object.keys(replies[comment.commentId]).values} */}
                              {/* {replies[comment.commentId].reply.reply} */}
                              {/* {comment.reply} */}
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
                          ) : (
                            <div className={classes.btnCon_2}>
                              {/* {Object.keys(replies[comment.commentId]).values} */}
                              {/* {replies[comment.commentId].reply.reply} */}{" "}
                              <button
                                className={classes.joinBtn}
                                onClick={() => {
                                  // if (reply[comment.commentId].replyId) {
                                  replyEditHandler(
                                    comment.commentId,
                                    // comment.reply.replyId
                                    // comment.reply.replyId
                                    replies[comment.commentId].reply.replyId
                                  );
                                  // }
                                }}
                              >
                                수정
                              </button>
                              <button
                                className={classes.deleteBtn}
                                onClick={() => {
                                  // if (reply[comment.commentId].replyId) {
                                  replyDeleteHandler(
                                    comment.commentId,
                                    replies[comment.commentId].reply.replyId
                                    // latestReplies[comment.commentId].reply.replyId
                                    // comment.reply.replyId
                                  );
                                  // }
                                }}
                              >
                                {/* {replies[comment.commentId].reply.replyId} */}
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                {!(props.userInfo.nickname === props.loggedInUser.nickname) &&
                  comment.reply && (
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
