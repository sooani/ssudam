import { useState, useEffect } from "react";
import classes from "./MakePost.module.css";
import Layout from "../components/Layout/Layout";
import MakeMap from "../components/Map/MakeMap";
import { MdSearch } from "react-icons/md";
const MakePost = () => {
  const [address, setAddress] = useState({});
  const addressHandler = () => {};
  return (
    <Layout>
      <div className={classes.container}>
        <h1>모임 글 등록</h1>
        <div className={classes.title}>
          <h2>제목</h2>
          <input type="text" placeholder="글 제목을 입력하세요..." />
        </div>
        <div className={classes.info}>
          <div className={classes.inputs}>
            <h2>상세 정보</h2>
            <div className={classes.field}>
              <h3>모임 이름</h3>
              <input type="text" />
            </div>
            <div className={classes.field}>
              <h3>모임 장소</h3>
              <input
                type="text"
                value={address.address_name}
                onChange={addressHandler}
              />
            </div>
            <div className={classes.field}>
              <h3>모임 인원</h3>
              <input type="number" />
            </div>
            <div className={classes.field}>
              <h3>모임 날짜</h3>
              <input type="date" />
            </div>
            <div className={classes.field}>
              <h3>모임 마감일</h3>
              <input type="date" />
            </div>
            <div className={classes.field}>
              <h3>연락 방법</h3>
              <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
            </div>
          </div>
          <div className={classes.map}>
            <div className={classes.search}>
              <input type="text" placeholder="검색할 장소를 입력하세요..." />
              <MdSearch style={{ width: "1.5rem", height: "1.5rem" }} />
            </div>
            <MakeMap setAddress={setAddress} />
          </div>
        </div>
        <div className={classes.comment}>
          <h2>내용</h2>
          <textarea placeholder="내용을 작성해주세요..." />
          <div className={classes.btnCon}>
            <button>취소</button>
            <button>글 등록</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default MakePost;
