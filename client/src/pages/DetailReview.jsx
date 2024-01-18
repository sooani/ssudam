import { useState, useEffect } from "react";
import classes from "../styles/pages/DetailReview.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { IoIosArrowBack } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";

import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

const DetailReview = () => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 여부
  const [reviewInfo, setReviewInfo] = useState(null); // 현재 후기의 정보

  const [userInfo, setUserInfo] = useState(null); // 현재 후기의 작성자 정보
  const [isMyReview, setIsMyReview] = useState(false); // 내 후기인지 여부

  // const { reviewId } = useParams();
  const { reviewId } = useParams();

  // 리덕스 사용자 정보 불러오기
  const loggedInUser = useSelector(selectUser);
  console.log(loggedInUser);

  // loggedInUser의 해당 글에 대한 코멘트가 존재할 경우 댓글창 대신 해당 댓글을 보여준다.
  const navigate = useNavigate();
  // 수안님 코드의 경우 (party정보에 memberId가 존재할 경우) 주석 해제
  useEffect(() => {
    if (reviewInfo && reviewInfo.memberId) {
      axios
        .get(`/v1/members/${reviewInfo.memberId}`)
        .then((response) => {
          console.log(response.data);
          setUserInfo(response.data.data);
        })
        .catch((error) => {
          console.error("Error getting user data: ", error);
        });
    }
  }, [reviewInfo]);
  // useEffect(() => {
  //   console.log(commentsPerPage);
  //   console.log(currentPage);
  // }, [commentsPerPage, currentPage]);

  // localStorage를 쓸지 함수를 쓸지 추후에 방식 변경 가능성 존재
  // meeting의 userInfo의 id와 현재 로그인된 사용자의 id를 비교하여 isMyPost 업데이트
  useEffect(() => {
    if (reviewInfo) {
      if (reviewInfo.memberId === loggedInUser.memberId) {
        setIsMyReview(true);
      }
    }
  }, [reviewInfo]);

  // 파티를 삭제하는 핸들러
  const deleteReviewHandler = () => {
    const userConfirmed = window.confirm("해당 후기를 삭제하시겠습니까?");
    if (userConfirmed) {
      axios
        .delete(`/v1/reviews/${reviewId}`)
        .then((response) => {
          alert("해당 후기가 삭제되었습니다!");
          window.location.href = "/freeboard";
        })
        .catch((error) => {
          console.error("Error deleting review data: ", error);
          alert("오류가 발생하였습니다!");
        });
    }
  };
  // 처음 party의 상태를 업데이트 하는 로직.
  // 현재는 meetingInfo에 memberId가 없어서 임시로 고정값을 준 상태이다.
  useEffect(() => {
    setIsLoading(true);
    console.log("get reviews");
    axios
      .get(`/v1/reviews/${reviewId}`)
      .then((response) => {
        console.log(response.data);
        setReviewInfo(response.data.data);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting reveiew data: ", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={classes.wrapper}>
      {(isLoading || !reviewInfo || !userInfo) && (
        <>
          <Header />
          <div className={classes.loading}>
            <p>Loading...</p>
          </div>
          <Footer />
        </>
      )}
      {!isLoading && reviewInfo && userInfo && (
        <>
          <Header />
          <div className={classes.container}>
            <div className={classes.infoAndBtn}>
              <div className={classes.info}>
                <div className={classes.title}>
                  <IoIosArrowBack
                    style={{ fontSize: "2rem" }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  />
                  <h1>{reviewInfo.title}</h1>
                </div>
                <div className={classes.writerAndDate}>
                  <div className={classes.writer}>
                    <h4>{userInfo.nickname}</h4>
                  </div>
                  <div className={classes.date}>
                    <h4>{reviewInfo.createdAt.split("T")[0]}</h4>
                  </div>
                </div>
              </div>

              <div className={classes.btnCon}></div>
            </div>
            <div className={classes.detailInfo}>
              <div className={classes.detail}>{reviewInfo.content}</div>

              {/* 내 포스트일 경우 수정/삭제가 가능함, 수정버튼을 클릭 시 수정 페이지로 이동 */}
              {isMyReview && (
                <div className={classes.btnCon_1}>
                  <button
                    className={classes.joinBtn}
                    onClick={() => {
                      window.location.href = `/reviews/${reviewId}/edit`;
                    }}
                  >
                    <FaEdit style={{ fontSize: "1.5rem" }} />
                    수정
                  </button>
                  <button
                    className={classes.deleteBtn}
                    onClick={deleteReviewHandler}
                  >
                    <FaTrash style={{ fontSize: "1.5rem" }} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};
export default DetailReview;
