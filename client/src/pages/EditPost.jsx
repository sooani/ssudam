import { useState, useEffect } from "react";
import classes from "../styles/pages/MakePost.module.css";
import MakeMap from "../components/Map/MakeMap";
import SearchMap from "../components/Map/SearchMap";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import KakaoMap from "../components/Map/KakaoMap";
const EditPost = () => {
  // 도로명 주소
  const [address, setAddress] = useState({});
  // 검색용 키워드
  const [searchkeyword, setSearchkeyword] = useState("");
  // 오늘 날짜에서 년/월/일 도출
  const today = new Date().toISOString().split("T")[0];

  // map 에서 추출한 주소 뒤에 상세 주소 붙이는 function
  const addressHandler = (e) => {
    setAddress({ ...e.target.value });
  };
  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
    console.log(searchkeyword);
  };
  // 돋보기 이모지의 handler...아마 필요 없을 예정...
  const onSearchHandler = () => {
    console.log("입력 완료");
  };

  const submitHandler = (e) => {
    e.preventdefault();
    console.log("submit 완료");
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <form onSubmit={submitHandler}>
        <div className={classes.container}>
          {/* <h1>모임 글 등록</h1> */}
          <div className={classes.title}>
            <h2>제목</h2>
            <input type="text" placeholder="글 제목을 입력하세요..." />
          </div>
          <div className={classes.info}>
            <div className={classes.inputs}>
              <h2>상세 정보</h2>
              <div className={classes.field}>
                <h4>모임 이름</h4>
                <input type="text" />
              </div>
              <div className={classes.field}>
                <h4>모임 장소</h4>
                <input
                  type="text"
                  value={address.address_name}
                  onChange={addressHandler}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 인원</h4>
                <input
                  type="number"
                  placeholder="2명 이상~50명 이하"
                  min={2}
                  max={50}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 날짜</h4>
                <input type="date" min={today} />
              </div>
              <div className={classes.field}>
                <h4>모임 마감일</h4>
                <input type="date" min={today} />
              </div>
              <div className={classes.field}>
                <h4>연락 방법</h4>
                <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
              </div>
            </div>
            <div className={classes.map}>
              <div className={classes.search}>
                <input
                  type="text"
                  placeholder="검색할 장소를 입력하세요..."
                  value={searchkeyword}
                  onChange={onKeywordHandler}
                />
                <MdSearch
                  style={{ width: "1.5rem", height: "1.5rem" }}
                  onClick={onSearchHandler}
                />
              </div>
              {/* <KakaoMap /> */}
              {/* <MakeMap setAddress={setAddress} searchkeyword={searchkeyword} /> */}
              <SearchMap
                setAddress={setAddress}
                searchkeyword={searchkeyword}
              />
            </div>
          </div>
          <div className={classes.comment}>
            <h2>내용</h2>
            <textarea placeholder="내용을 작성해 주세요..." />
            <div className={classes.btnCon}>
              <button>취소</button>
              <button type="submit">글 수정</button>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};
export default EditPost;
