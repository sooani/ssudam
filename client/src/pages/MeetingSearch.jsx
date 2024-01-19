import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "../styles/pages/MeetingSearch.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { MdSearch } from "react-icons/md";
const MeetingSearch = () => {
  const [searched, setSearched] = useState(null);
  const [searchkeyword, setSearchkeyword] = useState(null);
  const [totalPages, setTotalPages] = useState(null); // 전체 페이지 수
  const [totalLength, setTotalLength] = useState(null); // 전체 검색 결과 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const commentsPerPage = 10; // 한 페이지에 표시할 검색 결과 수
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  // const axios = useAxiosInstance();
  const { searchkeyword: urlSearchKeyword } = useParams();
  // 페이지네이션 페이지를 선택하는 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    console.log(commentsPerPage);
    console.log(currentPage);
    getResults(currentPage, commentsPerPage);
  }, [commentsPerPage, currentPage]);
  useEffect(() => {
    if (searchkeyword) {
      getResults(currentPage, commentsPerPage);
    }
  }, [searchkeyword]);
  useEffect(() => {
    setSearchkeyword(urlSearchKeyword || "");
  }, [urlSearchKeyword]);
  const getResults = async (currentPage, commentsPerPage) => {
    console.log(currentPage, commentsPerPage);
    let page = currentPage ? currentPage : 1;
    let size = commentsPerPage ? commentsPerPage : 10;
    try {
      // pagination 동작하면 size와 page 값을 동적으로 줘야 함.
      const res = await axios.get(
        `/v1/parties/search?keyword=${searchkeyword}&page=${page}&size=${size}`
      );
      const results = res.data.data;
      console.log(results);
      const totalPages = res.data.pageInfo.totalPages;
      const totalLength = res.data.pageInfo.totalElements;
      console.log(totalPages);
      setTotalPages(totalPages);
      setTotalLength(totalLength);

      setSearched(results);
      console.log("results are updated successfully");
    } catch (error) {
      console.error("Error fetching result datas: ", error);
    }
  };
  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
  }; // 돋보기 이모지의 handler...아마 필요 없을 예정...
  const onSearchHandler = () => {
    console.log("입력 완료");
  };
  const searchHandler = () => {
    getResults(currentPage, commentsPerPage);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchHandler();
    }
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.container}>
        <div className={classes.search}>
          {/* <MdSearch className={classes.icon} onClick={onSearchHandler} /> */}
          <input
            type="text"
            placeholder="검색할 키워드를 입력하세요..."
            value={searchkeyword}
            onChange={onKeywordHandler}
            onKeyPress={handleKeyPress}
          />
          <MdSearch onClick={searchHandler} className={classes.icon}>
            검색
          </MdSearch>
        </div>
        <div className={classes.posts}>
          <div className={classes.post}>
            <div className={classes.box1_}>
              <div className={classes.box1_id_}>번호</div>
              <div className={classes.box1_title_}>제목</div>
            </div>
            <div className={classes.box2_}>등록 일자</div>
          </div>
          {searched &&
            searched.map((post) => (
              <div
                key={post.partyId}
                className={classes.post}
                onClick={() => {
                  navigate(`/meetings/${post.partyId}`);
                }}
              >
                <div className={classes.box1}>
                  <div className={classes.box1_id}>{post.partyId}</div>
                  <div className={classes.box1_title}> {post.title}</div>
                </div>
                <div className={classes.box2}>
                  {post.createdAt.split("T")[0]}
                </div>
              </div>
            ))}
        </div>
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
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </div>
  );
};
export default MeetingSearch;
