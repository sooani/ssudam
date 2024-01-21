import { useState } from "react";
import classes from "../styles/pages/MakeReview.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useAxiosInterceptors } from "../axios";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
const MakeReview = () => {
  const loggedInUser = useSelector(selectUser);
  // const axios = useAxiosInstance();
  const navigate = useNavigate();
  const axios = useAxiosInterceptors();
  // 리뷰 글 정보
  const [postedInfo, setPostedInfo] = useState({
    postedtitle: "",

    content: "",
  });

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(-1);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // form에서 값 추출
    const data = new FormData(e.target);
    const postedtitle = data.get("postedtitle");
    const content = data.get("content");

    let reviewDTO = {
      title: postedtitle,
      memberId: loggedInUser.memberId,

      content: content,
    };
    // DTO 생성했으니 값 초기화

    axios
      .post(`/v1/reviews`, reviewDTO)
      .then((response) => {
        alert("후기글이 등록되었습니다!");
        window.location.href = "/freeboard";
      })
      .catch((error) => {
        console.error("Error posting review data: ", error);
        alert(error.response.data.message);
        // alert("오류가 발생했습니다!");
      });
  };
  return (
    <div className={classes.wrapper}>
      <Header />

      <form onSubmit={submitHandler}>
        <div className={classes.container}>
          <div className={classes.title}>
            <h2>제목</h2>
            <input
              type="text"
              placeholder="글 제목을 입력하세요..."
              required
              name="postedtitle"
            />
          </div>
          <div className={classes.info}></div>
          <div className={classes.comment}>
            <h2>내용</h2>
            <textarea
              placeholder="내용을 작성해 주세요..."
              required
              name="content"
            />
            <div className={classes.btnCon}>
              <button className={classes.cancelBtn} onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className={classes.postBtn}>
                후기 등록
              </button>
            </div>
          </div>
        </div>
      </form>

      <Footer />
    </div>
  );
};
export default MakeReview;
