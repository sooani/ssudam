// import classes from "../../styles/components/Comments.module.css";
// import footerLogo from "../../images/footerLogo.png";
// import { FaThumbsUp } from "react-icons/fa";
// import { useState, useEffect } from "react";
// const Comment = () => {
//   const [isLiked, setIsLiked] = useState(false);
//   const likeHandler = (commentId) => {
//     setIsLiked(!isLiked);
//     console.log(props.loggedInUser);
//     axios
//       .post(`/v1/likes/comments/${commentId}?memberId=${props.loggedInUser.id}`)
//       // 토큰 관련 뭐 보내야 하는듯?
//       .then((response) => {})
//       .catch((error) => {
//         console.error("Error liking comment data: ", error);
//         alert("오류가 발생했습니다!");
//       });
//   };
//   return;
// };
// export default Comment;
