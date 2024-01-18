import { useState } from "react";
import classes from "../styles/pages/MakeReview.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const EditReview = () => {
  const loggedInUser = useSelector(selectUser);
  // const { reviewId } = useParams();
  const navigate = useNavigate();
  const { reviewId } = useParams();
  // 리뷰 글 정보
  const [reviewInfo, setReviewInfo] = useState(null);
  // 첫 렌더링 시 후기 정보 가져와서 정보 채움
  useEffect(() => {
    axios
      .get(`/v1/reviews/${reviewId}`)
      .then((response) => {
        setReviewInfo(response.data.data);
        console.log(response.data.data);
        // setReviewInfo({
        //   memberId: 1,
        //   title: "제목",
        //   content: "리뷰의 내용",
        //   createdAt: "2024-01-17T21:45:34.723232",
        //   modifiedAt: "2024-01-17T21:45:34.723232",
        // });
      })
      .catch((error) => {
        console.error("Error getting review data: ", error);
        alert("오류가 발생했습니다!");
      });
  }, [reviewId]);
  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(-1);
  };
  const titleChangeHandler = (e) => {
    setReviewInfo((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };
  const contentChangeHandler = (e) => {
    setReviewInfo((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();

    // form에서 값 추출
    const data = new FormData(e.target);
    const postedtitle = data.get("postedtitle");
    const content = data.get("content");

    let reviewDTO = {
      title: reviewInfo.title,
      memberId: loggedInUser.memberId,
      reviewId: reviewId,
      content: reviewInfo.content,
    };
    // DTO 생성했으니 값 초기화
    console.log(reviewDTO);
    axios
      .patch(`/v1/reviews/${reviewId}`, reviewDTO)
      .then((response) => {
        alert("후기글이 수정되었습니다!");
        window.location.href = "/freeboard";
      })
      .catch((error) => {
        console.error("Error updating review data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  return (
    <div className={classes.wrapper}>
      <Header />

      {reviewInfo && (
        <form onSubmit={submitHandler}>
          <div className={classes.container}>
            <div className={classes.title}>
              <h2>제목</h2>
              <input
                type="text"
                placeholder="글 제목을 입력하세요..."
                required
                name="postedtitle"
                value={reviewInfo.title}
                onChange={titleChangeHandler}
              />
            </div>
            <div className={classes.info}></div>
            <div className={classes.comment}>
              <h2>내용</h2>
              <textarea
                placeholder="내용을 작성해 주세요..."
                required
                name="content"
                value={reviewInfo.content}
                onChange={contentChangeHandler}
              />
              <div className={classes.btnCon}>
                <button className={classes.cancelBtn} onClick={handleCancel}>
                  취소
                </button>
                <button type="submit" className={classes.postBtn}>
                  후기 수정
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <Footer />
    </div>
  );
};
export default EditReview;
