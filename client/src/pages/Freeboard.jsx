import React, { useState, useEffect } from "react";
import classes from "../styles/pages/Freeboard.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const Freeboard = () => {
  const [totalPages, setTotalPages] = useState(null); // 전체 페이지 수
  const [totalLength, setTotalLength] = useState(null); // 전체 댓글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const commentsPerPage = 10; // 한 페이지에 표시할 리뷰 수
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const loggedInUser = useSelector(selectUser);
  const navigate = useNavigate();
  // 페이지네이션 페이지를 선택하는 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    console.log(commentsPerPage);
    console.log(currentPage);
  }, [commentsPerPage, currentPage]);
  useEffect(() => {
    getReviews(currentPage, commentsPerPage);
  }, [currentPage, commentsPerPage]);
  const getReviews = async (currentPage, commentsPerPage) => {
    console.log(currentPage, commentsPerPage);
    let page = currentPage ? currentPage : 1;
    let size = commentsPerPage ? commentsPerPage : 10;
    try {
      // pagination 동작하면 size와 page 값을 동적으로 줘야 함.
      const res = await axios.get(`/v1/reviews?page=${page}&size=${size}`);
      const reviews = res.data.data;
      const totalPages = res.data.pageInfo.totalPages;
      const totalLength = res.data.pageInfo.totalElements;
      console.log(totalPages);
      setTotalPages(totalPages);
      setTotalLength(totalLength);
      console.log(reviews);
      setReviews(reviews);
      console.log("reviews are updated successfully");
    } catch (error) {
      console.error("Error fetching review datas: ", error);
    }
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.box}>
        <div className={classes.container}>
          <h1>게시판</h1>
          <div className={classes.posts}>
            <div className={classes.post}>
              <div className={classes.box1_}>
                <div className={classes.box1_id_}>번호</div>
                <div className={classes.box1_title_}>제목</div>
              </div>
              <div className={classes.box2_}>등록 일자</div>
            </div>
            {reviews.map((post) => (
              <div
                key={post.reviewId}
                className={classes.post}
                onClick={() => {
                  navigate(`/reviews/${post.reviewId}`);
                }}
              >
                <div className={classes.box1}>
                  <div className={classes.box1_id}>{post.reviewId}</div>
                  <div className={classes.box1_title}> {post.title}</div>
                </div>
                <div className={classes.box2}>
                  {post.createdAt.split("T")[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.under}>
          {totalPages > 0 && (
            <ReactPaginate
              previousLabel={<FiChevronLeft style={{ color: "#86B6F6" }} />}
              nextLabel={<FiChevronRight style={{ color: "#86B6F6" }} />}
              pageCount={totalPages}
              onPageChange={handlePageClick}
              containerClassName={classes.pagination}
              pageLinkClassName={classes.pagination__link}
              activeLinkClassName={classes.pagination__link__active}
              renderPagination={() => null}
            />
          )}
          <div className={classes.btnCon}>
            <button
              className={classes.postBtn}
              onClick={() => {
                navigate("/reviews/new");
              }}
            >
              새 글 등록
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Freeboard;
