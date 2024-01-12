import classes from "../../styles/components/Comment.module.css";
import footerLogo from "../../images/footerLogo.png";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "../../axios";
const Comment = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const likeHandler = (commentId) => {
    setIsLiked(!isLiked);

    axios
      .post(`/v1/comments/${commentId}?memberId=${props.userInfo.userId}`)
      // 토큰 관련 뭐 보내야 하는듯?
      .then((response) => {})
      .catch((error) => {
        console.error("Error liking comment data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  return (
    <div className={classes.comments}>
      {!props.isLoading &&
        props.comments &&
        props.comments.map((comment) => {
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
                    {new Date(comment.modifiedAt).toLocaleString("ko-KR")}
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
                      color: isLiked ? "green" : "black",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default Comment;
