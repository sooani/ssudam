import classes from "../../styles/components/Comments.module.css";
import footerLogo from "../../images/footerLogo.png";
import ReactPaginate from "react-paginate";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import replyImg from "../../images/reply.png";
import axios from "../../axios";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
const Comments = (props) => {
  const [commentLikes, setCommentLikes] = useState({}); // 코멘트들의 좋아요 상태
  const [comments, setComments] = useState(props.comments); // 해당 모집글의 전체 댓글
  const [page, setPage] = useState(1);
  const [isReplyOpened, setIsReplyOpened] = useState([]); // 답글 버튼 열림/닫힘 상태
  const [replies, setReplies] = useState([]); // 대댓글들 상태
  const [hasReply, setHasReply] = useState({}); // 대댓글 여부 상태
  const [sortOption, setSortOption] = useState("recent"); // 정렬 상태
  const [sortedComments, setSortedComments] = useState([]); // 정렬된 댓글
  console.log(props.userInfo.nickname);
  console.log(props.loggedInUser.nickname);
  const loggedInUser = useSelector(selectUser);
  console.log(loggedInUser);
  // props의 댓글이 변화할때 마다 comments 업데이트 (상관없나..?)
  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);
  useEffect(() => {
    console.log(comments);
  }, [comments]);
  useEffect(() => {
    props.getComments();
  }, []);
  useEffect(() => {
    console.log("replies", replies);
  }, [replies]);
  useEffect(() => {
    // 댓글들에 대한 현재 로그인한 사용자의 좋아요 상태를 업데이트
    if (comments && loggedInUser) {
      comments.forEach((comment) => {
        axios
          .get(
            `/v1/likes/comments/${comment.commentId}/like-status?memberId=${loggedInUser.memberId}`
          )

          .then((response) => {
            if (response.data.isLiked === true) {
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
      // 대댓글 창 열림 상태는 댓글의 길이만큼 false 배열로 초기화
      const initialIsReplyOpened = comments.reduce((acc, comment) => {
        const hasReplies = comment.replies && comment.replies.length > 0;

        return { ...acc, [comment.commentId]: hasReplies };
      }, {});

      setIsReplyOpened(initialIsReplyOpened);

      // 대댓글들의 상태를 업데이트, commentId가 key 값, 해당 코멘트의 reply가 value 값
      setReplies((prev) => {
        const newReplies = { ...prev };

        comments.forEach((comment) => {
          newReplies[comment.commentId] = {
            ...newReplies[comment.commentId],

            reply: comment.reply ? comment.reply.reply : "",
            replyId: comment.reply ? comment.reply.replyId : undefined,
          };
        });

        return newReplies;
      });
      // 대댓글을 가지고 있는지 상태를 업데이트
      setHasReply((prevHasReply) => {
        const newHasReply = { ...prevHasReply };

        comments.forEach((comment) => {
          newHasReply[comment.commentId] = comment.reply !== null;
        });

        return newHasReply;
      });
    }
  }, [comments]);
  // 대댓글 창 열림을 관리하는 핸들러
  const openReplyHandler = (commentId) => {
    if (comments) {
      setIsReplyOpened((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    }
  };
  // 댓글의 좋아요 관리 핸들러
  const likeHandler = (commentId) => {
    // 댓글 좋아요 상태 토글
    setCommentLikes((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));

    // 좋아요 요청 보내기
    axios
      .post(`/v1/likes/comments/${commentId}?memberId=${loggedInUser.memberId}`)
      .then((response) => {
        // 좋아요 상태를 업데이트 하여 comments에 저장 (필요 없나..?)
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
        setComments(updatedComments);
      })
      .catch((error) => {
        console.error("Error liking comment data: ", error);
        alert("오류가 발생했습니다!");
      });
  };

  // 정렬 기준에 따라 sortedComments를 업데이트 하는 로직
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
  // 정렬 기준을 변경하는 핸들러
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  // 대댓글 수정 핸들러
  const replyChangeHandler = (e, commentId) => {
    setReplies((prev) => {
      const newReplies = { ...prev };

      newReplies[commentId] = {
        ...newReplies[commentId],

        reply: e.target.value,
      };

      return newReplies;
    });
  };
  // 대댓글을 등록하는 핸들러
  const replyHandler = (e, commentId) => {
    e.preventDefault();

    let replyDTO = {
      commentId: commentId,
      memberId: loggedInUser.memberId,

      reply: replies[commentId].reply,
    };
    console.log(replyDTO);
    axios
      .post(`/v1/replies`, replyDTO)
      .then((response) => {
        alert("대댓글이 등록되었습니다!");
        console.log(response.data);
        const locationHeaderValue = response.headers.location;

        // '/v1/comments/{commentId}'에서 commentId 부분을 추출
        const replyIdMatch = locationHeaderValue.match(/\/v1\/replies\/(\d+)/);

        if (replyIdMatch && replyIdMatch[1]) {
          const replyId = replyIdMatch[1];
          console.log("Extracted Reply ID:", replyId);
          axios.get(`/v1/replies/${replyId}`).then((response) => {
            setReplies((prev) => {
              const newReplies = { ...prev };

              newReplies[commentId] = {
                ...newReplies[commentId],

                reply: newReplies[commentId].reply,
                replyId: replyId,
              };

              return newReplies;
            });
            // 대댓글 보유 상태를 변경
            setHasReply((prevHasReply) => ({
              ...prevHasReply,
              [commentId]: true,
            }));
          });
        } else {
          console.error("Comment ID not found in Location header.");
        }
      })
      .catch((error) => {
        console.error("Error posting comment data: ", error);
      });
  };
  // 대댓글을 수정하는 핸들러
  const replyEditHandler = (commentId, replyId) => {
    const updatedDTO = {
      replyId: replyId,

      reply: replies[commentId].reply,
    };
    axios
      .patch(`/v1/replies/${replyId}`, updatedDTO)
      .then((response) => {
        alert("대댓글이 수정되었습니다!");
      })
      .catch((error) => {
        console.error("Error patching reply data: ", error);
      });
  };
  // 대댓글을 삭제하는 핸들러
  const replyDeleteHandler = (commentId, replyId) => {
    const userConfirmed = window.confirm("해당 대댓글을 삭제하시겠습니까?");

    if (userConfirmed) {
      axios
        .delete(`/v1/replies/${replyId}`)
        .then((response) => {
          alert("대댓글이 삭제되었습니다!");

          setReplies((prev) => {
            const newReplies = { ...prev };

            comments.forEach((comment) => {
              newReplies[comment.commentId] = {
                ...newReplies[comment.commentId],

                reply: "",
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

  return (
    <div className={classes.comments}>
      {/* 정렬된 댓글이 2개이상일 경우만 정렬 기준을 선택할 수 있도록 한다 */}
      {sortedComments.length >= 2 && (
        <div className={classes.dropdown}>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="recent">최신 순</option>
            <option value="likes">좋아요 순</option>
          </select>
        </div>
      )}
      {/* 댓글이 있는 경우 정렬된 댓글을 보여준다 */}
      {!props.isLoading &&
        comments &&
        sortedComments.map((comment) => {
          return (
            <div className={classes.container} key={comment.commentId}>
              <div key={comment.commentId} className={classes.comm}>
                <div className={classes.info}>
                  <img
                    alt="ProfileImage"
                    src={footerLogo}
                    width="50px"
                    height="50px"
                  />
                  <div className={classes.user}>
                    <div>{comment.nickname}</div>
                    <div>
                      {new Date(comment.modifiedAt).toLocaleString("ko-KR")}
                    </div>
                  </div>
                </div>

                <div className={classes.commcontent}>
                  {comment.comment}
                  {/* 현재 모집글의 모임장과 현재 로그인한 사용자가 같은 사람일 경우에만 대댓글을 달 수 있다. */}
                  {props.userInfo.nickname === props.loggedInUser.nickname && (
                    <div
                      className={classes.replyIcon}
                      onClick={() => {
                        openReplyHandler(comment.commentId);
                      }}
                    >
                      <FaComment
                        style={{
                          fontSize: "1.5rem",
                          color:
                            isReplyOpened[comment.commentId] ||
                            hasReply[comment.commentId]
                              ? "#86b6f6"
                              : "black",
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
                          ? "#86b6f6"
                          : "black",
                      }}
                    />
                    {comment.likeCount}
                  </div>
                </div>
              </div>
              <>
                {/* 현재 로그인한 사용자와 해당 모임장이 같은 사람이고, 대댓글 창이 열리거나 대댓글이 존재하는 경우 렌더링 */}
                {props.userInfo.nickname === props.loggedInUser.nickname &&
                  (isReplyOpened[comment.commentId] ||
                    hasReply[comment.commentId]) && (
                    <div className={classes.reply}>
                      <div className={classes.info}>
                        <img
                          alt="replyImage"
                          src={replyImg}
                          width="30px"
                          height="30px"
                        />
                        <div className={classes.comment}>
                          <textarea
                            placeholder="대댓글 내용을 입력하세요..."
                            value={
                              // reply[comment.commentId]
                              //   ? reply[comment.commentId].reply
                              //   : ""
                              replies[comment.commentId].reply
                                ? replies[comment.commentId].reply
                                : ""
                            }
                            onChange={(e) => {
                              replyChangeHandler(e, comment.commentId);
                            }}
                            required
                          />
                          {/* 등록된 대댓글이 없는 경우 등록 버튼을 렌더링 */}
                          {/* 아니면 수정/삭제 버튼을 렌더링 */}
                          {!hasReply[comment.commentId] ? (
                            <div className={classes.btnCon_2}>
                              <button
                                className={classes.joinBtn_1}
                                onClick={(e) => {
                                  replyHandler(e, comment.commentId);
                                }}
                              >
                                등록
                              </button>
                            </div>
                          ) : (
                            <div className={classes.btnCon_2}>
                              <button
                                className={classes.joinBtn}
                                onClick={() => {
                                  replyEditHandler(
                                    comment.commentId,
                                    replies[comment.commentId].replyId
                                  );
                                }}
                              >
                                수정
                              </button>
                              <button
                                className={classes.deleteBtn}
                                onClick={() => {
                                  replyDeleteHandler(
                                    comment.commentId,
                                    replies[comment.commentId].replyId
                                  );
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                {/* 현재 모임장과 로그인한 유저가 다른사람이고 대댓글이 존재하는 경우 대댓글을 보여준다. */}
                {!(props.userInfo.nickname === props.loggedInUser.nickname) &&
                  comment.reply && (
                    <div className={classes.reply}>
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
                          <div>{comment.reply.nickname}</div>
                          <div>
                            {new Date(comment.reply.createdAt).toLocaleString(
                              "ko-KR"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={classes.commcontent}>
                        {comment.reply.reply}
                      </div>
                    </div>
                  )}
              </>
            </div>
          );
        })}
      {/* pagination 관련, 일단은 주석처리 */}
    </div>
  );
};
export default Comments;
